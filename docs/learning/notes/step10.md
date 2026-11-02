# ステップ10：API を Hono に置き換える（Issue #5）（まとめ）

期間: 2026-11-01〜11-02
ゴール: Express と cookie-parser を外し、Hono（`@hono/node-server`）で同じパスとメソッドの API を作る。入力を zod で確かめ、不正なら 400 → 達成（PR #9 はメンターのレビュー待ち）
ブランチ: `feature/5-hono`（`feature/4-drizzle` から）→ PR #9（→ `feature/4-drizzle`。#8 がマージされたら `main` に変わる）
進め方: Claude が書いて解説し、★（`requireLogin`、ToDo の入力のスキーマ）は学習者。★の確かめ方も Claude が実行する（D-0034）

早見表（紹介しただけで使っていない知識も含む）
- Express の部品・API の決め方・ステータスコード（置き換える前と比べるとき）：[reference/server.md](../reference/server.md)
- Cookie の属性（`HttpOnly`・`SameSite`・`Max-Age`）と確かめ方：[reference/auth.md](../reference/auth.md)
- PR の本文の下書き（400 の3つと 401 の curl）：[pr/issue-5-body.md](../pr/issue-5-body.md)

---

## 全体の流れ

```
リクエストが来るたびに（Hono）

app.onError            どこかで throw されたら、ここで { error } を返す（壊れた JSON は 400、ほかは 500）
書いた順に、パスとメソッドが合うものへ
  requireLogin         Cookie → SHA-256 → sessions（期限内か）→ c.set("userId", …) → await next()
  （ミドルウェア）      だめなら 401 { error } を return して、ハンドラーまで進まない
  jsonBody             本文を zod で確かめて整える。形が違えば 400 { error } を return
  （zValidator）
  ハンドラー            c.get("userId")、c.req.valid("json") → Drizzle → return c.json(値, 状態)
どの API にも当たらない  serveStatic が public/ の画面（index.html・main.js・style.css）を配る
```

## 作ったもの

```
app/（ブランチ feature/5-hono）
├── package.json          hono 4.13.16・@hono/node-server 2.1.5・zod 4.6.7・@hono/zod-validator 0.9.1 を追加
│                         express・cookie-parser・@types/express・@types/cookie-parser を外した
├── src/server/server.ts  Express → Hono、cookie-parser → hono/cookie、express.static → serveStatic、入力を zod で確かめる
└── README.md             Hono・zod・hono/cookie に合わせた
（画面の public/ と main.ts は変えていない）
```

```
Express → Hono（前 → 後）

すること            前（Express）                                  後（Hono）
アプリと起動        express()、app.listen(port)                     new Hono<Env>()、serve({ fetch: app.fetch, port })
本文                app.use(express.json()) → req.body              c.req.valid("json")（zod で確かめたあとの値）
URL の :id          req.params.id                                   c.req.param("id")
返事                res.status(201).json(値)、res.status(204).end()  return c.json(値, 201)、return c.body(null, 204)
Cookie を読む       cookieParser() → req.cookies.session            getCookie(c, "session")
Cookie を渡す       res.cookie(…, { sameSite: "lax", maxAge: ミリ秒 })  setCookie(c, …, { sameSite: "Lax", maxAge: 秒, path: "/" })
Cookie を消させる   res.clearCookie("session")                      deleteCookie(c, "session", { path: "/" })
ログイン中の人      res.locals.userId（型は any）                   c.set("userId", …) / c.get("userId")（Env で number）
係を通す            app.use("/api/todos", requireLogin)             app.use("/api/todos/*", requireLogin)（/api/todos そのものにも効く）
次へ進む            next()                                          await next()
画面を配る          app.use(express.static("public"))               app.use("/*", serveStatic({ root: "./public" }))
```

- Hono のハンドラーは、返事を `return` する。`return` したらそこで終わる（Express の `res.…` と `return;` の2つが1つになった）
- `type Env = { Variables: { userId: number } }` を `new Hono<Env>()` と `createMiddleware<Env>` に渡すと、`c.get("userId")` が number になる

```
requireLogin（★学習者。前 → 後）

// 前（Express）
const requireLogin: RequestHandler = async (req, res, next) => {
    if (typeof req.cookies.session !== "string") {
        res.status(401).json({error: "ログインしてください"});
        return;
    }
    … SHA-256 → sessions を探す …
    if (!session) { … 401 … }
    res.locals.userId = session.userId;
    next();
};

// 後（Hono）
const requireLogin = createMiddleware<Env>(async (c, next) => {
    const cookie = getCookie(c, "session");

    if (!cookie) {
        return c.json({ error: "ログインしてください" }, 401);
    }

    const passphraseHash = createHash("sha256").update(cookie).digest("hex");

    const [session] = await db
        .select({ userId: sessions.userId })
        .from(sessions)
        .where(and(eq(sessions.tokenHash, passphraseHash), gt(sessions.expiresAt, sql`now()`)));

    if (!session) {
        return c.json({ error: "ログインしてください" }, 401);
    }

    c.set("userId", session.userId);
    await next();
});
```

```
入力の確かめ（前 → 後）。ユーザー登録

// 前（手で確かめる）
if (typeof email !== "string" || typeof password !== "string" || password.length < 8) { … 400 }
const trimmedEmail= email.trim().toLowerCase();
if (trimmedEmail === "") { … 400 }

// 後（zod）
const userSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(8),
});

app.post("/api/users", jsonBody(userSchema, "正しい形のメールアドレスと、8文字以上のパスワードを入れてください"), async (c) => {
    const { email, password } = c.req.valid("json");
```

```
jsonBody（zValidator を包んだもの）

const jsonBody = <T extends z.ZodType>(schema: T, message: string) =>
    zValidator("json", schema, (result, c) => {
        if (!result.success) {
            return c.json({ error: message }, 400);
        }
    });
```

```
ToDo の入力のスキーマ（★学習者）

const todoCreateSchema = z.object({
    text: z.string().trim().min(1),
    deadline: z.iso.date().or(z.literal("")).optional(),
    tagIds: z.array(z.number().int()).optional(),
});

const todoUpdateSchema = z.object({
    done: z.boolean(),
});
```

| zod の書き方 | すること |
|---|---|
| `z.object({ … })` | 本文の形。書いたキーは、`.optional()` がなければ必ず要る |
| `z.string()`・`z.boolean()`・`z.number().int()`・`z.array(…)` | 値の種類（整数、配列） |
| `.trim()`・`.toLowerCase()` | 確かめる前に値を整える（手で書いていた `trim().toLowerCase()`） |
| `.min(1)`・`.max(20)`・`.min(8)` | 文字数 |
| `.pipe(z.email())` | 整えたあとの値で、メールアドレスの形を確かめる |
| `z.iso.date()` | `"2026-11-05"` の形の日付 |
| `.or(z.literal(""))` | 空文字も通す（画面は期限なしのとき `""` を送る） |
| `.optional()` | なくてもよい（画面は `tagIds` を送らない） |

- 確かめは Cookie より後。ログインが要る API は、`requireLogin` が先に 401 を返す（Cookie なしなら本文が変でも 401）
- 日付やタグの形が違うときも「ToDo の内容を入れてください」になる（直すかは任意）

### このステップで決めたこと
| 内容 | 却下した案 | 決定 |
|---|---|---|
| ブランチは `feature/4-drizzle` から切り、PR #9 は #8 の上に積む | `main` から（#8 がまだマージされていない） | D-0010 |
| hono 4.13.16・@hono/node-server 2.1.5・zod 4.6.7・@hono/zod-validator 0.9.1。10-3（`hono/cookie`・serveStatic・express を外す）は 10-2 にまとめた | — | D-0010 |
| `zValidator` を包んだ `jsonBody(スキーマ, メッセージ)` で、失敗は `{ error }` の 400 にそろえる。ルートでは `c.req.valid("json")` | `zValidator` をそのまま使う（400 の中身が zod のエラーの形になり、ほかの `{ error }` とそろわない） | D-0010 |
| `app.onError` で、壊れた JSON は 400、ほかは 500。どちらも `{ error }` | — | D-0010 |
| ★の確かめ方（curl）も Claude が実行する。`tsc` が止まるだけの書き間違い（`,,` など）は Claude が直して伝える | これまでどおり学習者が curl を実行する（時間がかかる） | D-0034 |

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| 壊れた JSON が 500（Express は 400 だった） | Express は `express.json()` が 400 を返していた。Hono では自分で決める | `app.onError` で、Hono が投げる 400 の `HTTPException` を `{ error }` の 400 に |
| ★`requireLogin`：見つからなかったときの 401 がない | `const [session]` は型の上では `undefined` にならないので、`tsc` は通る | 偽の・期限切れの Cookie で `session.userId` が TypeError になり 500。`if (!session)` で 401 |
| ★`requireLogin`：401 が `c.body(null, 401)`（中身なし） | ほかの返事との形のそろえ忘れ | README どおり `c.json({ error: "ログインしてください" }, 401)` |
| ★スキーマ：`deadline` と `tagIds` に `.optional()` がない | `z.object` に書いたキーは、何もつけないと「必ず要る」 | 画面は `tagIds` を送らないので、追加が全部 400 になる。`.optional()` |
| ★スキーマ：`await c.req.valid("json");;` | `valid` は Promise を返さない。`;` が2つ | `await` を外す。`;` は1つ |
| ★スキーマ：`.optional(),,` で `tsc` が `TS1136` | `,` が2つ | Claude が直した（D-0034） |
| 作業中の変更が消えかけた | Claude が型の確かめのために `git checkout` で作業中の変更を戻した | 控えから戻した。試すときは、変更を戻すコマンドを使わない |

## 理解度チェック（2026-11-02）
| 質問 | 結果 |
|---|---|
| `requireLogin` がすること | 「Cookie の中身を確認し、ハッシュにして DB の sessions と比較」→ 半分。期限（`expires_at > now()`）も見ること、だめなら 401 `{ error }` を返してハンドラーまで進まないこと、通れば `c.set("userId")` で渡しハンドラーは `c.get` で受け取ることを補った（要復習） |
| API で zod を使う理由 | 「curl などで直接リクエストを送れるので、サーバー側のチェックがセキュリティ上必要」→ 正解（ステップ6からの要復習「入力はサーバーで確かめる理由」も解消） |

## 要復習
- `requireLogin` の3つ：期限内か（`expires_at > now()`）も見る、だめなら 401 を `return` してハンドラーまで進まない、通れば `c.set("userId")` → ハンドラーで `c.get("userId")`（Q1）
- ステップ9から持ち越し：`$inferSelect`、マイグレーションの記録
- ステップ8から持ち越し：中間の表の1行、ROLLBACK と id の番号、トランザクションは同じ接続で送る、`ON CONFLICT` が先に効く
- ステップ7から持ち越し：認証と認可、Cookie に `userId` を入れない理由、合言葉がソルトなしでよい理由、`SameSite=Lax`
