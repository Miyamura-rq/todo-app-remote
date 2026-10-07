# STATUS

最終更新: 2026-10-07（S-0008）

## 現在地
- 学習ステップ3（JavaScript）の途中。3-1〜3-3 を終え、3-4（ToDo の追加）に入った（S-0008）
- 学習者はステップ4まで進める意向（2026-10-06 時点）（ステップ3は最後まで）
- 作成物は `app/public/`（index.html、style.css）。`app/` は別リポジトリで GitHub `Miyamura-rq/todo-app` に push 済み。外側はローカルのみ（D-0004）。練習用ファイルは外側の `practice/`
- 仕様：期限あり、リマインドは余裕があれば後で（D-0006）。一覧はリスト、完了はチェックで残す（D-0008）。画面は配列 `todos` から `render()` で作り直す（D-0009）
- 進め方：軽い知識は答えを教える（D-0007）。書き方の選択肢は Claude がおすすめを決めて示す（D-0010）。デザインの値は Claude が提案（`docs/learning/reference/design.md`）。要件を1つずつレクチャーしながら進める
- 学習状況は `docs/learning/progress.md`、まとめは `docs/learning/notes/`、早見表は `docs/learning/reference/`

## 次にやること
- 3-4 `createTodoElement(todo)` で `<li>` を作る → `render()` で追加。期限の `10/10` 表示

## 未解決・要確認
- `flex-basis: 100%` の役割（ステップ3以降で再確認）
- REST のパスの決め方（ステップ5で再確認）
- `app/README.md` の「リマインド」の記述と使用技術の未記入（ステップ5で起動方法とまとめて直す）
- 「web 上で動く」の意味と、公開先・DB の会社の決まり（ステップ7の前に確認）
- 起動コマンド・テストコマンド（ステップ5で決める）
