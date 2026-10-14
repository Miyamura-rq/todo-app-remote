# ステップ6：データベース（PostgreSQL）（まとめ）

期間: 2026-10-14（約4.5時間）
ゴール: ToDo を PostgreSQL に保存し、サーバーを止めても消えないようにする（API と画面は変えない） → 達成

早見表（紹介しただけで使っていない知識も含む）
- PostgreSQL・SQL・pg・環境変数：[reference/database.md](../reference/database.md)

---

## 作ったもの

```
app/
├── .env                .env の DATABASE_URL（git に入れない）
├── .env.example        見本（git に入れる。.gitignore に !.env.example）
├── db/schema.sql       todos テーブルの作り方（CREATE TABLE IF NOT EXISTS）
├── package.json        start に --env-file=.env、pg と @types/pg を追加
├── src/server/server.ts  配列 todos と nextId をやめて SQL に
└── src/client/main.ts    type Todo の deadline を string | null に（ほかは変えていない）
```

```
server.ts の形

types.setTypeParser(DATE, そのまま)      DATE を "2026-10-15" の文字列で受け取る
DATABASE_URL がなければ throw → Pool を作る
GET    /api/todos      SELECT * FROM todos ORDER BY id              → 200 + rows
POST   /api/todos      INSERT ... VALUES ($1, $2) RETURNING *       → 201 + rows[0]（deadline は "" なら null）
PATCH  /api/todos/:id  UPDATE ... SET done = $1 WHERE id = $2 RETURNING *  → 200 + rows[0] / rowCount 0 で 404
DELETE /api/todos/:id  DELETE ... WHERE id = $1                     → 204 / rowCount 0 で 404
```

```
データの置き場所
ステップ3・4：ブラウザのメモリ   → 再読み込みで消える
ステップ5  ：サーバーのメモリ   → サーバーを止めると消える
ステップ6  ：データベース        → 止めても消えない。本物は DB の1か所、ブラウザの todos は写し
```

```
作り方のファイル（git に入れる）と、作られるもの（git に入れない）
package.json   → npm install        → node_modules/
main.ts        → npm run build      → public/main.js
db/schema.sql  → psql -f            → todos テーブル
.env.example   → cp して書き換え    → .env
```

### このステップで決めたこと（D-0010 で Claude がおすすめを決めたもの）
| 内容 | 却下した案 |
|---|---|
| PostgreSQL は Postgres.app で入れる | Homebrew（未導入）、Docker（覚えることが増える）、公式インストーラー |
| DB には `pg` で SQL をそのまま送る | postgres.js、ORM（6-5 で紹介） |
| `.env` は Node.js の `--env-file` で読む | dotenv（追加のインストールが要る） |
| DATE は `setTypeParser` で文字列のまま受け取る | SQL で `deadline::text`（毎回書く必要がある） |
| 期限の `""` はサーバーで `null` にする | main.ts で直す（curl から送られると同じ 500）、SQL の `NULLIF` |
| テーブルの作り方は `schema.sql` に残す | マイグレーション（表の形を変えるときに必要） |

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| `\q` のあと zsh に `\conninfo` → `command not found` | psql を抜けていた | 行頭が `=#` なら psql、`%` なら zsh |
| 練習のテーブルが `recerqa` にできた | `psql` だけだとユーザー名と同じデータベースにつながる | `psql todo_app`。行頭でどの箱にいるか見る |
| id が自動でつかない・重複できる | `INTEGER NOT NULL` だけだった | `GENERATED ALWAYS AS IDENTITY PRIMARY KEY` |
| `syntax error at or near "AlWAYS"` | `GENERATED` 抜け | `^` の直前に足りないものがある |
| `WHERE` なしの `UPDATE` で全件 true | 全行が対象になる | 先に同じ `WHERE` で `SELECT`、件数を見る |
| `SELECT NOW()` の結果をどう返すか分からない | `result` の形が示されていなかった（Claude の説明不足） | `rows` は配列、1行はキーが列名のオブジェクト。`rows[0]` |
| `import { get } from "http"`、`import { todo } from "node:test"` | VS Code が候補から自動で足した（2回） | 使っていない import は消す。候補を選ぶとき注意 |
| `.env.example` が `git status` に出ない | `.gitignore` の `.env.*` に当てはまる | `!.env.example` |
| テーブル名に `todo_app` | データベース（箱）とテーブルの混同 | 箱は接続文字列で決まる。テーブルは `todos` |
| POST が id 0 を返す、PATCH が変える前を返す | DB の結果を受け取らず、自分で作ったもの・前に取ったものを返した | `RETURNING *` の結果（`rows[0]`）を返す |
| PATCH・DELETE で SELECT してから変更 | 1回で分かることを2回に分けた | `rowCount` で 404。SQL は1回 |
| GET まで `rows[0]` にした | 直しすぎ | 一覧は `rows`、1件は `rows[0]` |
| どの操作も 500（`ECONNREFUSED`） | Postgres.app が止まっていた | Start。README にも「起動しておく」 |
| 直したのに変わらない（2回） | ビルドとサーバーの起動し直しをしていない | `Ctrl + C` → `npm run dev` |
| 期限なしで 500（`invalid input syntax for type date: ""`） | `""` は日付ではない（`null` とは別物） | サーバーで `req.body.deadline \|\| null` |
| `schema.sql` の目的が分からない | DB の中身が git の外にあることが伝わっていなかった | 自宅の Mac で clone するとテーブルがない。`package.json` と同じ「作り方のファイル」 |
| 直した `schema.sql` が反映されない | 古いテーブルが残っていた（`IF NOT EXISTS` だと黙って成功） | DB ごと作り直して確かめる |
| README の箇条書きの次の行がつながる | Markdown の決まり | 半角スペース2つ + `- ` で1段下げる |

## 理解度チェック（2026-10-14）
| 質問 | 結果 |
|---|---|
| ステップ6で止めても消えなくなった理由 | 「todos を DB 側で管理し始めた」と説明できた（DB はサーバーとは別のプログラムで、ディスクに書き込む、は補足） |
| `$1` を使う理由 | 「SQL インジェクションを防ぐ」と答えられた。仕組み（`1 OR 1=1` が SQL の一部になる、`$1` はただの値として扱われる）は補足 |
| 期限なしで 500 になった原因と、server.ts で直した理由 | 「null が string 型に合わない」と回答 → 原因は `""` が DATE 列に合わないこと（null は直し方）。サーバーで直す理由（門番。curl からも送られる）が抜けた（要復習） |
| `npm run dev` での `tsc` と `node` の役割（持ち越し） | 「ts を js に変換、そのあとサーバーが起動」と答えられた（前回より改善）。`tsc` の「型の検証」が抜けた |

## 要復習
- `""` と `null` の違い、入力はサーバーで確かめる理由（理解度チェック Q3）
- `tsc` は「検証して変換」（変換は答えられた。検証が抜けた）
- id が要る理由の①（オブジェクトの比較が使えない）（ステップ5から持ち越し）
- 目的の違う変更はコミットを分ける（ステップ6も1つのコミットにまとめた。`git add ファイル名`）
- VS Code の自動 import に気づく
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
