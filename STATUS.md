# STATUS

最終更新: 2026-11-07（S-0038）

## 現在地
- 0周目（Issue #4〜#7、ステップ9〜12）は終了。PR #8・#9・#10・#11 はメンターのレビュー待ち（#11 → #10 → #9 → #8 の順に積んである）。`app/` のブランチは `feature/7-todo-react-router`。ステップ8 はブランチ `feature/1-tags-search` に残した（D-0032）
- メンターの次の課題（1周目、`Miyamura-rq/Uesaka-practice` の Issue #4〜#9）は、別のフォルダ `~/RECERQA/uesaka-practice/` で進める（D-0036）。準備は済んだ（S-0038）
- このフォルダは、PR のレビュー対応と、1周目のお手本（コード、学習の記録、早見表）のために残す

## 次にやること
- 1周目は `~/RECERQA/uesaka-practice/` を Claude Code で開いて進める
- PR #8〜#11 のレビューの指摘が来たら、ここで直す
- 別の端末で始めるとき：外側で `git pull`。`app/` で `git fetch` → `git switch feature/7-todo-react-router` → `npm install`、`app/web/` でも `npm install`。DB が Drizzle の前のままなら `dropdb todo_app` → `createdb todo_app` → `npm run db:migrate`（試しのアカウントは登録し直す）
- 開発中は `app/` で API（3000、`npm run dev`）、`app/web/` で画面（5173、`npm run dev`）の2つを起動する。uesaka-practice とはポートがぶつかるので、片方ずつ動かす
- 自宅の Mac の DB の試しのデータ：c（id 1）、d（id 3）。c の ToDo 1・2・4、タグ 1 work・2 家・5 shop、d のタグ 4 家

## 未解決・要確認
- 要復習は uesaka-practice の `docs/learning/progress.md` に写し、1周目の Issue に結びつけた
- `gh auth login` を試し直す。会社の Claude アカウントを自宅の Mac や個人の PC で使ってよいか、会社の決まりを確認する
- `~/.claude/CLAUDE.md` と `~/.claude/skills/` の配置（今は `RECERQA/` の下）
- `RECERQA/rq-applications`（うえさか）は Claude に見せてよい。`~/RECERQA/rq-applications` に置いてもらう
- 公開先・DB についての会社の決まり
