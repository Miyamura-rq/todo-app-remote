# Issue #7 Todo の画面を React Router に移し、古い画面を消す（ステップ12）

写し: 2026-11-01（学習者が貼りつけたもの。`app/` のリポジトリは非公開で、Claude は GitHub の Issue を直接読めないため、ここに残す）
元: https://github.com/Miyamura-rq/todo-app/issues/7

---

## 背景

0周目では、今の Todo アプリをうえさかと同じ技術スタックに1つずつ移す。この Issue はその4つ目で、Todo の画面を React Router に移し、古い画面を消す。

今の状態:

- #6 で、React Router のアプリ(`web/`)とユーザー登録・ログイン・ログアウトの画面ができている
- Todo の一覧・追加・期限・完了・削除は、まだ `public/index.html` と `src/client/main.ts` の画面にある

## 依存・順序

#6(React Router のアプリとログインの画面)が先に終わっている必要がある。

## 前提として調べること

作業に入る前に、次のことを調べ、自分の言葉で説明できるようにしておく。わからないときはメンターに聞く。

- `loader` が返したデータを画面で受け取る方法と、その型(`Route.ComponentProps` の `loaderData`)
- `action` が終わったあと、React Router が `loader` を実行し直す仕組み(revalidation)。今の `main.ts` の `loadTodos()` と `render()` は、どこに置き換わるか
- 1つの画面で、追加・完了・削除のように複数の操作を `action` で受け分ける方法(フォームに `intent` の値を持たせる、など)
- ログインしていないときに、`loader` でログインの画面に移す方法
- Tailwind CSS のユーティリティクラスとは何か。今の `style.css` との違い

## やること

- Todo の一覧画面を作り、`loader` から API を呼んで表示する。ログインしていなければログインの画面に移す
- Todo の追加(期限つき)・完了の切り替え・削除を、`<Form>` と `action` で作る
- 見た目を Tailwind CSS で整える(最低限でよい)
- `public/`、`src/client/`、API の serve-static を消す

## 完了条件

- [ ] 新しい画面から Todo の一覧・追加・期限の設定・完了・削除ができ、再読み込みしても結果が残っている
- [ ] ログインしていない状態で一覧の URL を開くと、ログインの画面に移る
- [ ] 別のユーザーでログインすると、ほかのユーザーの Todo が見えない
- [ ] `public/` と `src/client/` がリポジトリから消えている
- [ ] README の起動の手順が、新しい構成(API と web の2つのプロセス)に合っている
- [ ] Todo を1件追加したときの処理の流れ(`<Form>` → `action` → API → DB → `loader` → 画面)を、メンターに説明できる

## 参照

- 対象: `web/`、`public/`、`src/client/`、`README.md`
- React Router のデータの読み書き: https://reactrouter.com/start/framework/data-loading 、https://reactrouter.com/start/framework/actions
- うえさかの一覧画面の例: `RECERQA/rq-applications` の `uesaka/apps/web/app/routes/suppliers/route.tsx`
