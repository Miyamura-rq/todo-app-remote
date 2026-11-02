# STATUS

最終更新: 2026-11-02（S-0035）

## 現在地
- ステップ11（Issue #6 React Router とログインの画面）。`app/` のブランチは `feature/6-react-router`。11-1〜11-3 は終了（`web/`、`AppType`、`hc`）
- 11-4（登録・ログインの画面）は終了。課題と図（①〜⑧、★④ `Set-Cookie` を `redirect` に付ける、★⑥ `Cookie` を API に渡す）は S-0035・`progress.md`。1〜3 は学習者、4・5（`login.tsx`・`home.tsx`）は学習者の依頼で Claude が書いて解説し、curl で確かめた
- ステップ9（#4 Drizzle）・10（#5 Hono）は終了。PR #8（`feature/4-drizzle` → `main`）・#9（`feature/5-hono` → `feature/4-drizzle`）はメンターのレビュー待ち
- 進め方：コードの多くを Claude が書いて解説し、★だけ学習者が書く（D-0030）。時間がある日は学習者が多くを書き、Claude は重要度を示す（D-0035）。★の確かめも Claude が実行する（D-0034）。ステップ12 は #7（React Router の Todo）。ステップ8 はブランチ `feature/1-tags-search` に残した（D-0032）

## 次にやること
- 11-5：ログアウトは終了（★ action は学習者）。残りは、学習者がログインの流れを説明する、PR（`feature/6-react-router` → `feature/5-hono`）。パスワード違いのエラーと HttpOnly の確認は 11-4 で済んだ
- 別の端末で始めるとき：外側で `git pull`。`app/` で `git fetch` → `git switch feature/6-react-router` → `npm install`、`app/web/` でも `npm install`。DB が Drizzle の前のままなら `dropdb todo_app` → `createdb todo_app` → `npm run db:migrate`（試しのアカウントは登録し直す）
- 開発中は `app/` で API（3000、`npm run dev`）、`app/web/` で画面（5173、`npm run dev`）の2つを起動する
- 自宅の Mac の DB の試しのデータ：c（id 1）、d（id 3）。c の ToDo 1・2・4、タグ 1 work・2 家・5 shop、d のタグ 4 家
- `gh auth login` を試し直す。会社の Claude アカウントを自宅の Mac や個人の PC で使ってよいか、会社の決まりを確認する
- 自宅の Mac の残り：`~/.claude/CLAUDE.md` と `~/.claude/skills/` の配置（今は `RECERQA/` の下）

## 未解決・要確認
- 理解度チェック：今日（ステップ10・11）の分は 11-4 のあとに行う。8-4（ROLLBACK と id の番号、`pool.connect()`、`ON CONFLICT` が先に効く）、ステップ7（S-0024：認証と認可、Cookie に `userId` を入れない理由、ソルトなしでよい理由、`SameSite=Lax`）、中間の表の1行（S-0029）が要復習
- 前からの要復習：`""` と `null`・入力はサーバーで確かめる理由・`tsc` は「検証して変換」（S-0015）、id が要る理由の①（S-0013）、目的の違う変更はコミットを分ける（S-0013、S-0015）、`flex-basis: 100%`（ステップ2）
- `RECERQA/rq-applications`（うえさか）は Claude に見せてよい。`~/RECERQA/rq-applications` に置いてもらう
- 公開先・DB についての会社の決まり（最終ステップの公開の前に確認）
