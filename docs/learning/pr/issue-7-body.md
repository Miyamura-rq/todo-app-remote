Closes #7

## 概要
Todo の一覧・追加（期限つき）・完了・削除を React Router（`web/`）の画面に移し、Tailwind CSS で見た目を整えた。古い画面（`public/`・`src/client/`）と API の serve-static は消した。これで、ブラウザで開くのは web（5173）だけになり、API（3000）は `/api/…` だけを受ける。
#10（React Router のログイン）の上に積んだブランチなので、#10 のあとに見てください。

## 変更内容
- `/`（`home.tsx`）：loader で `/api/me` と `/api/todos` を取る。ログインしていなければ `redirect("/login")`
- 追加・完了・削除：3つの `<Form>` に見えない `intent`（`add`・`toggle`・`delete`）と `id` を持たせ、1つの action で受け分けて API を呼ぶ。action のあとは React Router が loader を呼び直す（revalidation）
- API：完了・削除の 404 も `{ error }` を返し、完了の成功に `200` を書いた（web で `res.ok` によって型を分けるため）
- Tailwind：`design.md` の色を `app.css` の `@theme` に登録（ダークモード）。よく使う形は `lib/styles.ts`
- `public/`・`src/client/`・serve-static を消し、build は `tsc -p src/server` だけにした。README は2つのプロセスの起動に合わせた

## 確かめたこと
- [x] 新しい画面から一覧・追加・期限の設定・完了・削除ができ、再読み込みしても残っている
- [x] ログインしていない状態で `/` を開くと、ログインの画面に移る
- [x] 別のユーザーでログインすると、ほかのユーザーの Todo が見えない（他人の Todo の完了・削除は 404）
- [x] `public/` と `src/client/` がリポジトリから消えている
- [x] README の起動の手順が、API と web の2つのプロセスに合っている

## Todo を1件追加したときの流れ
1. 「追加する」を押すと、ブラウザが `<Form>` の値（`intent=add`、`text`、`deadline`）を web の `/` に POST し、`home.tsx` の action が web のサーバーで動く
2. action は `intent` で追加だと見分け、`createApi(request)` でブラウザの Cookie を付けて `POST /api/todos` を呼ぶ
3. API は `requireLogin` でセッションからユーザーを決め、zod で入力を確かめて、`todos` 表に `user_id` つきで insert し、201 を返す
4. action が `null` を返すと、React Router が loader を自動で呼び直し、loader が `GET /api/todos` で新しい一覧を取る
5. 新しい `loaderData` で画面が描き直され、一覧に1件増える。追加のフォームは空になる

<details>
<summary>curl・ブラウザでの確かめ（web の 5174、API の 3001 で実行）</summary>

```text
GET  /（Cookie なし）                 → 302 location: /login
GET  /（ToDo が2件のユーザー）          → 2件と期限 11/5、残り 2 件
GET  /（ToDo がないユーザー）           → 空の一覧、残り 0 件
POST /?index intent=add               → 一覧に増える（期限 11/10）
POST /?index intent=add text が空      → 400「ToDo の内容を入れてください」
POST /?index intent=toggle            → 完了になり、もう一度で戻る
POST /?index intent=delete            → 一覧から消える
toggle・delete で、ない id・他人の id  → 404「ToDo が見つかりません」
GET  http://localhost:3000/（API）     → 404（古い画面はもうない）
ブラウザ：ログイン、エラー文、追加のあとフォームが空になる、完了の取り消し線、スマホの幅
```

</details>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
