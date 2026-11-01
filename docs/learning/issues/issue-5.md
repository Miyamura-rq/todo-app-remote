# Issue #5 API のサーバーを Express から Hono に置き換える（ステップ10）

写し: 2026-11-01（学習者が貼りつけたもの。`app/` のリポジトリは非公開で、Claude は GitHub の Issue を直接読めないため、ここに残す）
元: https://github.com/Miyamura-rq/todo-app/issues/5

---

## 背景

0周目では、今の Todo アプリをうえさかと同じ技術スタックに1つずつ移す。この Issue はその2つ目で、API のサーバーを Express から Hono に置き換える。

今の状態:

- `src/server/server.ts` が Express で API(`/api/users`、`/api/login`、`/api/logout`、`/api/me`、`/api/todos`)を提供し、`public/` の画面も配っている
- Cookie の読み取りに cookie-parser、ログインの確認に Express のミドルウェア(`requireLogin`)を使っている
- 入力を確かめていない。たとえば `text` が空の Todo も登録できる

うえさかの API は Hono で書かれ、入力を zod で確かめている(`uesaka/apps/api/server/routes/suppliers/suppliers-routes.ts`)。

## 依存・順序

#4(Drizzle への置き換え)が先に終わっている必要がある。

## 前提として調べること

作業に入る前に、次のことを調べ、自分の言葉で説明できるようにしておく。わからないときはメンターに聞く。

- Web フレームワーク(Express や Hono)が何をしているか。ルーティング、リクエストとレスポンス
- HTTP のメソッド(GET・POST・PATCH・DELETE)とステータスコード(200・201・204・400・401・404)の意味。今の API がそれぞれをどこで返しているか
- ミドルウェアとは何か。今の `requireLogin` が何をしているか
- Hono の Context(`c`)。`c.req`、`c.json`、`c.set` / `c.get` の役割
- Cookie の属性(`HttpOnly`、`SameSite`、`Max-Age`)の意味
- 入力の確認を、画面だけでなくサーバーでもする理由
- zod のスキーマの書き方と、`@hono/zod-validator` の使い方

## やること

- Express を Hono(`@hono/node-server`)に置き換える。API のパスとメソッドは今のままにする
- Cookie の読み書きを `hono/cookie` に置き換え、cookie-parser を外す
- `requireLogin` を Hono のミドルウェアに書き直し、ログイン中のユーザーの ID を `c.set` / `c.get` で渡す
- 入力を zod で確かめ、不正な入力には 400 を返す
- `public/` の配信を `@hono/node-server/serve-static` に置き換える(画面は次の Issue で作り直すまで今のまま使う)

## 完了条件

- [ ] `package.json` から express と cookie-parser が外れている
- [ ] 今の画面のまま、ユーザー登録・ログイン・ログアウト・Todo の一覧・追加・完了・削除ができる
- [ ] 次の入力に 400 が返る(PR に curl のコマンドと結果を貼る): `text` が空の Todo の追加、`done` が真偽値でない更新、正しくない形式のメールアドレスでのユーザー登録
- [ ] ログインしていない状態で `/api/todos` を呼ぶと 401 が返る

## 参照

- 対象: `src/server/server.ts`、`package.json`
- Hono: https://hono.dev/docs/
- Hono のミドルウェア: https://hono.dev/docs/guides/middleware
- Hono と zod: https://hono.dev/docs/guides/validation
- うえさかの API の例: `RECERQA/rq-applications` の `uesaka/apps/api/server/routes/suppliers/suppliers-routes.ts`
