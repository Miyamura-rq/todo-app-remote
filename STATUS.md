# STATUS

最終更新: 2026-11-01（S-0034、D-0030〜D-0032）

## 現在地
- ステップ8（タグ、Issue #1）。`app/` はブランチ `feature/1-tags-search`。8-1〜8-4 は終了（表の設計 D-0026、タグの API、一覧のタグ、付け外し、作るときのタグ＝トランザクション。最後のコミットは fdabd1d）。8-5〜8-7 は飛ばし、PR は出さずブランチを残す（D-0031、D-0032）
- 進め方を変えた：ステップ9 からは、コードの多くを Claude が書いて解説し、大事なところ（★）だけ学習者が書く。`app/` のコミット・push も Claude（D-0030）
- ステップ9〜12 はメンターの Issue #4〜#7（0周目：Drizzle → Hono → React Router のログイン → React Router の Todo）。項目・★・時間の目安（合計 22〜26時間）は `docs/learning/progress.md`、写しは `docs/learning/issues/`。以前の #2・#3 のステップはやめた（D-0031）
- ステップ7（ログイン）までは終了。認証は自分で作る＋セッション（D-0020）、合言葉はハッシュで保存（D-0022）

## 次にやること
- 8-4 の理解度チェック（3問を出した。答えを待っている）。C の curl は Claude が確かめて通った
- ステップ9（#4 Drizzle）：`main` からブランチを切り、9-1 前提の説明から
- 自宅の Mac の DB の試しのデータ：c（id 1）、d（id 3）、学習者のアカウント（id 4）。c の ToDo 5・11・12（ToDo の番号は 18 まで使用）、c のタグ 6 work・13 家（d のタグは 9 家）、`todo_tag` は (5, 6)・(5, 13)・(11, 13)
- 会社の PC では `app/` で `git fetch` → `git switch feature/1-tags-search` → `npm install`。DB は `dropdb todo_app` → `createdb todo_app` → `psql -d todo_app -f db/schema.sql` で作り直す（ステップ9 で Drizzle のマイグレーションに変わる）
- 会社の Claude アカウントを自宅の Mac や個人の PC で使ってよいか、会社の決まりを確認する
- 自宅の Mac の残り：`~/.claude/CLAUDE.md` と `~/.claude/skills/` の配置（今は `RECERQA/` の下）

## 未解決・要確認
- Issue #4〜#7 が参照する `RECERQA/rq-applications`（うえさか）は、Claude に見せてよい（学習者が確認）。この Mac にはないので、`~/RECERQA/rq-applications` に置いてもらう（会社の PC にあればそちらでも可）
- セッションの終わりの理解度チェック（8-4 の A・B・C）は未実施（S-0033）
- ステップ7 の理解度チェック（S-0024）：認証（入口の係）と認可（SQL の `AND user_id`）の区別、Cookie に `userId` を入れてはいけない理由、合言葉がソルトなしでよい理由、`SameSite=Lax` が防ぐもの
- ステップ8 途中（S-0029）：中間の表の1行が表すもの（この ToDo にこのタグが付いている1組）は未確認
- 前からの要復習：`""` と `null`・入力はサーバーで確かめる理由（ステップ10 の zod で扱う）・`tsc` は「検証して変換」（S-0015）、id が要る理由の①（S-0013）、目的の違う変更はコミットを分ける（S-0013、S-0015）、`flex-basis: 100%`（ステップ2）
- 公開先・DB についての会社の決まり（最終ステップの公開の前に確認）
