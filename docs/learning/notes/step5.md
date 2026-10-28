# ステップ5：サーバー（Node.js + Express）（まとめ）

期間: 2026-10-13〜10-14（約6.5時間）
ゴール: Express のサーバーから画面を配信し、ToDo の追加・完了・削除を API 経由で行う（再読み込みしても消えない。サーバーを止めると消える） → 達成

早見表（紹介しただけで使っていない知識も含む）
- Express・API・fetch・curl・ステータスコード：[reference/server.md](../reference/server.md)

---

## 作ったもの

```
app/
├── package.json        scripts：build（tsc を2回）/ start（node dist/server.js）/ dev（build + start）
├── src/
│   ├── client/
│   │   ├── main.ts           画面（src/main.ts から git mv）
│   │   └── tsconfig.json     → ../../public/（dom あり）
│   └── server/
│       ├── server.ts         サーバー
│       └── tsconfig.json     → ../../dist/（dom なし、module: nodenext、types: node）
├── public/             index.html、style.css、main.js（作られる）
└── dist/               server.js（作られる。git に入れない）
```

```
server.ts の形

app.use(express.json())                 本文の JSON を読んで req.body に入れる
GET    /api/todos      → 200 + 配列
POST   /api/todos      → 201 + 作った ToDo（id はサーバーがつける。nextId++）
PATCH  /api/todos/:id  → 200 + 変えた ToDo / 404
DELETE /api/todos/:id  → 204（データなし） / 404
app.use(express.static("public"))       public/ のファイルを返す
app.listen(3000, ...)
```

```
main.ts の形（D-0009 の「データから画面を作り直す」をサーバー版にした）

loadTodos()   GET → todos に入れる → render()      ← todos を変えるのはここだけ
postTodo()    POST → loadTodos()
changeDone()  PATCH → loadTodos()
deleteTodo()  DELETE → loadTodos()
render() / createTodoElement()    ステップ3からほぼ変わっていない
```

```
データの置き場所
ステップ3・4：ブラウザのメモリ   → 再読み込みで消える
ステップ5  ：サーバーのメモリ   → 再読み込みでは消えない。サーバーを止めると消える
ステップ6  ：データベース        → 止めても消えない
```

### このステップで決めたこと
| 番号 | 内容 |
|---|---|
| D-0014 | セッションの始めの3問をやめる（終わりの理解度チェックは続ける） |
| D-0015 | `src/client` → `public/`、`src/server` → `dist/` に分け、どちらも `tsc` で変換する。tsconfig はフォルダごと |
| D-0016 | 新しい文法や関数は、Claude が書き方の型を先に示す |
| D-0017 | 動作確認のコマンド（curl など）は、Claude が毎回そのまま実行できる形で書く |
| — | 起動は `npm run dev`（build + start）。`start` は変換済みを動かすだけ（ステップ7で公開先が使う形） |
| — | API のパスは `/api` から始める（`public/` のファイルと区別する） |
| — | id は 1 から1ずつ増やす（`crypto.randomUUID()` ではなく。DB も同じ形） |
| — | 画面は、操作のたびに GET で一覧を取り直す（API が返した ToDo で手元を直す方法ではなく） |

---

## 5-1 サーバーを立てる

- サーバーは「**起動したら終わらずに、リクエストを待ち続けるプログラム**」。止めるのは `Ctrl + C`
- **ポート**はパソコンの中の窓口の番号。`listen(3000, ...)` は「3000 番に来たリクエストはこのプログラムに渡して」と OS に予約すること。1つのポートは1つのプログラムだけ（2つ目は `EADDRINUSE`）
- `express()` は「サーバーの本体（`app`）」を作って返す関数。`document.createElement("li")` と同じ形
- `app.get(パス, 関数)` は**手順書に1行足すだけ**。関数はリクエストが来たときに Express が呼ぶ。ステップ3の `addEventListener` と同じ（登録する人と呼ぶ人が別）
- `(req, res)` は**自分でつけた引数の名前**。`filter((todo) => ...)` の `todo` と同じ。Express が「リクエストの情報」と「返事を作る道具」を入れて呼ぶ
- ブラウザが送れるのは HTTP の文字だけ（メソッド・パス・クエリ・ヘッダー・本文）。Express がそれを `req` に詰め直す（`req.method`、`req.path`、`req.query`、`req.body`）
- サーバーの `console.log` は**ターミナル**に出る（ブラウザの Console ではない）
- `@types/express` は、JS で書かれた Express にあとから型をつける `.d.ts`。`@types/node` は Node.js のバージョンに合わせる（`@24`）
- `req: Request, res: Response` と書くと、`fetch` 用の別の型になってエラー。**型は書かずに推論させる**
- 登録していないパスは `Cannot GET /abc`（404。返事がある）、サーバーが止まっていれば接続拒否（返事がない＝番号もない）

## 5-2 画面を配信する

- `app.use(express.static("public"))`：パスと同じ名前のファイルが `public/` にあれば返す。`/` は `index.html`
- **手順書は上から順に見て、最初に返事をしたところで終わり**。static を先に書くと、後ろの `app.get("/")` は呼ばれない
- 304 Not Modified：ブラウザの手元の保存分（キャッシュ）から変わっていない
- 再読み込みで消えたのは、ToDo が**一度もサーバーに送られていなかった**から（サーバーはファイルを配るだけ）

## 5-3 API を作る

- API は「**プログラムから使う窓口**」。API キーは、外部の API で「誰が呼んだか」を見分ける合言葉で、API の必須条件ではない
- REST：パスは「もの」（名詞・複数形）、動作はメソッド。全体は `/todos`、1つは `/todos/3`
- **パスは URL の目印の文字列**で、変数 `todos` とはつながっていない。`"` で囲む（囲まないと正規表現になる）
- `res.json(データ)` には**届けたいデータそのもの**を渡す。`"todos"` は5文字の文字、`todos` は変数の中身
- **id が要る理由**：①ブラウザとサーバーはメモリを共有せず、JSON の文字から作り直すので、`t !== todo` は必ず「違う」になる ②「何番目か」は削除でずれる。id は作ったときに1回だけつけて変えない
- 数の `+1`（`++`、`+=`）は必ず入れ直しなので `let`。配列の `push` は中身を変えるだけなので `const` でもよい
- `:id` で受け取った `req.params.id` は**文字列**。`Number(...)` で数にする
- `find` は見つからないと `undefined`。型を書かずに `if (!todo) { ...; return; }` で絞り込む（4-4 の `getElement` と同じ）
- `res.status(...)` は**番号を決めるだけ**。`.json(...)` か `.end()` で送る。送らないと curl もブラウザも待ち続ける
- 404 を返したら `return`。返事をしても関数は終わらない
- `=`（入れる）と `===`（比べる）、`"todos"` と `todos` は `tsc` では見つからない → **curl で1つずつ確かめる**（最終ステップ（品質）でテストにする）

## 5-4 画面から API を呼ぶ

- `fetch` はブラウザ版の curl。同じサーバーなのでパスだけで書ける
- 非同期：`fetch` はすぐに「引換券」（Promise）を返して先に進む。`await` で返事を待って中身を取り出す。`await` は `async` 関数の中だけ
- `await` なしの `fetch` は `Promise {<pending>}`（まだ待っている引換券）
- `async` 関数を `await` なしで呼ぶと、終わるのを待たずに次の行へ進む → `await loadTodos();`
- `fetch` は 404 や 500 でもエラーにならない → `res.ok` を確かめて `throw`
- `JSON.stringify`（オブジェクト → 文字）と `res.json()` / `express.json()`（文字 → オブジェクト）
- `Todo` に `id` を足すと、直す場所（`todos.push`）を `tsc` が教えてくれる
- API を呼ぶ処理を関数（`postTodo` など）に分けると、イベントの中が短くなる
- 画面を作る部分（`render`、`createTodoElement`）はほぼそのまま使えた。データから画面を作る形（D-0009）にしていたから

## 5-5 仕上げと技術の選択肢

- README に「clone した人が README だけで起動できる」手順を書いた（`npm install` → `npm run build` → `npm start` → URL）
- `mkdir ./dist` は不要（`tsc` が作る）。すでにあると失敗し、`&&` の後ろが実行されない
- Markdown の箇条書きは `- `（`・` は箇条書きにならず、1行につながる）

| 分類 | 選択肢 | どんなときに |
|---|---|---|
| Node.js のサーバー | **Express**（採用） | 情報が最も多く、仕組みが単純 |
| | Fastify | 速さが必要なとき。書き方は Express に近い |
| | Hono | Node.js 以外（Deno、Bun、Cloudflare）でも同じコードで動かしたいとき |
| | NestJS | 大規模・大人数で形をそろえたいとき |
| 他の言語 | Python（FastAPI / Flask / Django） | AI・データ分析と組み合わせる。FastAPI は Express に近い |
| | Ruby on Rails、Go、Java（Spring Boot）、PHP（Laravel）、C#（ASP.NET Core） | チームの言語、速さ、公開先で選ぶ |
| API の形 | **REST**（採用） | 最も広く使われる |
| | GraphQL | 欲しいデータの形を送る。画面が複雑なとき |
| | tRPC | 画面もサーバーも TS のとき。型を2回書かなくてよい |
| | gRPC | サーバー同士の通信 |
| 自分で書かない | Firebase、Supabase（BaaS） | DB・ログイン・API がセット |
| | Next.js、Nuxt、SvelteKit | 画面とサーバーを1つのプロジェクトで書く |

- **Next.js** = React + サーバー機能 + 決まったフォルダ構成。`app/api/todos/route.ts` のように**ファイルの場所がパスになる**。サーバー側で HTML を作れる（SSR：表示が速く、検索に強い）。TS が標準（`.tsx`）。覚えることが多く、裏で多くが自動で行われるので、ステップ1〜5の仕組みの理解が役に立つ
- 画面だけ React（Vite）、サーバーは別の言語で REST、という構成も多い

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| `server.ts` の書き方が全く分からない | `express()`・`req` / `res`・パスの意味が説明されていなかった | 部品ごとに、ステップ3の `createElement`・`addEventListener`・`filter` と対応させて説明 |
| `req: Request, res: Response` で4エラー | `fetch` 用の別の型を書いた | 型を書かず推論させる（Express の型は `@types/express` が知っている） |
| `/api/todos` の追加で `Cannot GET` / `Cannot POST` | 5-1 の古いサーバーが裏で動き続け、3000 番を使っていた | `lsof -nP -iTCP:3000 -sTCP:LISTEN` で調べて `kill 番号`。サーバーは自分のターミナルで `npm run dev`、止めるのは `Ctrl + C` |
| `Unknown regular expression flag` | パスを `"` で囲んでいない | パスは文字列 |
| `res.json(/api/todos)`、`res.json("todos")` | パスを渡せば中身が返ると思った／文字と変数の区別 | `res.json` には届けたいデータ（変数）を渡す |
| `Cannot assign to 'nextId' because it is a constant` | 数の `+1` は入れ直し | `let` |
| `find` の条件が `t.id = ...` | 比べるのではなく入れていた | `===` |
| `const todo: Todo = todos.find(...)` で型エラー | `find` は `undefined` を返すことがある | 型を書かずに `if (!todo)` で絞り込む |
| DELETE で curl が終わらない | `res.status(...)` だけで送っていない | `res.status(204).end()` |
| `chengeDone` | つづり | `tsc` の `Did you mean ...?` を読む |
| `text: todoInput` で文字が届かない | 要素そのものを送っていた（3-3 と同じ） | `.value` |
| curl で `Couldn't connect to server` | サーバーを止めた同じターミナルで実行していた | サーバー用と curl 用でターミナルを分ける |
| コミットが `git: 'command' is not a git command` | 日本語入力が混ざった | 日本語入力をオフにしてコマンドを打ち、メッセージだけ日本語 |
| README の手順に `mkdir ./dist` | `tsc` がフォルダを作ることを忘れていた | 不要。2回目から失敗する |

## 要復習
- `tsc` は「検証して**変換**」、`node` が「実行」（理解度チェック Q3。コマンドの順番は答えられたが、役割の説明が抜けた）
- id が要る理由の①（オブジェクトの比較が使えない）（理解度チェック Q2）
- `;` の抜け（ステップ5ではほぼ直った）
- コミットメッセージに「何が変わったか」を書く。目的の違う変更はコミットを分ける（`API`、`RAEDME変更` に main.ts も入っていた）
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
