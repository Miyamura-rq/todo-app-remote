# STATUS

最終更新: 2026-10-13（D-0012）

## 現在地
- 学習ステップ4（TypeScript）を完了。次はステップ5（Node.js + Express）（S-0011）
- 作成物は `app/`（`src/main.ts` を `npm run build` で `public/main.js` に変換。`public/` に index.html、style.css）。`main.js` と `node_modules/` は git に入れない（D-0011）。`app/` は別リポジトリで GitHub `Miyamura-rq/todo-app` に push 済み。外側も GitHub の Private リポジトリに push して自宅の Mac と引き継ぐ（D-0012）。練習用ファイルは外側の `practice/`
- 仕様：期限あり、リマインドは余裕があれば後で（D-0006）。一覧はリスト、完了はチェックで残す（D-0008）。画面は配列 `todos` から `render()` で作り直す（D-0009）
- 進め方：軽い知識は答えを教える（D-0007）。書き方の選択肢は Claude がおすすめを決めて示す（D-0010）。デザインの値は Claude が提案（`docs/learning/reference/design.md`）。要件を1つずつレクチャーしながら進める
- 学習状況は `docs/learning/progress.md`、まとめは `docs/learning/notes/`、早見表は `docs/learning/reference/`

## 次にやること
- 外側の GitHub リポジトリを作って push し、自宅の Mac に clone する（D-0012）
- ステップ5の学習内容を作って始める（Express でサーバーを作り、`public/` を配信し、ToDo の API を作る）

## 未解決・要確認
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- `;` の抜け、変数名の snake_case、コミットメッセージに「何が変わったか」を書く（S-0011）
- `tsc` は「検証して変換」（実行はしない）の再確認（S-0011）
- REST のパスの決め方（ステップ5で再確認）
- `app/README.md` の起動方法（`npm install`、`npm run build` を含めてステップ5で書く）
- 「web 上で動く」の意味と、公開先・DB の会社の決まり（ステップ7の前に確認）
- 起動コマンド・テストコマンド（ステップ5で決める）
