# STATUS

最終更新: 2026-10-13（D-0017）

## 現在地
- 学習ステップ5（Node.js + Express）の途中。5-1〜5-4 完了（API：GET・POST `/api/todos`、PATCH・DELETE `/api/todos/:id`。画面は操作のたびに GET で取り直す）、次は 5-5。学習内容 5-1〜5-5 は `docs/learning/progress.md`（S-0012）
- 作成物は `app/`（`src/main.ts` を `npm run build` で `public/main.js` に変換。`public/` に index.html、style.css）。`main.js` と `node_modules/` は git に入れない（D-0011）。5-1 で `src/client` → `public`、`src/server` → `dist` に分ける（D-0015）。`app/` は別リポジトリで GitHub `Miyamura-rq/todo-app` に push 済み。外側は GitHub `Miyamura-rq/todo-app-remote` に Claude が push し、自宅の Mac と引き継ぐ（D-0012、D-0013）。練習用ファイルは外側の `practice/`
- 仕様：期限あり、リマインドは余裕があれば後で（D-0006）。一覧はリスト、完了はチェックで残す（D-0008）。画面は配列 `todos` から `render()` で作り直す（D-0009）
- 進め方：軽い知識は答えを教える（D-0007）。書き方の選択肢は Claude がおすすめを決めて示す（D-0010）。デザインの値は Claude が提案（`docs/learning/reference/design.md`）。要件を1つずつレクチャーしながら進める。始めの3問はしない（D-0014）。新しい書き方は Claude が型を先に示す（D-0016）。確認のコマンドは毎回書く（D-0017）
- 学習状況は `docs/learning/progress.md`、まとめは `docs/learning/notes/`、早見表は `docs/learning/reference/`

## 次にやること
- 5-5 仕上げ（README の起動方法、push、技術の選択肢）。`npm run dev` で起動
- 自宅の Mac に外側と `app/` を clone し、`~/.claude/CLAUDE.md` と `~/.claude/skills/` をコピーする（D-0012）

## 未解決・要確認
- 外側・`app/` の pull / push が SSH 認証（publickey）で失敗する（S-0012）
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- `;` の抜け、変数名の snake_case、コミットメッセージに「何が変わったか」を書く（S-0011）
- `tsc` は「検証して変換」（実行はしない）の再確認（S-0011）
- id が要る理由（オブジェクトの比較は使えない、何番目かはずれる）を理解度チェックで再確認
- `app/README.md` の起動方法（`npm install`、`npm run build` を含めて 5-5 で書く）
- 「web 上で動く」の意味と、公開先・DB の会社の決まり（ステップ7の前に確認）
- テストコマンド（ステップ8で決める）
