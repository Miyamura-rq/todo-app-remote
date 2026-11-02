Closes #6

## 概要
`web/` に React Router（framework mode）のアプリを作り、登録・ログイン・ログアウトの画面を移した。API とは別のプロセス（5173）で動き、`<Form>` の送信は `action`、表示のデータは `loader` で受けて、そこから `hono/client` で API を呼ぶ。ブラウザは API を直接呼ばない。
#9（Hono）の上に積んだブランチなので、#9 のあとに見てください。

## 変更内容
- API：ルートをつなげて書き `AppType` を書き出した。ログインの成功に `200` を明記した（書かないと `hono/client` で `res.ok` による型の絞り込みができない）
- `web/app/lib/api.server.ts`：`createApi(request)` で、ブラウザから届いた `Cookie` を付けて API を呼ぶ
- `/login`：ボタン2つ（`intent`）で登録とログイン。成功したら API の `Set-Cookie` を `/` への `redirect` に付ける
- `/logout`：action だけのルート。API の `Set-Cookie`（消す）を `/login` への `redirect` に付ける
- `/`：loader が `/api/me` を呼び、ログイン中のメールアドレスを出す

## 確かめたこと
- [x] 新しい画面から登録・ログイン・ログアウトができる
- [x] パスワードが違うとき、画面に「メールアドレスかパスワードが一致しません」が出る
- [x] 開発者ツールで `session` の Cookie が HttpOnly で保存されている
- [x] ログアウトのあと、消す前の Cookie を送ってもログイン中にならない

## ログインの流れ
1. `<Form>` が入力した値と押したボタン（`intent`）を web に POST し、`login.tsx` の action が web のサーバーで動く
2. 「登録する」なら先に `/api/users` でユーザーを作り、ログインに合流する
3. `/api/login` にメールアドレスとパスワードを送る。違えば 401 → action が `data({ error })` を返し、同じ画面にエラーを出す
4. 成功すると API が `Set-Cookie` を返す。ブラウザは API と直接話さないので、action がそれを `/` への 302 に写し、ブラウザが保存する
5. `/` を開くとブラウザが Cookie を web に送り、loader がそれを付けて `/api/me` を呼ぶ → 「ログイン中」

<details>
<summary>curl での確かめ（web の 5174、API の 3001 で実行）</summary>

```text
GET  /login                       → 200（フォームとボタン2つ）
GET  /（Cookie なし）              → 「ログインしていません。」
POST /login intent=register       → 302 location: /、set-cookie: session=…; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax
GET  /（その Cookie）              → 「ログイン中：…」
POST /login パスワード違い          → 401「メールアドレスかパスワードが一致しません」
POST /login 同じメールで登録        → 409「このメールアドレスは使われています」
POST /logout（Cookie つき）         → 302 location: /login、set-cookie: session=; Max-Age=0; Path=/
GET  /（消す前の Cookie を手で送る） → 「ログインしていません」
```

</details>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
