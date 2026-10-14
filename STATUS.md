# STATUS

最終更新: 2026-10-14（S-0015）

## 現在地
- 学習ステップ6（PostgreSQL）を完了。次はステップ7（公開）（S-0015）
- 作成物は `app/`。`src/client/main.ts` → `public/main.js`、`src/server/server.ts` → `dist/server.js` を `npm run build` で変換し、`npm run dev` で起動（D-0015）。変換したものと `node_modules/`・`.env` は git に入れない（D-0011）。API は GET・POST `/api/todos`、PATCH・DELETE `/api/todos/:id`
- ToDo は PostgreSQL（Postgres.app、v18）の `todo_app` データベースの `todos` テーブルに保存。作り方は `app/db/schema.sql`、接続は `.env` の `DATABASE_URL`（見本は `.env.example`）。Postgres.app が止まっていると API は 500
- `app/` は別リポジトリで GitHub `Miyamura-rq/todo-app` に学習者が push。外側は `Miyamura-rq/todo-app-remote`（D-0012、D-0013）。SSH 鍵はパスフレーズつき。`ssh-add --apple-use-keychain` で登録すると Claude の実行環境からも push できる（Mac の再起動で外れる。`~/.ssh/config` は未設定）。練習用ファイルは外側の `practice/`
- 仕様：期限あり、リマインドは余裕があれば後で（D-0006）。一覧はリスト、完了はチェックで残す（D-0008）。画面は `todos` から `render()` で作り直し、操作のたびに GET で取り直す（D-0009）
- 進め方：軽い知識は答えを教える（D-0007）。選択肢は Claude がおすすめを決める（D-0010）。始めの3問はしない（D-0014）。新しい書き方は Claude が型（戻り値の形も）を先に示す（D-0016）。確認のコマンドは毎回書く（D-0017）。デザインの値は Claude が提案（`docs/learning/reference/design.md`）
- 学習状況は `docs/learning/progress.md`、まとめは `docs/learning/notes/`、早見表は `docs/learning/reference/`

## 次にやること
- 公開先・DB についての会社の決まりを確認し、ステップ7の学習内容を作って始める
- （任意）`~/.ssh/config` に `AddKeysToAgent yes`・`UseKeychain yes` を書き、再起動後も鍵を自動で読み込む
- 自宅の Mac に外側と `app/` を clone し、`~/.claude/CLAUDE.md` と `~/.claude/skills/` をコピーする（D-0012）。Postgres.app も入れて README の手順で DB を作る

## 未解決・要確認
- `""` と `null` の違い、入力はサーバーで確かめる理由（S-0015）
- `tsc` は「検証して変換」、`node` が「実行」（検証が抜ける。S-0015）
- id が要る理由の①（ブラウザとサーバーは別のオブジェクトなので `!==` が使えない）（S-0013）
- 目的の違う変更はコミットを分ける（`git add ファイル名`）（S-0013、S-0015）
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- 「web 上で動く」の意味と、公開先・DB の会社の決まり（ステップ7の前に確認）
- テストコマンド（ステップ8で決める）
