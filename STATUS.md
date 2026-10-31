# STATUS

最終更新: 2026-10-31（S-0032、D-0029）

## 現在地
- ステップ8（タグと絞り込み・検索、Issue #1）。`app/` はブランチ `feature/1-tags-search`。8-1〜8-3 は終了（表の設計 D-0026、`db/schema.sql`、タグの API `GET`・`POST /api/tags`・`DELETE /api/tags/:id`）。「決めてほしいこと」①② は 8-1 で決定、③ は 8-5（PR に学習者が書く）
- 8-4 は A（一覧の ToDo にタグを入れる）→ B（付け外し `POST`・`DELETE /api/todos/:id/tags/:tagId`）→ C（`POST /api/todos` で `tagIds` も受け取る＝トランザクション）。A は終了（コミット・push 済み）。B（確認の SELECT → `INSERT … ON CONFLICT DO NOTHING`、外すのは `DELETE … AND user_id`）の課題を出し、3回目でレビューが通り、curl の確かめ方を出した。経過は `docs/learning/progress.md`
- ステップ7（ログイン）までは終了。認証は自分で作る＋セッション（D-0020）、合言葉はハッシュで保存（D-0022）

## 次にやること
- 学習者が B の curl を実行 → コミット・push → C（`POST /api/todos` の `tagIds`、トランザクション）
- 自宅の Mac の DB の試しのデータ：c（id 1）、d（id 3）、学習者のアカウント（id 4）。c の ToDo 5 牛乳を買う・11 部屋の掃除・12 本を返す、c のタグ 6 work・13 家（d のタグは 9 家）、`todo_tag` は (5, 6)・(5, 13)・(11, 13)
- PR に書く理由のメモは 8-7 までに学習者が書く。最終ステップの中身は始めるときに決める（D-0024）
- 会社の PC では `app/` で `git fetch` → `git switch feature/1-tags-search` → `npm install`。DB は `dropdb todo_app` → `createdb todo_app` → `psql -d todo_app -f db/schema.sql` で作り直す（7-2・8-1 で表が変わったため）
- 会社の Claude アカウントを自宅の Mac や個人の PC で使ってよいか、会社の決まりを確認する
- 自宅の Mac の残り：`~/.claude/CLAUDE.md` と `~/.claude/skills/` の配置（今は `RECERQA/` の下）

## 未解決・要確認
- ステップ7 の理解度チェック（S-0024）：認証（入口の係）と認可（SQL の `AND user_id`）の区別、Cookie に `userId` を入れてはいけない理由、合言葉がソルトなしでよい理由、`SameSite=Lax` が防ぐもの
- ステップ8 途中（S-0029）：2つの列の外部キーと `ON DELETE` は 8-4 の始めに確かめ直して通った。中間の表の1行が表すもの（この ToDo にこのタグが付いている1組）は未確認
- 前からの要復習：`""` と `null`・入力はサーバーで確かめる理由・`tsc` は「検証して変換」（S-0015）、id が要る理由の①（S-0013）、目的の違う変更はコミットを分ける（S-0013、S-0015）、`flex-basis: 100%`（ステップ2）
- 公開先・DB についての会社の決まり（最終ステップの公開の前に確認）
