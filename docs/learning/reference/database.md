# データベース（PostgreSQL・SQL・pg）（早見表）

作成: 2026-10-14（ステップ6）
詳しく調べるとき: [PostgreSQL 日本語ドキュメント](https://www.postgresql.jp/document/)、[node-postgres（pg）](https://node-postgres.com/)、[Postgres.app](https://postgresapp.com/)

各表の「使った」欄の印：✅ = ToDo アプリで使った、空欄 = 紹介だけ（必要になったら使う）

---

## 1. 言葉

| 言葉 | 意味 |
|---|---|
| データベース（箱） | テーブルを入れる入れ物。1つの PostgreSQL の中にいくつも作れる（`todo_app`、`recerqa` など） |
| テーブル | 表。`todos` |
| 列（カラム） | 項目。型が決まっている（`id`、`text`…） |
| 行（レコード） | データ1件。ToDo 1つ |
| 主キー | 行を1つに決める列。重複も NULL も禁止 |
| NULL | 値がない。`""`（長さ0の文字列）とは別物 |
| 索引（インデックス） | 列からすぐ行を探すための仕組み。主キーには自動で作られる |

## 2. ターミナルで使うコマンド（zsh の `%` で打つ）

| コマンド | 意味 | 使った |
|---|---|---|
| `psql` | ユーザー名と同じ名前のデータベースにつなぐ | ✅ |
| `psql todo_app` / `psql -d todo_app` | 指定したデータベースにつなぐ | ✅ |
| `psql -d todo_app -f db/schema.sql` | ファイルの SQL を順に実行する | ✅ |
| `psql -d todo_app -c "SQL"` | SQL を1つだけ実行して終わる | ✅ |
| `createdb 名前` / `dropdb 名前` | データベースを作る／消す（元に戻せない） | ✅ |
| `psql --version` | 版を見る | ✅ |
| `pg_dump todo_app > backup.sql` | データベースの中身をファイルに書き出す（バックアップ） | |

## 3. psql の命令（`todo_app=#` で打つ。SQL ではない）

| 命令 | 意味 | 使った |
|---|---|---|
| `\l` | データベースの一覧 | ✅ |
| `\c 名前` | つなぐデータベースを切り替える | ✅ |
| `\dt` | テーブルの一覧 | ✅ |
| `\d テーブル名` | 列・型・制約・索引 | ✅ |
| `\conninfo` | どこに誰としてつながっているか | ✅ |
| `\q` | 終わる | ✅ |
| `\e` | 直前の文をエディタで直す | |
| `\x` | 結果を縦に並べる（列が多いとき） | |

- 行頭が `=#` なら新しい文、`-#` なら `;` 待ちの続き。抜けられないときは `Ctrl + C`
- `(END)` はページャー。`q` で抜ける
- ↑ キーで前の文を呼び出せる

## 4. SQL

### テーブルを作る・消す
```sql
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text TEXT NOT NULL,
    deadline DATE,
    done BOOLEAN NOT NULL DEFAULT FALSE
);
DROP TABLE todos;      -- 中身ごと消える。元に戻せない
```
- 列は `列名 型 制約` の順
- 最後の列のあとに `,` は書かない。文の終わりに `;`

2つの表をつなぐ（7-2）：
```sql
CREATE TABLE IF NOT EXISTS users (          -- 指される側を先に作る
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS todos (
    ...
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```
- たとえ：`users` は会員名簿、`user_id` は会員番号の欄、`REFERENCES` は「名簿にある番号しか書けない」ルール
- 指す側の列は、相手の列と同じ型にする。`GENERATED` はつけない（番号を作るのは相手の側）
- `REFERENCES users` のように `(列)` を省くと、相手の主キーを指す

| 型 | 入るもの | 使った |
|---|---|---|
| `INTEGER` | 整数 | ✅ |
| `TEXT` | 長さ制限なしの文字列 | ✅ |
| `VARCHAR(n)` | n 文字までの文字列 | |
| `BOOLEAN` | true / false | ✅ |
| `DATE` | 日付 | ✅ |
| `TIMESTAMPTZ` | 日時（タイムゾーンつき） | ✅（`NOW()`） |
| `NUMERIC(p, s)` | 小数（お金など、誤差を出したくない数） | |

| 制約 | 意味 | 使った |
|---|---|---|
| `NOT NULL` | 空を許さない（TS の `?` なし） | ✅ |
| `DEFAULT 値` | 指定しなかったときの値 | ✅ |
| `PRIMARY KEY` | 主キー（NOT NULL を含む） | ✅ |
| `GENERATED ALWAYS AS IDENTITY` | 番号を自動でつける（古い書き方は `SERIAL`）。消した番号は使い回さない | ✅ |
| `UNIQUE` | 重複禁止 | ✅（`users.email`） |
| `REFERENCES 別テーブル(列)` | 別のテーブルの行を指す（外部キー）。相手にない値は入れられない | ✅（`todos.user_id`） |
| `ON DELETE CASCADE` | 指している相手が消えたら、こちらの行も消える | ✅ |
| `ON DELETE RESTRICT` | こちらの行が残っていたら、相手を消せない（何も書かないときもほぼ同じ） | |
| `ON DELETE SET NULL` | 相手が消えたら、こちらの列を NULL にする（NOT NULL の列には使えない） | |

### 追加・取得・変更・削除
| 操作 | 書き方 | API | 使った |
|---|---|---|---|
| 追加 | `INSERT INTO todos (text, deadline) VALUES ('牛乳', '2026-10-15');` | POST | ✅ |
| 取得 | `SELECT * FROM todos WHERE done = false ORDER BY id;` | GET | ✅ |
| 変更 | `UPDATE todos SET done = true WHERE id = 2;` | PATCH | ✅ |
| 削除 | `DELETE FROM todos WHERE id = 2;` | DELETE | ✅ |
| 件数 | `SELECT COUNT(*) FROM todos;` | | |
| 何行も追加 | `INSERT INTO users (email, password_hash) VALUES ('a@example.com', 'x'), ('b@example.com', 'y');` | | psql で試した |
| つないで取得 | `SELECT todos.text, users.email FROM todos JOIN users ON todos.user_id = users.id;` | | psql で試した |

- `JOIN 表B ON 条件` は、条件が合う行同士を横に並べる。列は `表名.列名` で区別する
- **失敗した `INSERT` でも番号は進む**（7-2 で、UNIQUE 違反・外部キー違反・NOT NULL 違反のたびに番号が1つ飛んだ）。id はすき間があって当たり前

- 文字列・日付は `'`（`"` は列名用）。`NULL` はクォートなし
- 比較は `=`、等しくないは `!=` / `<>`。NULL かどうかは `IS NULL` / `IS NOT NULL`
- `ORDER BY 列`（小さい順）、`DESC` で大きい順。NULL は小さい順で最後（`NULLS FIRST` / `NULLS LAST` で指定できる）
- **`WHERE` のない `UPDATE` / `DELETE` は全行が対象**。エラーも確認も出ない。先に同じ `WHERE` で `SELECT` して、件数（`UPDATE 1`）を見る
- `RETURNING *` を文の最後につけると、追加・変更・削除した行が返る（PostgreSQL の機能）
- `--` から行末はコメント

## 5. Node.js から使う（pg）

```ts
import { Pool, types } from "pg";

types.setTypeParser(types.builtins.DATE, (value) => value);   // DATE を "2026-10-15" の文字列のまま受け取る

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL がありません");
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const result = await pool.query<Todo>(
    "UPDATE todos SET done = $1 WHERE id = $2 RETURNING *",
    [req.body.done, req.params.id]
);
```

| 書き方 | 中身 | 使った |
|---|---|---|
| `result.rows` | 行の配列（1行でも配列。0行なら `[]`）。キーは列名 | ✅ |
| `result.rows[0]` | 1行目（オブジェクト） | ✅ |
| `result.rowCount` | 対象になった行の数。0 なら見つからなかった → 404 | ✅ |
| `pool.query<型>(...)` | `rows` の型を指定（指定しないと `any[]`） | ✅ |

| SQL | `rows` | `rowCount` |
|---|---|---|
| `SELECT ...` | 全部の行 | 行の数 |
| `INSERT ... RETURNING *` | `[追加した1行]` | 1 |
| `UPDATE ... WHERE id = $1 RETURNING *` | `[変えた後の1行]` か `[]` | 1 か 0 |
| `DELETE ... WHERE id = $1` | `[]` | 1 か 0 |

- **値は必ず `$1`, `$2` と配列で渡す**。文字列をつなげて SQL を作ると SQL インジェクション（`1 OR 1=1` で全件削除）
- SQL は1回で済ませる（SELECT してから UPDATE しない）。間に別のリクエストが入ってずれるのを防ぐ
- 型の対応：`timestamptz` / `date` → `Date`（DATE は上の設定で文字列に）、`NULL` → `null`
- `Pool` はファイルの最初で1回だけ作る

### 環境変数
| 書き方 | 意味 | 使った |
|---|---|---|
| `.env` に `DATABASE_URL=postgres://ユーザー@localhost:5432/todo_app` | 接続情報。**git に入れない** | ✅ |
| `.env.example` | 見本。git に入れる（`.gitignore` に `!.env.example`） | ✅ |
| `node --env-file=.env ファイル.js` | `.env` を読み込んで起動（Node.js 20.6〜） | ✅ |
| `process.env.名前` | 読む。型は `string \| undefined` | ✅ |
| `NODE_ENV=production` | 本番。Express がエラーの中身を隠す | |

接続文字列の形：`postgres://ユーザー:パスワード@ホスト:ポート/データベース名`

## 6. エラーの読み方

| エラー | 意味 |
|---|---|
| `syntax error at or near "X"` + `^` | 文法の間違い。`^` の**直前**に足りないものがあることが多い |
| `relation "todos" does not exist` | テーブルがない（違うデータベースにいる、まだ作っていない） |
| `relation "todos" already exists` | もうある（`IF NOT EXISTS` をつけると黙って成功するが、古いままでも気づけない） |
| `invalid input syntax for type date: ""` | 列の型に合わない値（`""` は日付ではない → `null` にする） |
| `connection to server on socket ... No such file or directory` | psql から：PostgreSQL が止まっている |
| `ECONNREFUSED` | Node.js から：PostgreSQL が止まっている（ネットワーク経由） |
| `duplicate key value violates unique constraint "users_email_key"` | `UNIQUE` の列に、もうある値を入れようとした |
| `violates foreign key constraint "todos_user_id_fkey"` | 外部キーの列に、相手の表にない値を入れようとした |
| `null value in column "user_id" ... violates not-null constraint` | `NOT NULL` の列に値を入れていない（7-2 のあと、画面からの追加が 500 になった原因） |
| `database "todo_app" is being accessed by other users` | `dropdb` のとき、サーバーなどがつないだまま。止めてから消す |

## 7. 技術の選択肢（紹介だけ）

| 分類 | 例 | 特徴 |
|---|---|---|
| RDB | **PostgreSQL**、MySQL | 決まった形のデータを表で持つ。ほとんどの業務アプリ |
| ファイル1つの DB | SQLite | サーバー不要。スマホアプリ、小さなツール、テスト |
| ドキュメント型 | MongoDB、Firestore | JSON のような形で保存。形がばらばらなデータ |
| キー・バリュー型 | Redis | メモリに置いて速い。キャッシュ、ログイン状態 |
| クエリビルダー | Kysely | TS の関数で SQL を組み立てる。列名を `tsc` が確かめる |
| ORM | Prisma、Drizzle | テーブルを TS のオブジェクトとして扱う。型の生成とマイグレーションも |
| マイグレーション | node-pg-migrate、Prisma Migrate | 表の形の変更を番号つきのファイルで積み上げる（本番でデータを残したまま変える） |
| マネージド DB | Supabase、Neon、AWS RDS、Cloud SQL | インターネット上の PostgreSQL。`DATABASE_URL` を変えるだけで今のコードが動く |
| 導入方法 | **Postgres.app**、Homebrew、Docker、公式インストーラー | Postgres.app はアプリを開くだけ。Docker は本番に近いが覚えることが増える |
