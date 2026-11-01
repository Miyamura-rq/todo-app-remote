Closes #5

## 概要
API のサーバーを Express から Hono（`@hono/node-server`）に置き換えた。Cookie は `hono/cookie`、ログインの確認は Hono のミドルウェア（`c.set` / `c.get`）、入力は zod で確かめる。express と cookie-parser は外した。
#8（Drizzle）の上に積んだブランチなので、#8 のあとに見てください。

## 確かめたこと
- [x] `package.json` から express と cookie-parser が外れている
- [x] 今の画面のまま、登録・ログイン・ログアウト・一覧・追加・完了・削除ができる（画面と同じ形のリクエストを curl で確認）
- [x] 下の3つの入力に 400、ログインしていないと 401（curl）

## メモ
- Hono の `setCookie` の `maxAge` は秒（Express はミリ秒だった）
- 壊れた JSON も `onError` で 400 `{ error }` にそろえた

<details>
<summary>curl のコマンドと結果</summary>

```bash
# text が空の Todo の追加
curl -b cookie.txt -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"text":""}'
# → 400 {"error":"ToDo の内容を入れてください"}

# done が真偽値でない更新
curl -b cookie.txt -X PATCH http://localhost:3000/api/todos/1 -H "Content-Type: application/json" -d '{"done":"yes"}'
# → 400 {"error":"done は true か false で送ってください"}

# 正しくない形式のメールアドレスでのユーザー登録
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"email":"not-an-email","password":"password-x"}'
# → 400 {"error":"正しい形のメールアドレスと、8文字以上のパスワードを入れてください"}

# ログインしていない状態で /api/todos
curl http://localhost:3000/api/todos
# → 401 {"error":"ログインしてください"}
```

</details>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
