# ステップ9：DB を Drizzle ORM に置き換える（Issue #4）（まとめ）

期間: 2026-11-01
ゴール: テーブルの定義とマイグレーションを Drizzle（drizzle-kit）で管理し、`server.ts` の SQL をすべて Drizzle のクエリにする。発行される SQL をログで見る → 達成（ステップ8 のタグの表と API も含めた。D-0033。PR #8 はメンターのレビュー待ち）
ブランチ: `feature/4-drizzle`（`main` から）→ PR #8（→ `main`）
進め方: ステップ9 から、コードの多くを Claude が書いて解説し、★だけ学習者が書く（D-0030）

早見表（紹介しただけで使っていない知識も含む）
- 外部キーと `ON DELETE`・`JOIN` から `json_agg` まで（Drizzle が出す SQL を読むとき）：[reference/database.md](../reference/database.md)
- ORM・クエリビルダー・マイグレーションの選択肢：[reference/database.md](../reference/database.md) の「7. 技術の選択肢」
- API ごとの前後の SQL（PR の材料）：[pr/issue-4.md](../pr/issue-4.md)

---

## 全体の流れ

```
表をつくる
前  db/schema.sql を手で書く → psql -f で流す（表を変えるときは DB ごと作り直す）
後  src/server/db/schema.ts（TypeScript）に表を書く
    → npm run db:generate  schema.ts と前回の状態（drizzle/meta/）を比べ、差分の SQL ファイルを drizzle/ に作る（DB にはさわらない）
    → npm run db:migrate   まだ流していないファイルだけを DB に流し、drizzle.__drizzle_migrations に記録する
    （drizzle-kit pull は逆向き。今の DB から schema.ts の下書きを作る。9-2 で1回だけ使った）

読み書き
前  pool.query("SELECT ... WHERE user_id = $1", [userId])   SQL はただの文字列。書き間違いは実行して初めてわかる
後  db.select(...).from(todos).where(eq(todos.userId, userId))
    → Drizzle が SQL と $1 を作る（logger: true でターミナルに出る）。表名・列名・型の間違いは tsc で止まる
```

```
マイグレーションの記録（どの PC でも同じコマンドでそろう）
drizzle/0000_init.sql   users・todos・sessions          ← 9-3
drizzle/0001_tags.sql   tags・todo_tag、todos の UNIQUE  ← 9-5（今の DB には、この差分だけが流れた。ToDo は残った）
DB の drizzle.__drizzle_migrations   流したファイルを1行ずつ記録（2回流しても何も起きない）
```

## 作ったもの

```
app/（ブランチ feature/4-drizzle）
├── package.json             drizzle-orm 0.45.4・drizzle-kit 0.31.11、scripts に db:generate・db:migrate
├── drizzle.config.ts        dialect・schema・out・DATABASE_URL（drizzle-kit は .env を読まないので process.loadEnvFile()）
├── drizzle/                 0000_init.sql・0001_tags.sql と meta/（スナップショットと記録）
├── db/schema.sql            消した
├── src/server/db/schema.ts  5つの表の定義と、$inferSelect の型（User・Todo・Session・Tag）
├── src/server/db/index.ts   Pool と drizzle({ client: pool, schema, logger: true })
├── src/server/server.ts     pool.query をすべて Drizzle に。手で書いた型と types.setTypeParser を消した
├── src/server/tsconfig.json skipLibCheck: true
└── README.md                DB の作り方を createdb → npm run db:migrate に。5つの表、タグの API、SQL のログ、PORT
```

```
表の定義（前 → 後）

-- 前（db/schema.sql）
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text TEXT NOT NULL,
    deadline DATE,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
    UNIQUE (id, user_id)
);

// 後（src/server/db/schema.ts）
export const todos = pgTable("todos", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    text: text().notNull(),
    deadline: date(), // 文字列 "2026-11-05" のまま読み書きする
    done: boolean().notNull().default(false),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
}, (table) => [
    unique().on(table.id, table.userId), // todo_tag の2つの列の外部キーが指すため
]);

export type Todo = typeof todos.$inferSelect;   // SELECT で返る1行の型を、表の定義から作る
```

- 左の名前（`userId`）が TS で使う名前、`"user_id"` が DB の列名
- 2つの列の外部キーは `foreignKey({ columns: [...], foreignColumns: [...] }).onDelete("cascade")`、組の主キーは `primaryKey({ columns: [...] })`

```
クエリ（前 → 後）。ログイン

// 前
const login = await pool.query<UserLogin>(
    "SELECT id, email, password_hash FROM users WHERE email = $1",
    [trimmedEmail]
);
const user = login.rows[0];
if (login.rowCount === 0) { … 401 }

// 後
const [user] = await db
    .select({ id: users.id, email: users.email, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, trimmedEmail));
if (!user) { … 401 }
```

```
クエリ（前 → 後）。完了の更新（★学習者）

// 前
const result = await pool.query<Todo>(
    "UPDATE todos SET done = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [req.body.done, req.params.id, userId]
);
if (result.rowCount === 0) { … 404 }
res.json(result.rows[0]);

// 後
const result = await db
    .update(todos)
    .set({done: req.body.done})
    .where(and(eq(todos.id, Number(req.params.id)), eq(todos.userId, userId)))
    .returning(todoColumns);
if (result.length === 0) { … 404 }
res.json(result[0]);
```

| 前（pg） | 後（Drizzle） |
|---|---|
| 結果は `result.rows`、件数は `result.rowCount` | 結果は配列そのもの。件数は `result.length` |
| 1件は `result.rows[0]` | `const [user] = await db...`、なければ `undefined`（`if (!user)`） |
| `WHERE email = $1` と値の配列 | `.where(eq(users.email, trimmedEmail))`（Drizzle が `$1` にする） |
| `AND`、`> NOW()` | `and(eq(…), eq(…))`、`` gt(sessions.expiresAt, sql`now()`) `` |
| `RETURNING *`（`user_id` も返る） | `.returning(todoColumns)`（返す列を決めたオブジェクト。`user_id` は返さない） |
| `ON CONFLICT (email) DO NOTHING` | `.onConflictDoNothing({ target: users.email })` |
| 関数で書けない SQL | `` sql`…` ``（`now() + interval '7 days'`、一覧の `json_agg`） |
| 手で書いた型 `type Todo = {…}` | `typeof todos.$inferSelect`。select の結果にも型が自動でつく |
| `req.params.id`（文字列のまま SQL へ） | `Number(req.params.id)`（`todos.id` は integer なので、文字列は `tsc` が止める） |

```
トランザクション（前 → 後）。ToDo を作るときの tagIds（9-5）

前  const client = await pool.connect() → BEGIN → … → COMMIT。だめなら ROLLBACK して return
    catch で ROLLBACK して throw、finally で release()（全部自分で書く）
後  const todo = await db.transaction(async (tx) => {
        tx.insert(todos)… → タグごとに tx.select(tagColumns)… → なければ tx.rollback()
        → tx.insert(todoTag)….onConflictDoNothing(…).returning(…)
        return { ...newTodo, tags: tagList };   // ここまで来たら COMMIT
    });
    外の catch で TransactionRollbackError なら 400、ほかは throw
    接続を借りる・BEGIN・COMMIT・ROLLBACK・返すのは db.transaction がする（ログに begin → … → commit / rollback が出る）
```

### このステップで決めたこと
| 内容 | 却下した案 | 決定 |
|---|---|---|
| コードの多くを Claude が書いて解説し、★だけ学習者が書く。`app/` のコミットと push も Claude | 学習者が全部書く（時間が足りない）、Claude が全部書く（手を動かさないと身につきにくい） | D-0030 |
| ステップ9〜12 は Issue #4〜#7（0周目：うえさかと同じ技術スタックに1つずつ移す） | 前に決めたステップ9・10（Issue #2・#3） | D-0031 |
| ステップ8 のタグもステップ9 で Drizzle に移す。トランザクションは `db.transaction` | タグのない `main` だけを移す（D-0032）、#7 のあとで作り直す | D-0033 |
| drizzle-orm 0.45.4・drizzle-kit 0.31.11 | 1.0（beta） | D-0010 |
| `pull` は `main` の `schema.sql` で作った使い捨ての DB から行い、出力を整えて `schema.ts` に（長い identity の設定を省く、外部キーは `.references(…, { onDelete })`） | 今の `todo_app` から（タグの表まで入る） | D-0010 |
| `relations.ts` は使わない | `relations` と `db.query`（関数で書く SELECT だけで足りる） | D-0010 |
| 返事の列は `todoColumns`・`tagColumns` で決め、`user_id` を返さない | `RETURNING *` と同じく全部の列 | D-0010 |
| ★作るときの `tagIds` は、学習者の判断で Claude が書いた（8-4 C で一度書いたため） | 学習者が書く | D-0030 の範囲 |

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| `tsc` が drizzle-orm の中で 142 個のエラー | ほかの DB 用の型ファイルまで調べていた | `skipLibCheck: true`（ライブラリの型ファイルは調べない） |
| `0001_tags.sql` が流れない（`drizzle-kit migrate` はエラーの文を出さず exit 1 だけ） | drizzle-kit が `todos` の `UNIQUE (id, user_id)` を外部キーのあとに置いた（8-1 と同じ `there is no unique constraint matching given keys ...`） | psql で流して理由を見る。`UNIQUE` を先頭に移してコメントを残す。使い捨ての DB で 0000・0001 が通ってから本物に流す |
| ★：`select(*)`、`orderBy(id)` | SQL の書き方のまま | `select(todoColumns)`、`orderBy(todos.id)`（列は表のオブジェクトから選ぶ） |
| ★：`todos.user_id` | DB の列名と TS の名前の混同 | `todos.userId`（`schema.ts` の左側の名前） |
| ★：`result.rows`・`rowCount` の名残、一覧に `const [todo]`、PATCH が配列を返す | pg と Drizzle で結果の形が違う | Drizzle は配列そのもの。一覧は `result`、1件は `result[0]`、0件は `result.length === 0` |
| ★：`set(eq(…))` | `set` と `where` の役割の混同 | `set({ done })` は変える値、`where(and(eq(…), eq(…)))` は対象の行 |
| ★：`req.params.id` を文字列のまま渡した | pg は文字列でも通したが、`todos.id` は integer | `Number(req.params.id)` |
| Claude が HTTP で確かめられない | ポート 3000 で学習者のサーバー（古いビルド）が動いていた。同じポートは1つのプログラムしか使えない | `Number(process.env.PORT ?? 3000)` にして、Claude は 3001 で起動 |
| ログの `params` にパスワードやセッションのハッシュが出る | `logger: true` は値も出す | PR に貼るときは `params` を省く |
| npm がインストールスクリプトを止めた警告（esbuild・argon2） | npm の安全のための設定 | 動きに影響なし。許可は学習者の判断 |
| `gh auth login` が失敗 | 日本語入力のまま Enter を押した。GitHub の本人確認（sudo モード） | GitHub の画面で PR を作る。本文は学習者のターミナルで `pbcopy`（Claude の環境の `pbcopy` はクリップボードに届かない） |
| PR の本文が長い（「こんな長く書くもの？」） | 前後の SQL まで全部見える所に置いた | 「何をしたか・どう確かめたか・伝えたいこと」で十分。約15行にし、前後の SQL は折りたたみ |

## 理解度チェック（2026-11-01、前提6つの言い直し）
| 質問 | 結果 |
|---|---|
| ORM とは | 「TS と SQL（DB）を連携させる道具。型のチェックがしやすく、毎回 SQL を参照せずに済む」→ 正解 |
| マイグレーションとは | 「表の差分を DB に送信する手段」→ 半分。差分が番号つきの SQL ファイルとして残る（履歴）、どこまで流したかを DB が記録するので、どの PC でも同じコマンドでそろう、が抜けた（補足） |
| `pull`・`generate`・`migrate` | `pull`（DB から構造を持ってくる）と `migrate`（差分の送信）は正解。`generate` は「作成」まで → `schema.ts` と前回の状態を比べて差分の SQL ファイルを作る、DB にはさわらない（補足） |
| プレースホルダと SQL インジェクション | 「送ったテキストと地のコードを区別して、入力からの操作を防ぐ」→ 正解。Drizzle は `eq()` が自動で `$1` にする（補足） |
| 外部キーと `ON DELETE CASCADE` | 「元の表の要素が消えたら、つながった表の要素も消える」→ CASCADE は正解。外部キー自体は「指す先の行がないと入れられない」制約で、CASCADE がないと（NO ACTION）消す方が止まる（補足） |
| `$inferSelect` | 答えられず（要復習）。`schema.ts` の表の定義から「SELECT で返る1行の型」を自動で作るもの |

## 要復習
- `$inferSelect`：表の定義から1行の型を作る。手で `type Todo = {…}` を書かなくてよい（Q6）
- マイグレーション：差分が番号つきのファイルで残り、DB が流した分を記録する。だから別の PC でも `npm run db:migrate` だけでそろう（Q2）
- `generate` は SQL ファイルを作るだけで DB にさわらない。流すのは `migrate`（Q3）
- 外部キーは「指す先の行がないと入れられない」制約。`ON DELETE` はそのうえで消すときの決まり（Q5。ステップ8 の Q3 と同じところ）
- ステップ8から持ち越し：中間の表の1行、ROLLBACK と id の番号、`pool.connect()` を使う理由（今は `db.transaction` がしている）、`ON CONFLICT` が先に効く
- ステップ7から持ち越し：認証と認可、Cookie に `userId` を入れない理由、合言葉がソルトなしでよい理由、`SameSite=Lax`
