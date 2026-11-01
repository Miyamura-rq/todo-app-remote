# STATUS

最終更新: 2026-11-01（S-0034、D-0030〜D-0032）

## 現在地
- ステップ8（タグ、Issue #1）。ブランチ `feature/1-tags-search` に残した。8-1〜8-4 は終了（表の設計 D-0026、タグの API、一覧のタグ、付け外し、作るときのタグ＝トランザクション。最後のコミットは fdabd1d）。8-5〜8-7 は飛ばし、PR は出さずブランチを残す（D-0031、D-0032）
- 進め方を変えた：ステップ9 からは、コードの多くを Claude が書いて解説し、大事なところ（★）だけ学習者が書く。`app/` のコミット・push も Claude（D-0030）
- ステップ9〜12 はメンターの Issue #4〜#7（0周目：Drizzle → Hono → React Router のログイン → React Router の Todo）。項目・★・時間の目安（合計 22〜26時間）は `docs/learning/progress.md`、写しは `docs/learning/issues/`。以前の #2・#3 のステップはやめた（D-0031）
- ステップ7（ログイン）までは終了。認証は自分で作る＋セッション（D-0020）、合言葉はハッシュで保存（D-0022）

## 次にやること
- ステップ9（#4 Drizzle）：9-1 説明済み、9-2 終了（ブランチ `feature/4-drizzle`、`src/server/db/schema.ts`・`index.ts`、5aecebc まで push）。次は 9-3（`generate` で `drizzle/` に SQL、`schema.sql` を消す、README、★学習者が空の DB に `migrate`）。DB を空から作り直すので、試しのデータ（c・d・学習者のアカウント）は登録し直す
- 自宅の Mac の DB の試しのデータ：c（id 1）、d（id 3）、学習者のアカウント（id 4）。c の ToDo 5・11・12（ToDo の番号は 18 まで使用）、c のタグ 6 work・13 家（d のタグは 9 家）、`todo_tag` は (5, 6)・(5, 13)・(11, 13)
- 会社の PC では `app/` で `git fetch` → `git switch feature/1-tags-search` → `npm install`。DB は `dropdb todo_app` → `createdb todo_app` → `psql -d todo_app -f db/schema.sql` で作り直す（ステップ9 で Drizzle のマイグレーションに変わる）
- 会社の Claude アカウントを自宅の Mac や個人の PC で使ってよいか、会社の決まりを確認する
- 自宅の Mac の残り：`~/.claude/CLAUDE.md` と `~/.claude/skills/` の配置（今は `RECERQA/` の下）

## 未解決・要確認
- Issue #4〜#7 が参照する `RECERQA/rq-applications`（うえさか）は、Claude に見せてよい（学習者が確認）。この Mac にはないので、`~/RECERQA/rq-applications` に置いてもらう（会社の PC にあればそちらでも可）
- 8-4 の理解度チェック（2026-11-01）：ROLLBACK しても id の番号は戻らない、`pool.connect()` は BEGIN〜COMMIT を同じ接続で送るため、B で外部キーのエラーを使わない理由（`ON CONFLICT` が先に効く）が要復習
- ステップ7 の理解度チェック（S-0024）：認証（入口の係）と認可（SQL の `AND user_id`）の区別、Cookie に `userId` を入れてはいけない理由、合言葉がソルトなしでよい理由、`SameSite=Lax` が防ぐもの
- ステップ8 途中（S-0029）：中間の表の1行が表すもの（この ToDo にこのタグが付いている1組）は未確認
- 前からの要復習：`""` と `null`・入力はサーバーで確かめる理由（ステップ10 の zod で扱う）・`tsc` は「検証して変換」（S-0015）、id が要る理由の①（S-0013）、目的の違う変更はコミットを分ける（S-0013、S-0015）、`flex-basis: 100%`（ステップ2）
- 公開先・DB についての会社の決まり（最終ステップの公開の前に確認）
