# ステップ11：React Router のアプリとログインの画面（Issue #6）（まとめ）

期間: 2026-11-02
ゴール: `web/` に React Router（framework mode）のアプリを作って API と別のプロセスで動かし、登録・ログイン・ログアウトを `<Form>` と `action` から `hono/client` で API を呼んで行う → 達成（PR #10 はメンターのレビュー待ち）
ブランチ: `feature/6-react-router`（`feature/5-hono` から）→ PR #10（→ `feature/5-hono`）
進め方: 時間がある日だったので、学習者が多くを書き、Claude は部分ごとに重要度を示した（D-0035）。11-2・11-3 は学習者が任せた。11-4 の 4・5 は Claude が書いて解説した。11-5 の★（ログアウトの action）は学習者

早見表（紹介しただけで使っていない知識も含む）
- Cookie の流れ（ステップ7、ブラウザと API だけのとき）・開発者ツールと curl での確かめ方：[reference/auth.md](../reference/auth.md)
- フォームの要素と属性（`<form>`・`<input>`・`<button>`）：[reference/html.md](../reference/html.md)
- PR の本文の下書き（ログインの流れ、curl での確かめ）：[pr/issue-6-body.md](../pr/issue-6-body.md)

---

## 全体の流れ

```
前（ステップ7〜10）  ブラウザ ──fetch──→ API（3000）
                    画面は main.ts がブラウザで組み立てる。Cookie はブラウザと API の間で行き来する
後（ステップ11）     ブラウザ ──→ web（React Router、5173）──hono/client──→ API（3000）
                    画面は web のサーバーで組み立てて返す（サーバーサイドレンダリング）
                    ブラウザは API と直接話さない。Cookie はブラウザと web の間で行き来し、web が API に写す
開発中は2つ起動する  app/ で npm run dev（API）、app/web/ で npm run dev（画面）
```

```
ログインの流れ（<Form> → action → API → Set-Cookie → ブラウザ）

① ブラウザ    <Form method="post"> を web の /login に送る（email・password・押したボタンの intent）
② web         login.tsx の action が web のサーバーで動く。intent が "register" なら、先に /api/users でユーザーを作る
③ web → API   /api/login にメールアドレスとパスワードを送る。確かめるのは API（zod・argon2）。action は取り出して渡すだけ
              だめなら 401 → action が data({ error }, { status }) を返す → 同じ画面に actionData.error を出す
④ web ★       成功なら、API の返事の Set-Cookie を、/ への redirect（302）にそのまま付ける
⑤ ブラウザ    Cookie を保存して / を開く（Cookie は web に送る。HttpOnly なので JS からは読めない）
⑥ web ★       home.tsx の loader が、届いた Cookie を付けて /api/me を呼ぶ（createApi(request)）
⑦ API         requireLogin が通れば 200 { id, email }、だめなら 401
⑧ web         loaderData.email で HTML を組み立てて返す（「ログイン中：…」か「ログインしていません」）

ログアウト    ホームの <Form method="post" action="/logout"> → logout.tsx の action → /api/logout
              → API の Set-Cookie（session を消す。Max-Age=0）を /login への redirect に付ける
```

## 作ったもの

```
app/（ブランチ feature/6-react-router）
├── src/server/server.ts   ルートを const routes = app.post(…).get(…)… とつなげて書き、export type AppType = typeof routes
│                          ログインの成功の返事に 200 を書いた。serveStatic は鎖の外
├── README.md              web の起動（2つのプロセス）と使用技術
└── web/                   create-react-router 8.5.1 の雛形から（Tailwind 入り、ssr: true）。Dockerfile・welcome・favicon.ico は消した
    ├── package.json       react-router 8.5.1・react 19.3.1、hono（hc を使うため）。typecheck は react-router typegen && tsc
    └── app/
        ├── root.tsx       <html lang="ja">
        ├── routes.ts      index("routes/home.tsx")、route("login", …)、route("logout", …)
        ├── lib/api.server.ts  createApi(request)：ブラウザから届いた Cookie を付けて hc<AppType>(API_URL) を作る
        └── routes/
            ├── login.tsx  action（登録・ログイン → Set-Cookie を redirect に）と画面（<Form>、ボタン2つ）
            ├── home.tsx   loader（/api/me）と画面（ログイン中のメールアドレス、ログアウトのボタン）
            └── logout.tsx 画面を持たない action だけのルート
```

```
1つのルートのファイルの形（routes/login.tsx）

export function meta()            <title> になる
export async function action()    <Form method="post"> が送られたとき、web のサーバーで動く（ブラウザに送る JS には入らない）
export async function loader()    ページを開くたび、画面を作る前に web のサーバーで動く（login.tsx にはない。home.tsx）
export default function Login()   画面（JSX）。action の返事は actionData、loader の返事は loaderData で受け取る
型は ./+types/login の Route（react-router typegen が作る）
```

```
ログイン（前 → 後）

// 前（src/client/main.ts。ブラウザで動く）
async function login(): Promise<void> {
    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.value, password: passwordInput.value})
    });

    if (!res.ok) {
        const body: { error: string } = await res.json();
        showLogin(body.error);
        return;
    }
    …
}

// 後（web/app/routes/login.tsx の action。web のサーバーで動く）
export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData();
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const intent = form.get("intent"); // 押したボタンの value（"login" か "register"）

    const api = createApi(request);
    … 「登録する」なら先に api.api.users.$post …

    const loginRes = await api.api.login.$post({ json: { email, password } });
    if (!loginRes.ok) {
        const body = await loginRes.json();
        return data({ error: body.error }, { status: loginRes.status });
    }

    const setCookie = loginRes.headers.get("Set-Cookie") ?? "";
    return redirect("/", { headers: { "Set-Cookie": setCookie } });
}
```

| 前（main.ts） | 後（React Router） |
|---|---|
| `start()` が `fetch("/api/me")` → 401 ならログインの画面 | `home.tsx` の `loader` が `createApi(request).api.me.$get()` → `{ email }` か `{ email: null }` |
| `login()` が `fetch("/api/login")`、ボタンのイベントで呼ぶ | `<Form method="post">` を送ると `action` が動く。イベントの登録は要らない |
| `showLogin(body.error)` で文字を差し込む | `data({ error }, { status })` → `actionData.error` を JSX に書いておく |
| 1つの HTML を `hidden` で切り替える | ページ（ルート）を分ける。`redirect("/")`・`redirect("/login")` で移る |
| `Set-Cookie` はブラウザが API から直接受け取る | API の `Set-Cookie` を web が `redirect` の返事に写す（写さないとブラウザに届かない） |
| `fetch` の URL と本文の形は手で合わせる（型なし） | `hc<AppType>` で、パス・`json` の形・返事の型が `tsc` で確かめられる（`api.api.mee` は `TS2339`） |

```
hono/client に API の型を渡す（11-3）

API（server.ts）  const routes = app.post("/api/users", …).post("/api/login", …).get("/api/me", …)…
                  つなげると、.post・.get のたびにパス・本文・返事の型が routes の型に積み重なる
                  （1つずつ app.post(…) と書くと app の型には残らない）
                  export type AppType = typeof routes;
web（api.server.ts）
                  import type { AppType } from "../../../src/server/server";   型だけ。API のコードは web に入らない
                  hc<AppType>(API_URL, { headers: { Cookie: request.headers.get("cookie") ?? "" } })
                  .server のファイル名は「サーバーだけで使う」印。ブラウザに送る JS には入らない
```

### このステップで決めたこと
| 内容 | 却下した案 | 決定 |
|---|---|---|
| 時間がある日は学習者が多くを書き、一部を任せてよい。Claude は部分ごとに重要度（高・中・低）を示す | D-0030 のまま Claude が多くを書く | D-0035 |
| react-router 8.5.1。雛形は create-react-router（Tailwind 入り、`ssr: true`）、Dockerfile と welcome は消す | — | D-0010 |
| `hono/client` に型を渡すため、`server.ts` のルートをつなげて書く。`requireLogin` は前に移し、`.use("/api/todos/*", requireLogin)` も鎖の中 | 1つずつ `app.post(…)` と書く（型が積み重ならない） | D-0010 |
| 登録は `/login` の同じ `<Form>` にボタン2つ（`name="intent"`）。登録できたら続けてログイン（今の画面と同じ） | 登録のページを分ける | D-0010 |
| Cookie は `api.server.ts` の `createApi(request)` で1か所から API に渡す（ステップ12 の loader・action でも使う） | loader・action ごとに `Cookie` のヘッダーを書く | D-0010 |
| ログインの成功の返事に `200` を書く | 書かない（`res.ok` でエラーの型を分けられない） | D-0010 |
| 見た目はステップ12 で Tailwind を使って整える。テンプレートの `favicon.ico` は消す | — | D-0010、学習者 |

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| `app/` で `npm run dev` しても 5173 が動かない | `app/` の `npm run dev` は API（3000）。web は別のプログラム | `web/` で、別のターミナル（タブ「web（5173）」）から `npm run dev` |
| `<h1>{初めてのtodo}</h1>` で `TS2304` | JSX の `{}` は JS の値を埋め込む書き方。「初めてのtodo」という名前の変数を探した | 文字はそのまま書く（`{}` なし） |
| API が起動しない | `tagSchema` の名前がうっかり `tagtodoCreateSchema` に変わっていた。`route` の import がない。build が失敗していた | Claude が直した（`tsc` が止まるだけの書き間違い。D-0034） |
| ログインの `res.ok` でエラーの型が分かれない | API の最後の `c.json(…)` に状態の番号がなく、hono/client が成功と失敗を見分けられない | `c.json({id: user.id, email: user.email}, 200)` |
| `createApi` の書き方がわからない | 関数で `hc` を包み、`request` から `Cookie` を取り出す形が初めて | ヒント3段階で、学習者が書けた |
| `login.tsx`・`home.tsx` が「マジでわからない」 | React・`loader`・`action`・`hono/client`・`Set-Cookie` の写し方が一度に初めて | Claude が書いて、ブロックごとに解説した（D-0035 の範囲） |
| ログインの流れの説明（1回目）で5つ抜けた | 画面の操作の順は分かっていたが、「どこで動くか」「Cookie がどう渡るか」が見えていなかった | ① action が動くのは web のサーバー ② 入力を確かめるのは API（zod）③ ブラウザは API と話さないので、web が `Set-Cookie` を 302 に写す ④ 失敗は 401 → `data({ error })` → 同じ画面 ⑤ ホームの loader が Cookie を `/api/me` へ渡す |

## 理解度チェック（2026-11-02）
| 質問 | 結果 |
|---|---|
| `loader`・`action` はいつ・どこで動くか | いつ（action は Form の送信、loader はページを開くたび）は正解。どこでが抜けた → 両方とも web のサーバー（ブラウザではない）。だから Cookie や API を扱えて、ブラウザに送る JS に入らない（要復習。流れの説明でも抜けていた） |
| hono/client で API の型がわかる理由 | 「`AppType` で API 全体の型を書き出しているため」→ 半分。ルートをつなげて書くと `.post`・`.get` のたびに型が積み重なること（バラバラに書くと `app` の型には残らない）、`import type` なので型だけが web に渡りコードは入らないことを補った |

## 要復習
- `loader`・`action` が動くのは web のサーバー。だから Cookie を API に渡せて、API の場所や `.server` のコードがブラウザに出ない（Q1、流れの説明の①）
- `Set-Cookie` を web が写す理由：ブラウザは API と直接話さない。写さないとブラウザに Cookie が届かない（流れの説明の③）
- hono/client の型：ルートをつなげて書くと型が積み重なる。`import type` で型だけが web に渡る（Q2）
- ステップ10から持ち越し：`requireLogin` の3つ（期限、401 で止める、`c.set`/`c.get`）
- ステップ9から持ち越し：`$inferSelect`、マイグレーションの記録
- ステップ8から持ち越し：中間の表の1行、ROLLBACK と id の番号、トランザクションは同じ接続で送る、`ON CONFLICT` が先に効く
- ステップ7から持ち越し：認証と認可、Cookie に `userId` を入れない理由、合言葉がソルトなしでよい理由、`SameSite=Lax`
