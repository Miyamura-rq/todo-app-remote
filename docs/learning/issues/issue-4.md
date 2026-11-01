# Issue #4 DB の読み書きを pg の SQL から Drizzle ORM に置き換える（ステップ9）

写し: 2026-11-01（学習者が貼りつけたもの。`app/` のリポジトリは非公開で、Claude は GitHub の Issue を直接読めないため、ここに残す）
元: https://github.com/Miyamura-rq/todo-app/issues/4

---

## 背景

0周目では、今の Todo アプリをうえさかと同じ技術スタックに1つずつ移す。この Issue はその1つ目で、DB の読み書きを pg で書いた SQL から Drizzle ORM に置き換える。

今の状態:

- テーブル(`users`、`todos`、`sessions`)は `db/schema.sql` で定義し、README の手順で `psql -f` で作っている
- `src/server/server.ts` の中で、`pool.query("SELECT ...")` のように SQL を直接書いている(9か所)

うえさかは、テーブルの定義とマイグレーションを Drizzle で管理している(`uesaka/packages/db-uesaka/src/app/schema.ts`)。

## 前提として調べること

作業に入る前に、次のことを調べ、自分の言葉で説明できるようにしておく。わからないときはメンターに聞く。

- ORM とは何か。SQL を文字列で書く今の書き方と比べて、何が変わるか(型、書き間違いの見つかり方)
- マイグレーションとは何か。`schema.sql` を手で流す今のやり方と比べて、何がよいか
- `drizzle-kit` の `pull`・`generate`・`migrate` が、それぞれ何をするか
- プレースホルダ(今のコードの `$1`)が何のためにあるか。SQL インジェクションとは何か。Drizzle ではどうなっているか
- 外部キーと `ON DELETE CASCADE`(今の `todos.user_id`、`sessions.user_id`)の意味
- Drizzle で、スキーマの定義から TypeScript の型を作る方法(`$inferSelect`)

## やること

- Drizzle ORM と drizzle-kit を入れる
- `users`、`todos`、`sessions` を Drizzle のスキーマ(TypeScript)で定義する。今の DB から `drizzle-kit pull` で作ってから整えてもよい
- テーブルの作成を `drizzle-kit generate` と `drizzle-kit migrate` に置き換え、`db/schema.sql` を消す。README の手順も直す
- `server.ts` の `pool.query` をすべて Drizzle のクエリに置き換える
- Drizzle のログを有効にし、発行される SQL を見られるようにする

Express はこの Issue ではそのまま使う(Hono への置き換えは次の Issue)。

## 完了条件

- [ ] `server.ts` に `pool.query` が残っていない
- [ ] 空の DB に対して README の手順どおりにマイグレーションを実行すると、3つのテーブルができる
- [ ] 今と同じように、ユーザー登録・ログイン・ログアウト・Todo の一覧・追加・完了・削除ができる
- [ ] 別のユーザーでログインすると、ほかのユーザーの Todo が見えない・変えられない
- [ ] 置き換える前の SQL と、Drizzle が発行した SQL を API ごとに並べて PR に貼っている

## 参照

- 対象: `src/server/server.ts`、`db/schema.sql`、`README.md`
- Drizzle ORM(PostgreSQL): https://orm.drizzle.team/docs/get-started/postgresql-existing
- うえさかのスキーマの例: `RECERQA/rq-applications` の `uesaka/packages/db-uesaka/src/app/schema.ts`
