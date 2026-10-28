# ステップ7：ログイン（認証）（まとめ）

期間: 2026-10-27〜10-28
ゴール: 登録とログインをして、自分の ToDo だけを見て操作できる（ログインしていない人や他人は、見ることも変えることもできない） → 達成

早見表（紹介しただけで使っていない知識も含む）
- ログイン・Cookie・パスワードの保存・技術の選択肢・実務で足すもの：[reference/auth.md](../reference/auth.md)
- 外部キー・`JOIN`・1つの表に全員分を入れる設計・索引：[reference/database.md](../reference/database.md)
- ログインの画面とユーザーの帯のデザインの値：[reference/design.md](../reference/design.md)

---

## 全体の流れ

![ログインの全体の流れ](../reference/images/login-flow.svg)

```
パスワードを使うのは、登録とログインの2回だけ。そのあとは毎回 Cookie の合言葉で見分ける

登録      req.body（メールアドレス・パスワード） → argon2 でハッシュ → users に保存
ログイン  req.body（メールアドレス・パスワード） → users の行を探す → argon2.verify
          → 合言葉を乱数で作る → sessions には SHA-256 のハッシュ、Cookie には合言葉そのもの
毎回      Cookie の合言葉 → SHA-256 → sessions を探す（期限内か）→ user_id → 自分の行だけの SQL
ログアウト Cookie の合言葉 → SHA-256 → sessions の行を消す → Cookie も消させる
```

## 作ったもの

```
app/
├── db/schema.sql         users（email UNIQUE・password_hash）、todos に user_id（REFERENCES users ON DELETE CASCADE）、
│                         sessions（token_hash が主キー・user_id・expires_at・created_at）
├── package.json          argon2、cookie-parser、@types/cookie-parser を追加
├── src/server/server.ts  登録・ログイン・ログアウト・/api/me、入口の係 requireLogin、ToDo の SQL に user_id
├── public/index.html     2つの section（#login-view・#todo-view）を hidden で切り替え
├── public/style.css      ログインの画面とユーザーの帯（値は design.md）
├── src/client/main.ts    start（/api/me）、login・register・logout、401 ならログインの画面へ
└── README.md             機能・使用技術・古い DB の作り直し・API の一覧（今回だけ Claude が書いた）
```

```
server.ts の形

app.use(express.json()); app.use(cookieParser());
POST   /api/users      typeof → trim().toLowerCase() → 空・8文字未満なら 400 → argon2.hash
                       → INSERT ... ON CONFLICT (email) DO NOTHING RETURNING id, email → rowCount 0 で 409 / 201
POST   /api/login      typeof → 整える → SELECT ... WHERE email → なし・verify が false なら同じ 401
                       → randomBytes(32) → createHash("sha256") → INSERT INTO sessions（NOW() + INTERVAL '7 days'）
                       → res.cookie("session", 合言葉, { httpOnly, sameSite: "lax", maxAge }) → 200 { id, email }
POST   /api/logout     Cookie が文字列なら DELETE FROM sessions → clearCookie → いつでも 204
requireLogin           Cookie がない・sessions にない・期限切れなら 401 → res.locals.userId → next()
GET    /api/me         requireLogin → SELECT id, email → 200
app.use("/api/todos", requireLogin)
ToDo の4つ             すべての SQL に user_id。他人の id は rowCount 0 で 404
```

```
画面（main.ts）の形

start()     GET /api/me → 401 ならログインの画面 / 200 なら showTodos(email)
login()     POST /api/login → だめなら返事の error を出す → showTodos
register()  POST /api/users → だめなら error → そのまま login()
logout()    POST /api/logout → 一覧を空にする → ログインの画面
4つの関数   401 なら showLogin("ログインしてください")
JS は合言葉に一切さわらない（Set-Cookie の保存も Cookie の送信もブラウザがする。HttpOnly なので読めない）
```

### このステップで決めたこと
| 内容 | 却下した案 | 決定 |
|---|---|---|
| 自分で作る＋セッション | 自分で作る＋JWT、ライブラリ（express-session・Passport.js・Better Auth）、外部サービス | D-0020 |
| 合言葉も DB にはハッシュ（SHA-256、ソルトなし）で保存 | そのまま保存（DB が漏れるとなりすませる） | D-0022 |
| 課題は目的・手順・骨組みまで最初に示す | 型と仕様だけ示し、ヒントで補う | D-0021 |
| 書いたら先にレビューし、確かめ方はそのあと | 直したら確かめ方まで進めてからレビュー | D-0023 |
| パスワードは `password_hash` の1列、ライブラリは argon2 | bcryptjs（72バイトまで）、`node:crypto` の scrypt（保存の形を自分で決める） | D-0010 |
| `todos` は DB ごと作り直す、`ON DELETE CASCADE` | 今ある ToDo を誰かに割り当てる、`RESTRICT` | D-0010 |
| `sessions` は `token_hash` が主キー、期限7日は INSERT に書く | 連番の id ＋ `UNIQUE`、DEFAULT に書く（既存の表は変わらない） | D-0010 |
| パスは `/api/login`・`/api/logout`、合言葉は `randomBytes(32)`、`sameSite: "lax"` | `/api/sessions`、`randomUUID()`、`"strict"` | D-0010 |
| Cookie は cookie-parser で読む、名札は `res.locals.userId`、係は `app.use("/api/todos", ...)`、他人の ToDo は 404 | 自分で分ける、`req` に足す、ルートごとに書く、403 | D-0010 |
| 1つの HTML を `hidden` で切り替え、`GET /api/me` を足す、ログインと同じフォームに「登録する」、登録のあとはそのままログイン | ページを分ける、`/api/todos` の 401 で判断、登録のフォームを別に | D-0010 |

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| 練習用のルートで、そもそも何を書けばよいか分からない | 型と仕様の表だけで、全体像がなかった | 手紙（`req`）と封筒（`res`）のたとえ、既存のルートとの対応、骨組み（D-0021） |
| `user_id INTEGER NOT NULL ON DELETE CASCADE` | `REFERENCES` 抜け | 型と見比べる |
| `schema.sql` をコミットしたつもりが入っていない | 外側のフォルダで実行した（git は親へ `.git` を探す） | `cd app` してからやり直す。`pwd` で確かめる |
| `npm run build` で `Could not read package.json` | 外側のフォルダで実行した（npm は今のフォルダだけ見る） | `cd ~/RECERQA/todo-app/app && npm run build` |
| `ON ONCFLICT`、`DO NOTHING` 抜け、列名 `passwordHash` | つづり。TS はキャメルケース、SQL はスネークケース。`"` なしの名前は小文字で読まれる | エラー文の `^` の位置を見る。`schema.sql` の列名と見比べる |
| `tsc` が通るのに 500 | SQL は TypeScript から見るとただの文字列 | SQL の誤りは実行して初めて分かる。`PREPARE` で実行せずに確かめられる |
| `if (email = "")` | `=` は代入。`const` だったので `TS2588` で気づけた | 比べるのは `===` |
| 直したのに 500 のまま | build してもサーバーを起動し直していなかった | 動いているサーバーは、起動したときのコードを使い続ける |
| 登録まで整える前のメールアドレスを保存した | 名前の似た変数（`email`・`trimmedEmail`）を取り違えた | 整える前の値に変数を作らない、または名前をはっきり分ける |
| `INTERVAL "7 days"` | `"` は列名の記号。文字の値は `'...'` | `INTERVAL '7 days'` |
| `const result = pool.query(...)` で `rowCount` がない | `await` 抜けで Promise のまま | `await`。結果を使わないなら変数も型も要らない |
| DB は1日、Cookie は7日 | 期限を2か所に書いて食い違った | 同じファイルに並べて揃える |
| ログインでもパスワードの長さを確かめた | 登録の決まりをそのまま写した | 決まりは登録のときだけ。ログインは照合するだけ |
| `res.locals.userId(result.rows[0])` | `()` は関数の呼び出し。`res.locals` は any なので `tsc` が通る | `res.locals.userId = result.rows[0].user_id`。行の型を書くとつづりも確かめられる |
| `SELECT * FROM todos ORDER BY id WHERE ...` | SQL の順番 | `WHERE` → `ORDER BY` |
| 係が 404、ログアウトが 401・404 を返す | ステータスの意味と、ログアウトの目的 | ログインが要る → 401。ログアウトはいつでも 204 で Cookie も消す |
| ログアウトの 401 に `return` がない | 返事を送っても関数は続く | `update(undefined)` でエラー。`return` を忘れない |
| `"#ogout-button"`、`hidden` の向きが逆 | セレクタはただの文字列。`hidden = true` は隠す | 画面がヘッダーだけ。id は HTML と照らし合わせる |
| Q4「合言葉のハッシュは DB と一致しない（ソルトがあるから）」 | パスワードと合言葉のハッシュの使い方の混同 | 合言葉はソルトなし。届いた合言葉だけで行を探すため |

## 理解度チェック（2026-10-28）
| 質問 | 結果 |
|---|---|
| ログイン後、サーバーが「誰か」を知る方法と、Cookie に `userId=3` ではいけない理由 | 「Cookie の言葉をハッシュにして確かめる」は答えられた。`sessions` から `user_id` を取り出す点は補足。`userId=3` がだめな理由（利用者が `4` に書き換えるだけでなりすませる）は答えられず（要復習） |
| パスワード（argon2・遅い・ソルトあり）と合言葉（SHA-256・速い・ソルトなし）を分けた理由 | パスワード側は「人が作るので辞書攻撃に弱い」と説明できた。合言葉側（乱数で推測できない、毎回照合するので速さが要る、ソルトがあると合言葉だけで行を探せない）が抜けた（要復習。7-4 の Q4 と同じところ） |
| d が c の ToDo の id を知っていても消せない理由と、返るステータス | 「合言葉のチェックが毎回行われる」と回答 → それは認証（d が d だと分かる）。消せないのは認可で、SQL の `WHERE id = $1 AND user_id = $2` のおかげ（d は正しくログインしているので係は通る）。404 も答えられず（要復習） |
| `HttpOnly` と `SameSite=Lax` が防ぐもの | `HttpOnly` は「JS から見えない」と説明できた（XSS で盗まれない、は補足）。`SameSite=Lax`（ほかのサイトからのリクエストに Cookie をつけない → CSRF を防ぐ）は答えられず（要復習） |

## 要復習
- 認証と認可の区別：入口の係は「誰か」を確かめるだけ（認証）。他人の行を触れないのは SQL の `AND user_id = ...` のおかげ（認可）。他人の id は 404（理解度チェック Q3）
- Cookie に `userId=3` を入れてはいけない理由：ブラウザから届くものは書き換えられる。だから推測できない合言葉を入れ、誰かは DB で調べる（Q1）
- 合言葉が SHA-256・ソルトなしでよい理由：乱数で推測できない、毎回照合するので速さが要る、ソルトがあると合言葉だけで行を探せない（Q2、7-4 の Q4）
- `SameSite=Lax`：ほかのサイトからのリクエストに Cookie をつけない → CSRF を防ぐ（Q4）
- 実行する場所（`app/` か外側か）。`pwd` で確かめる
- build したら、サーバーを起動し直す
- ステップ6から持ち越し：`""` と `null` の違い、`tsc` は「検証して変換」、目的の違う変更はコミットを分ける、`flex-basis: 100%`
