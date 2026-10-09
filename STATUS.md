# STATUS

最終更新: 2026-10-09（S-0010）

## 現在地
- 学習ステップ4（TypeScript）を開始。学習内容は 4-1〜4-5（S-0010）。今日はステップ4を最後まで進める予定
- 作成物は `app/public/`（index.html、style.css、main.js）。`app/` は別リポジトリで GitHub `Miyamura-rq/todo-app` に push 済み。外側はローカルのみ（D-0004）。練習用ファイルは外側の `practice/`
- 仕様：期限あり、リマインドは余裕があれば後で（D-0006）。一覧はリスト、完了はチェックで残す（D-0008）。画面は配列 `todos` から `render()` で作り直す（D-0009）
- 進め方：軽い知識は答えを教える（D-0007）。書き方の選択肢は Claude がおすすめを決めて示す（D-0010）。デザインの値は Claude が提案（`docs/learning/reference/design.md`）。要件を1つずつレクチャーしながら進める
- 学習状況は `docs/learning/progress.md`、まとめは `docs/learning/notes/`、早見表は `docs/learning/reference/`

## 次にやること
- 4-1 TypeScript の役割と準備（npm と package.json、`tsc`）

## 未解決・要確認
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- 関数を `=` で上書きする間違い、コミットメッセージの書き方（S-0009）
- REST のパスの決め方（ステップ5で再確認）
- `app/README.md` の起動方法（ステップ5で書く）
- 「web 上で動く」の意味と、公開先・DB の会社の決まり（ステップ7の前に確認）
- 起動コマンド・テストコマンド（ステップ5で決める）
