# STATUS

最終更新: 2026-10-14（S-0014）

## 現在地
- 学習ステップ6（PostgreSQL）を開始。項目は 6-1〜6-5（`docs/learning/progress.md`）（S-0014）
- 作成物は `app/`。`src/client/main.ts` → `public/main.js`、`src/server/server.ts` → `dist/server.js` を `npm run build` で変換し、`npm run dev` で起動（D-0015）。変換したものと `node_modules/` は git に入れない（D-0011）。API は GET・POST `/api/todos`、PATCH・DELETE `/api/todos/:id`。ToDo はサーバーのメモリにあり、止めると消える
- `app/` は別リポジトリで GitHub `Miyamura-rq/todo-app` に学習者が push。外側は `Miyamura-rq/todo-app-remote`（D-0012、D-0013）。SSH 鍵はパスフレーズつき。`ssh-add --apple-use-keychain` で登録すると Claude の実行環境からも push できる（Mac の再起動で外れる。`~/.ssh/config` は未設定）。練習用ファイルは外側の `practice/`
- 仕様：期限あり、リマインドは余裕があれば後で（D-0006）。一覧はリスト、完了はチェックで残す（D-0008）。画面は `todos` から `render()` で作り直し、操作のたびに GET で取り直す（D-0009）
- 進め方：軽い知識は答えを教える（D-0007）。選択肢は Claude がおすすめを決める（D-0010）。始めの3問はしない（D-0014）。新しい書き方は Claude が型を先に示す（D-0016）。確認のコマンドは毎回書く（D-0017）。デザインの値は Claude が提案（`docs/learning/reference/design.md`）
- 学習状況は `docs/learning/progress.md`、まとめは `docs/learning/notes/`、早見表は `docs/learning/reference/`

## 次にやること
- （任意）`~/.ssh/config` に `AddKeysToAgent yes`・`UseKeychain yes` を書き、再起動後も鍵を自動で読み込む
- 6-1 PostgreSQL を入れて `psql` でつなぐ（Postgres.app をおすすめ。brew・Docker は未導入）
- 自宅の Mac に外側と `app/` を clone し、`~/.claude/CLAUDE.md` と `~/.claude/skills/` をコピーする（D-0012）

## 未解決・要確認
- `tsc` は「検証して変換」、`node` が「実行」（S-0011、S-0013 の理解度チェックで抜けた）
- id が要る理由の①（ブラウザとサーバーは別のオブジェクトなので `!==` が使えない）（S-0013）
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- コミットメッセージに「何が変わったか」を書く。目的の違う変更はコミットを分ける（S-0013）
- 「web 上で動く」の意味と、公開先・DB の会社の決まり（ステップ7の前に確認）
- テストコマンド（ステップ8で決める）
