# STATUS

最終更新: 2026-10-27（S-0021）

## 現在地
- ステップ7（ログイン）の 7-3（登録）まで終えた。次は 7-4（ログイン・ログアウト）。登録は `POST /api/users`（argon2 0.45.1）。作り方は自分で作る＋セッション（D-0020）、合言葉は DB にハッシュで保存（D-0022）。項目は `docs/learning/progress.md`、早見表は `docs/learning/reference/auth.md`。公開は8、品質は9で、8以降を行うかは未定（D-0018）
- 作成物は `app/`。`src/client/main.ts` → `public/main.js`、`src/server/server.ts` → `dist/server.js` を `npm run build` で変換し、`npm run dev` で起動（D-0015）。変換したものと `node_modules/`・`.env` は git に入れない（D-0011）。API は GET・POST `/api/todos`、PATCH・DELETE `/api/todos/:id`、POST `/api/users`（登録。201 `{id, email}`・400・409）
- ToDo は PostgreSQL（Postgres.app、v18）の `todo_app` データベースの `todos` テーブルに保存。`users` と `todos.user_id`（外部キー、`ON DELETE CASCADE`）を追加済み（7-2）で、7-5 までは画面からの追加が 500。作り方は `app/db/schema.sql`、接続は `.env` の `DATABASE_URL`（見本は `.env.example`）。Postgres.app が止まっていると API は 500
- `app/` は別リポジトリで GitHub `Miyamura-rq/todo-app` に学習者が push。外側は `Miyamura-rq/todo-app-remote`（D-0012、D-0013）。SSH 鍵はパスフレーズつき。`ssh-add --apple-use-keychain` で登録すると Claude の実行環境からも push できる（Mac の再起動で外れる。`~/.ssh/config` は未設定）。練習用ファイルは外側の `practice/`
- PC の切り替え：学習者は `app/` を途中でも push、Claude は「ここまで」と言われたら途中の位置まで記録して push（D-0019）。自宅の Mac は `~/RECERQA/todo-app` で、DB の作成と起動まで準備済み（S-0017）。サーバーは学習者のターミナルで起動する（Claude の `!` からだと止まる）
- 仕様：期限あり、リマインドは余裕があれば後で（D-0006）。一覧はリスト、完了はチェックで残す（D-0008）。画面は `todos` から `render()` で作り直し、操作のたびに GET で取り直す（D-0009）
- 進め方：軽い知識は答えを教える（D-0007）。選択肢は Claude がおすすめを決める（D-0010）。始めの3問はしない（D-0014）。新しい書き方は Claude が型（戻り値の形も）を先に示す（D-0016）。課題は目的・手順・骨組みまで最初に示す（D-0021）。書いたら先にレビューし、確かめ方は直すところがなくなってから学習者が実行する（D-0023）。確認のコマンドは毎回書く（D-0017）。デザインの値は Claude が提案（`docs/learning/reference/design.md`）
- 学習状況は `docs/learning/progress.md`、まとめは `docs/learning/notes/`、早見表は `docs/learning/reference/`

## 次にやること
- 会社の PC では pull のあと `dropdb todo_app` → `createdb todo_app` → `psql -d todo_app -f db/schema.sql` で作り直す（`schema.sql` は `app/` に push 済み）。`npm install` も行う（argon2 を入れたため）
- 7-4 ログイン・ログアウト（`sessions` テーブルから）。確かめるときは、まずサーバーを起動し直してから、登録の curl で c を作る（7-3 の curl は省略したので、新しいコードでの登録はまだ1度もしていない）。ステップ7全体の目安は約6〜9時間。まとめ（`notes/step7.md`）には全体の流れの図 `docs/learning/reference/images/login-flow.svg` を入れる（学習者の依頼）
- 会社の Claude アカウントを自宅の Mac や個人の PC で使ってよいか、会社の決まりを確認する
- 自宅の Mac の残り：`~/.claude/CLAUDE.md` と `~/.claude/skills/` の配置（今は `RECERQA/` の下）

## 未解決・要確認
- 登録・ログイン・ログイン後で届くもの（パスワードか Cookie か）の区別（S-0019）
- `""` と `null` の違い、入力はサーバーで確かめる理由（S-0015）
- `tsc` は「検証して変換」、`node` が「実行」（検証が抜ける。S-0015）
- id が要る理由の①（ブラウザとサーバーは別のオブジェクトなので `!==` が使えない）（S-0013）
- 目的の違う変更はコミットを分ける（`git add ファイル名`）（S-0013、S-0015）
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- 公開先・DB についての会社の決まり（ステップ8の前に確認）。ステップ8以降を行うか（ステップ7のあとで決める）
- テストコマンド（ステップ9で決める）
