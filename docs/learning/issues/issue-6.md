# Issue #6 React Router のアプリを作り、ユーザー登録・ログイン・ログアウトの画面を移す（ステップ11）

写し: 2026-11-01（学習者が貼りつけたもの。`app/` のリポジトリは非公開で、Claude は GitHub の Issue を直接読めないため、ここに残す）
元: https://github.com/Miyamura-rq/todo-app/issues/6

---

## 背景

0周目では、今の Todo アプリをうえさかと同じ技術スタックに1つずつ移す。この Issue はその3つ目で、画面を React Router で作り直す準備として、React Router のアプリを用意し、ユーザー登録・ログイン・ログアウトの画面を移す。

今の状態:

- 画面は `public/index.html` と `src/client/main.ts` で作り、ブラウザから `fetch("/api/...")` で API を直接呼んでいる
- ログインすると、API が `session` の Cookie(HttpOnly)を返す

うえさかの画面は React Router(framework mode)で作られている。表示に使うデータは `loader` で、フォームの送信は `action` で受け、そこから Hono のクライアント(`hono/client`)で API を呼ぶ(`uesaka/apps/web/app/routes/suppliers/$supplierId/edit/action.server.ts`)。ブラウザから API を直接は呼ばない。

## 依存・順序

#5(Hono への置き換え)が先に終わっている必要がある。

## 前提として調べること

作業に入る前に、次のことを調べ、自分の言葉で説明できるようにしておく。わからないときはメンターに聞く。

- React の基本: コンポーネント、JSX、props、state
- 画面をブラウザで組み立てる方法(今の `main.ts`)と、サーバーで組み立てて返す方法(サーバーサイドレンダリング)の違い
- React Router の framework mode で、`loader` と `action` がどこで(ブラウザかサーバーか)、いつ実行されるか
- React Router の `<Form>` と、HTML の `<form>` の違い
- Cookie はブラウザがどのサーバーに送るか。オリジンとは何か。この構成でブラウザ → React Router のサーバー → API と Cookie をどう渡すか
- リダイレクト(302)とは何か。React Router の `redirect`
- `hono/client` で、API の型が画面側のコードでも使える仕組み

## やること

- `web/` に React Router(framework mode)のアプリを作り、API とは別のプロセスで起動する
- ユーザー登録・ログインの画面を作り、`<Form>` と `action` から API を呼ぶ
- ログアウトのボタンを作る
- API の呼び出しには `hono/client` を使う

Cookie はブラウザと React Router のサーバーの間でやりとりされる。React Router のサーバーから API を呼ぶときは、次の2つが必要になる。

- `loader` と `action` で、ブラウザから届いた `Cookie` ヘッダーを API に渡す
- ログインの `action` で、API が返した `Set-Cookie` ヘッダーをブラウザへの応答に付ける

## 完了条件

- [ ] 新しい画面からユーザー登録・ログイン・ログアウトができる
- [ ] パスワードが違うとき、画面にエラーの文言が出る
- [ ] ログインしたあと、ブラウザの開発者ツールで `session` の Cookie が HttpOnly で保存されている
- [ ] ログインの処理の流れ(`<Form>` → `action` → API → `Set-Cookie` → ブラウザ)を、メンターに説明できる

## 参照

- 対象: 新しく作る `web/`
- React Router(framework mode)の始め方: https://reactrouter.com/start/framework/installation
- Hono のクライアント: https://hono.dev/docs/guides/rpc
- うえさかの画面の例: `RECERQA/rq-applications` の `uesaka/apps/web/app/routes/suppliers/`、`uesaka/apps/web/app/routes/login.tsx`
