# STATUS

最終更新: 2026-10-28（S-0027）

## 現在地
- ステップ8（タグと絞り込み・検索、Issue #1）。項目 8-1〜8-7 は `docs/learning/progress.md`。`app/` はブランチ `feature/1-tags-search` で作業中。8-1 で表の設計を決め（`tags`・`todo_tag`、2つの列の外部キー、タグを消すと外れるだけ。D-0026）、`db/schema.sql` をコミットしてブランチを push した（8-2 終了。`JOIN` の SQL は 8-4 で書く）。8-3 タグの API の課題を出したところ。「決めてほしいこと」は学習者が決めて PR に書く（①② は 8-1 で決定、③ は 8-5。D-0025）
- ステップ7（ログイン）は終了（要復習は `notes/step7.md` の最後）。画面は1つの HTML の2つの `section`（`#login-view`・`#todo-view`）を `hidden` で切り替え、開いたときに `GET /api/me` で判断する。サーバー側は、登録・ログイン（Cookie `session` は HttpOnly・SameSite=Lax・7日）・ログアウト・入口の係 `requireLogin`（`app.use("/api/todos", ...)`、`res.locals.userId`）・自分の ToDo だけの SQL まで確かめた。登録は `POST /api/users`（argon2 0.45.1）。作り方は自分で作る＋セッション（D-0020）、合言葉は DB にハッシュで保存（D-0022）。項目は `docs/learning/progress.md`、早見表は `docs/learning/reference/auth.md`。公開と品質は番号のない最終ステップで、行わない可能性もある。機能のステップは、実装を終えるたびに足すかを決める（D-0024）
- 作成物は `app/`。`src/client/main.ts` → `public/main.js`、`src/server/server.ts` → `dist/server.js` を `npm run build` で変換し、`npm run dev` で起動（D-0015）。変換したものと `node_modules/`・`.env` は git に入れない（D-0011）。API は GET・POST `/api/todos`、PATCH・DELETE `/api/todos/:id`、POST `/api/users`（登録。201 `{id, email}`・400・409）、POST `/api/login`（200 `{id, email}`・400・401）、POST `/api/logout`（いつでも 204）、GET `/api/me`（200 `{id, email}`・401）。ToDo の4つは Cookie がない・無効・期限切れなら 401 `{error: "ログインしてください"}`、他人の id は 404
- ToDo は PostgreSQL（Postgres.app、v18）の `todo_app` データベースの `todos` テーブルに保存。`users` と `todos.user_id`（外部キー、`ON DELETE CASCADE`）と `sessions` を追加済み。作り方は `app/db/schema.sql`、接続は `.env` の `DATABASE_URL`（見本は `.env.example`）。Postgres.app が止まっていると API は 500
- `app/` は別リポジトリで GitHub `Miyamura-rq/todo-app` に学習者が push。外側は `Miyamura-rq/todo-app-remote`（D-0012、D-0013）。SSH 鍵はパスフレーズつき。`ssh-add --apple-use-keychain` で登録すると Claude の実行環境からも push できる（Mac の再起動で外れる。`~/.ssh/config` は未設定）。練習用ファイルは外側の `practice/`
- PC の切り替え：学習者は `app/` を途中でも push、Claude は「ここまで」と言われたら途中の位置まで記録して push（D-0019）。自宅の Mac は `~/RECERQA/todo-app` で、DB の作成と起動まで準備済み（S-0017）。サーバーは学習者のターミナルで起動する（Claude の `!` からだと止まる）
- 仕様：期限あり、リマインドは余裕があれば後で（D-0006）。一覧はリスト、完了はチェックで残す（D-0008）。画面は `todos` から `render()` で作り直し、操作のたびに GET で取り直す（D-0009）
- 進め方：軽い知識は答えを教える（D-0007）。選択肢は Claude がおすすめを決める（D-0010）。始めの3問はしない（D-0014）。新しい書き方は Claude が型（戻り値の形も）を先に示す（D-0016）。課題は目的・手順・骨組みまで最初に示す（D-0021）。書いたら先にレビューし、確かめ方は直すところがなくなってから学習者が実行する（D-0023）。確認のコマンドは毎回書く（D-0017）。デザインの値は Claude が提案（`docs/learning/reference/design.md`）
- 学習状況は `docs/learning/progress.md`、まとめは `docs/learning/notes/`、早見表は `docs/learning/reference/`

## 次にやること
- 会社の PC では `app/` で `git fetch` → `git switch feature/1-tags-search`。そのあと `dropdb todo_app` → `createdb todo_app` → `psql -d todo_app -f db/schema.sql` で作り直す（7-2・8-1 で `todos` が変わったため）。`npm install` も行う（argon2・cookie-parser を入れたため）
- ステップ8〜10 はメンターの Issue #1〜#3（タグと絞り込み → リストの共有とリアルタイム → 画像から ToDo）。本文の写しは `docs/learning/issues/`。ブランチを切って PR を出す（D-0025）。次は 8-3 のレビュー → curl で確かめる → コミット。最終ステップ（品質・公開）の中身は、始めるときに決める（D-0024）。自宅の Mac の DB は 8-2 で作り直した：c（id 1）、d（id 3）、タグ「家」（id 4、c）だけ。PR に書く理由のメモは 8-7 までに学習者が書く
- 会社の Claude アカウントを自宅の Mac や個人の PC で使ってよいか、会社の決まりを確認する
- 自宅の Mac の残り：`~/.claude/CLAUDE.md` と `~/.claude/skills/` の配置（今は `RECERQA/` の下）

## 未解決・要確認
- 認証（入口の係）と認可（SQL の `AND user_id`）の区別、Cookie に `userId` を入れてはいけない理由、合言葉がソルトなしでよい理由、`SameSite=Lax` が防ぐもの（ステップ7の理解度チェック。S-0024）
- `""` と `null` の違い、入力はサーバーで確かめる理由（S-0015）
- `tsc` は「検証して変換」、`node` が「実行」（検証が抜ける。S-0015）
- id が要る理由の①（ブラウザとサーバーは別のオブジェクトなので `!==` が使えない）（S-0013）
- 目的の違う変更はコミットを分ける（`git add ファイル名`）（S-0013、S-0015）
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- 公開先・DB についての会社の決まり（最終ステップの公開の前に確認）
- テストコマンド（ステップ9 で決める。D-0025）
