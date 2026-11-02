# ステップ12：Todo の画面を React Router に移す（Issue #7）（まとめ）

期間: 2026-11-02
ゴール: Todo の一覧・追加（期限つき）・完了・削除を React Router（`web/`）の画面に移し、Tailwind CSS で最低限整え、古い画面（`public/`・`src/client/`・serve-static）を消す → 達成（PR #11 はメンターのレビュー待ち）。これで 0周目（Issue #4〜#7）は終わり
ブランチ: `feature/7-todo-react-router`（`feature/6-react-router` から）→ PR #11（→ `feature/6-react-router`）
進め方: 学習者「書くべきかはそっちで決めて」→ D-0030 の形。Claude が大半を書いて解説し、★（12-3 の action を `intent` で受け分けるところ）は学習者。12-3 は分岐したチャットで進めた

早見表（紹介しただけで使っていない知識も含む）
- 色の値と、Tailwind での名前（`bg`・`surface`・`accent` など）・大きさの対応：[reference/design.md](../reference/design.md)
- フォームの要素と属性（`<input type="hidden">` など）：[reference/html.md](../reference/html.md)
- PR の本文の下書き（Todo を1件追加したときの流れ、確かめ）：[pr/issue-7-body.md](../pr/issue-7-body.md)
- ログインの流れと Cookie の受け渡し（ステップ11）：[step11.md](step11.md)

---

## 全体の流れ

```
前（ステップ11 まで）  ブラウザ ──→ API（3000）が public/ の index.html・main.js・style.css を配る
                      Todo の画面は main.ts がブラウザで fetch して、render() で DOM を作り直す
後（ステップ12）       ブラウザ ──→ web（5173）──hono/client──→ API（3000）
                      画面は全部 web。API は /api/… だけを受ける（API の / は 404）
```

```
Todo を1件追加したときの流れ（<Form> → action → API → DB → loader → 画面）

① ブラウザ    「追加する」で、<Form> の値（intent=add、text、deadline）を web の / に POST
② web         home.tsx の action が web のサーバーで動く。intent で追加だと見分け、createApi(request) で Cookie を付けて POST /api/todos
③ API・DB     requireLogin がセッションからユーザーを決め、zod で確かめて、todos 表に user_id つきで insert → 201
④ web         action が null を返すと、React Router が loader を自動で呼び直す（revalidation）。loader が GET /api/todos
⑤ web → ブラウザ  新しい loaderData で画面を描き直す。一覧に1件増え、追加のフォームは空になる
```

## 作ったもの

```
app/（ブランチ feature/7-todo-react-router）
├── src/server/server.ts   完了・削除の 404 も { error: "ToDo が見つかりません" } に。完了の成功に 200。serveStatic を消した
├── package.json           build は tsc -p src/server だけ
├── README.md              API（3000）と画面（5173）の2つのプロセスの起動
├── public/・src/client/   消した（576行）
└── web/app/
    ├── app.css            @theme に design.md の8色と文字を登録。body に幅・余白・色（ダークモードだけ）
    ├── root.tsx           雛形の Google Fonts（Inter）の読み込みを消した
    ├── lib/styles.ts      入力欄・主と二番目のボタン・ラベル・エラー文のクラスに名前を付けた
    └── routes/
        ├── home.tsx       Todo の一覧。loader（/api/me と /api/todos、401 なら /login へ）、
        │                  action（intent で追加・完了・削除）、3種類の <Form>
        └── login.tsx      Tailwind のクラスだけ
```

```
1つの画面に、3種類のフォームと1つの action（home.tsx）

追加のフォーム（1つ）      hidden の intent=add    ＋ text・deadline
完了のフォーム（ToDo ごと） hidden の intent=toggle ＋ hidden の id・done（done は String(!todo.done)。「今の反対」）
削除のフォーム（ToDo ごと） hidden の intent=delete ＋ hidden の id
action                    form.get("intent") で分け、$post・todos[":id"].$patch・todos[":id"].$delete を呼ぶ
                          失敗は data({ error }, { status })、成功は null（そのあと loader が呼び直される）
```

```
一覧の表示と追加（前 → 後）

// 前（src/client/main.ts。ブラウザで動く）
async function postTodo(): Promise<void> {
    const res = await fetch("/api/todos", { method: "POST", … });
    …
    await loadTodos();        // 自分で取り直して
}
function render(): void {     // 自分で DOM を作り直す
    ul.replaceChildren();
    for (const todo of todos) {
        ul.append(createTodoElement(todo));
    }
    …
}

// 後（web/app/routes/home.tsx。action と loader は web のサーバー、画面はサーバーとブラウザの両方）
export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData();
    const intent = form.get("intent");
    const api = createApi(request);

    if (intent === "add") {
        const text = String(form.get("text") ?? "");
        const deadline = String(form.get("deadline") ?? "");

        const res = await api.api.todos.$post({json: {text: text, deadline: deadline}});
        if (!res.ok) {
            const body = await res.json();
            return data({ error: body.error }, { status: res.status });
        }
    }
    … toggle・delete も同じ形 …
    return null;               // loadTodos() も render() も書かない
}

<ul className="flex flex-col gap-2">
    {todos.map((todo) => (
        <li key={todo.id} …>…</li>      // for と append の代わり。key は「どの <li> がどの ToDo か」の印
    ))}
</ul>
```

| 前（main.ts） | 後（React Router） |
|---|---|
| `loadTodos()` で `fetch("/api/todos")` | `loader` で `createApi(request).api.todos.$get()` |
| 401 なら `showLogin()` で画面を切り替える | `loader` で `/api/me` が 401 なら `throw redirect("/login")`（画面を作る前に移る） |
| 追加・完了・削除のたびに `await loadTodos()` → `render()` | action が終わると React Router が loader を呼び直し、描き直す（revalidation） |
| ボタンごとに `addEventListener` | フォームごとに hidden の `intent`。1つの action で受け分ける |
| どの ToDo かは、関数の引数（`deleteTodo(todo)`） | hidden の `id`（`value={todo.id}`）。フォームの値は全部文字で届く |
| `form.reset()` | `useNavigation` で追加の途中か（`adding`）を見て、`useEffect` で終わったら `reset()` |
| `li.classList.toggle("done", todo.done)` | `` className={`… ${todo.done ? "text-muted line-through" : ""}`} `` |

```
追加のあとにフォームを空にする（12-3。学習者「聞いてない」→ あとから①〜④で説明した）

const navigation = useNavigation();                              ① 今、送っている途中か。送っているフォームの値（formData）も
const addFormRef = useRef<HTMLFormElement>(null);                ② 本物の <form> を指す名札。<Form ref={addFormRef}>
const adding = navigation.formData?.get("intent") === "add";     ③ 追加の途中なら true
useEffect(() => {                                                ④ adding が変わったあとに動く
    if (!adding) {                                                  true → false（追加が終わった）で reset()
        addFormRef.current?.reset();
    }
}, [adding]);

押す前 idle（false）→ 押した直後 submitting（true）→ loader の呼び直し loading（true）→ 終わり idle（false）← ここで空にする
use で始まる関数（フック）は、コンポーネントの上のほうで毎回同じ順に呼ぶ。if の中で呼ばない
```

```
Tailwind の色がブラウザに届くまで（12-4）

① design.md の色の表（人が読む）
② app.css の @theme   --color-accent: #5eead4;   → bg-accent・text-accent・border-accent などが使える
③ lib/styles.ts       primaryButtonClass = "… bg-accent … text-on-accent …"
④ JSX                 className={primaryButtonClass}、className="text-sm text-muted"
⑤ Tailwind（Vite の中）がファイルを読み、使われているクラスの CSS だけを作る：.bg-accent { background-color: #5eead4 }
⑥ root.tsx の import "./app.css" と <Links /> で、HTML に <link> が入る
⑦ ブラウザが class と CSS を合わせて当てる
```

| 前の `style.css` | Tailwind |
|---|---|
| CSS ファイルに名前（`.delete-button`）と中身をまとめて書く | JSX の `className` に小さな部品を並べる（`text-sm` は `font-size: 0.875rem` だけ） |
| `.delete-button:hover { … }` | `hover:bg-danger` |
| 広い画面が先。`@media (max-width: 480px)` で狭い画面を上書き | スマホが先。`sm:`（幅 640px 以上）で広い画面を上書き |
| 色を `#F28B82` と毎回書く | `@theme` で1回登録した名前（`danger`）を使う |
| 数字はそのまま（`padding: 12px 16px`） | 1 = 4px（`py-3 px-4`）。表にない値は `text-[1.75rem]` のように `[ ]` |

### このステップで決めたこと
| 内容 | 却下した案 | 決定 |
|---|---|---|
| だれが書くかは Claude が決める（ステップ10 と同じ形）。★ は 12-3 の action | 学習者が多くを書く（D-0035） | D-0030 |
| `/` を Todo の一覧にする。ログインしていなければ loader で `throw redirect("/login")` | 「ログインしていません」を出して、リンクを置く（11-4 の形） | D-0010 |
| 3つの操作は、どのフォームにも hidden の `intent` を入れ、1つの action で受け分ける。完了はチェックボックスの `onChange` で `requestSubmit()` | 操作ごとにルートを分ける。完了をボタンにする | D-0010 |
| PATCH・DELETE の 404 も `{ error }` を返し、PATCH の成功に `200` を書く（web で `res.ok` によって型を分けるため） | web 側で自分の文言を書く | 学習者（A を選んだ） |
| 色は `@theme` に登録し、よく使う形は `lib/styles.ts` の定数にまとめる。文字は前と同じ Noto Sans JP・ヒラギノ | 毎回クラスを全部書く。`@apply` で CSS のクラスを作る | D-0010 |
| 古い画面と serve-static を消し、build は `tsc -p src/server` だけにする | — | Issue #7 |

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| ★ action の1回目：`taxt` のつづり、削除が追加のコピーのまま、`res` を見ずに何も返さない（`actionData` が `never`） | 3つの `if` を同じ形で書き写した。返す値がないと、画面の型がなくなる | 2回のレビューで直した。どの `if` も「失敗なら `data({ error })`」、最後に `return null` |
| ★ action の2回目：`const done` を `if` の `{}` の中で宣言していた | `const` は宣言した `{}` の中でしか使えない（ブロックスコープ） | 使う場所と同じ `{}` の中で宣言する |
| 完了・削除の失敗で `body` の型が `unknown` | API の 404 が `c.body(null)` で本文がなく、PATCH の成功に `200` もなかった | API を直した（`c.json({ error }, 404)`、`200`）。`donre` のつづりは Claude が直した |
| `const navigation` などを説明されていない | 12-3 のあとに説明すると言って忘れていた（Claude） | ①〜④と表で、あとから説明した |
| `localhost:3000` を開くと 404 | 古い画面と serve-static を消したので、API は画面を配らない（正しい動き） | 画面は web（5173）で開く。web が止まっていたので `app/web/` で `npm run dev` |
| Todo を追加したときの流れの説明で、後半が抜けた | 「`<Form>` → action → API → DB」までで止まった | ④ revalidation（loader の呼び直し）と ⑤ 描き直しを補った。action が動く場所と Cookie の渡し方も |

## 理解度チェック（2026-11-02）
| 質問 | 結果 |
|---|---|
| 言い直し：revalidation と intent | どちらも正解（自動で行われること、どの ToDo かは hidden の `id` で送ることを補足） |
| 完了のフォームで action に届くもの | `intent` と hidden の `id` は正解。完了にするか戻すかの hidden の `done` が抜けた（要復習） |
| ログインしていないとき / → /login | 「home で Cookie がないことを確認してリダイレクト」→ 半分。loader が `/api/me` を呼び、401 なら `throw redirect`（要復習） |
| 追加のあとフォームを空にする | `useNavigation` は正解。`useEffect` が `adding` の true → false で `reset()` することが抜けた（要復習） |
| `bg-accent` が使える理由 | 「app.css」→ 半分。`@theme` に `--color-accent` を登録したから（要復習） |

## 要復習
- 完了のフォームの hidden の `done`：「今の反対」（`String(!todo.done)`）を入れておき、action で `=== "true"` にする。フォームの値は全部文字で届く
- loader の redirect：Cookie を自分で見るのではなく、API が 401 と言ったら `throw redirect("/login")`。期限切れも 401
- `useEffect(したいこと, [見張る値])`：見張る値が変わったあとに動く。追加が終わる（`adding` が false になる）と `reset()`
- `@theme` の `--color-〇〇` で色を登録すると、`bg-〇〇`・`text-〇〇`・`border-〇〇` が使える
- ステップ11から持ち越し：`loader`・`action` が動くのは web のサーバー、`Set-Cookie` を web が写す理由、ルートをつなげて書くと型が積み重なる
- ステップ10から持ち越し：`requireLogin` の3つ（期限、401 で止める、`c.set`/`c.get`）
- ステップ9から持ち越し：`$inferSelect`、マイグレーションの記録
- ステップ8から持ち越し：中間の表の1行、ROLLBACK と id の番号、トランザクションは同じ接続で送る、`ON CONFLICT` が先に効く
- ステップ7から持ち越し：認証と認可、Cookie に `userId` を入れない理由、合言葉がソルトなしでよい理由、`SameSite=Lax`
