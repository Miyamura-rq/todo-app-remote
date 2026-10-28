# サーバーと API（早見表）

作成: 2026-10-14（ステップ5）
詳しく調べるとき: [Express 公式（日本語）](https://expressjs.com/ja/)、[MDN：fetch の使用](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch)、[MDN：HTTP レスポンスステータスコード](https://developer.mozilla.org/ja/docs/Web/HTTP/Status)

各表の「使った」欄の印：✅ = ToDo アプリで使った、空欄 = 紹介だけ（必要になったら使う）

---

## 1. Express の部品

| 書き方 | 意味 | 使った |
|---|---|---|
| `import express from "express";` | 読み込む | ✅ |
| `const app = express();` | サーバーの本体を作る | ✅ |
| `app.get(パス, (req, res) => { ... })` | GET がそのパスに来たら関数を実行 | ✅ |
| `app.post` / `app.patch` / `app.delete` | POST / PATCH / DELETE の場合 | ✅ |
| `app.put(パス, 関数)` | PUT（全体を置き換える）の場合 | |
| `app.use(関数)` | メソッド・パスを問わず、すべてのリクエストで通す | ✅ |
| `app.listen(ポート, () => { ... })` | ポートを開いて待ち始める。関数は準備ができたら1回だけ | ✅ |

- **手順書は上から順に見て、最初に返事をしたところで終わり**。`express.json()` はルートより前に書く
- 合う手順がなければ、Express が `Cannot GET /パス`（404）を返す

### よく使う `app.use` の中身
| 書き方 | 意味 | 使った |
|---|---|---|
| `express.json()` | 本文の JSON を読んで `req.body` に入れる | ✅ |
| `express.static("public")` | `public/` のファイルを返す。`/` は `index.html` | ✅ |
| `express.urlencoded()` | フォームを JS なしで送ったときの本文を読む | |

### `req`（届いたリクエスト）
| 書き方 | 中身 | 例（`POST /api/todos/3?sort=date`） | 使った |
|---|---|---|---|
| `req.method` | メソッド | `"POST"` | ✅ |
| `req.path` | パス | `"/api/todos/3"` | ✅ |
| `req.params.id` | パスの `:id` の部分（**文字列**） | `"3"` | ✅ |
| `req.query.sort` | `?` の後ろ（文字列） | `"date"` | ✅ |
| `req.body` | 本文（`express.json()` が必要。型は `any`） | `{ text: "牛乳" }` | ✅ |
| `req.headers` | ヘッダー | `{ "content-type": ... }` | |

### `res`（返事を作る道具）
| 書き方 | 意味 | 使った |
|---|---|---|
| `res.send("文字")` | 文字を返す（200） | ✅ |
| `res.json(データ)` | データを JSON の文字にして返す（200） | ✅ |
| `res.status(201).json(データ)` | 番号を決めて、データをつけて送る | ✅ |
| `res.status(204).end()` | 番号を決めて、データなしで送る | ✅ |
| `res.sendStatus(404)` | 番号だけ送る（本文に `Not Found` の文字がつく） | |
| `res.redirect("/パス")` | 別のパスに移動させる（302） | |

- **`res.status(...)` だけでは送られない**。送らないと相手は待ち続ける
- **返事をしても関数は終わらない**。途中で返すときは `return`

## 2. API（REST）の決め方

| ルール | 例 |
|---|---|
| パスは「もの」（名詞・複数形）。動作はメソッドで表す | ✕ `/addTodo` ○ `POST /todos` |
| 全体と1つでパスを分ける。1つは id で指す | `/todos`、`/todos/3` |
| メソッドの意味を守る | GET は取るだけ（データを変えない） |

| メソッド | 意味 | ToDo アプリ |
|---|---|---|
| GET | 取る | `GET /api/todos` → 200 + 配列 |
| POST | 新しく作る | `POST /api/todos` → 201 + 作ったもの |
| PATCH | 一部を変える | `PATCH /api/todos/:id` → 200 + 変えたもの |
| PUT | 全体を置き換える | （使っていない） |
| DELETE | 消す | `DELETE /api/todos/:id` → 204 |

## 3. ステータスコード

| 番号 | 名前 | 使う場面 | 使った |
|---|---|---|---|
| 200 | OK | 成功してデータを返す | ✅ |
| 201 | Created | 新しく作れた | ✅ |
| 204 | No Content | 成功したが返すデータがない | ✅ |
| 301 / 302 | Moved | 別の URL に移動した（永久 / 一時） | |
| 304 | Not Modified | キャッシュから変わっていない | （見ただけ） |
| 400 | Bad Request | 送られたデータがおかしい（7-3 で使った。入力チェックをそろえるのは最終ステップ（品質）） | |
| 401 | Unauthorized | ログインしていない | |
| 403 | Forbidden | ログインしているが権限がない | |
| 404 | Not Found | ない | ✅ |
| 500 | Internal Server Error | サーバーのコードでエラー | |

- **番号が返ってくる** = サーバーは動いている。**番号がない（接続拒否）** = サーバーが止まっている
- 203（Non-Authoritative Information）はほぼ使わない

## 4. ブラウザから呼ぶ（fetch と async / await）

```ts
// 取る（GET）
async function 関数名(): Promise<void> {
  const res = await fetch("/api/○○");
  if (!res.ok) {
    throw new Error(`失敗しました（${res.status}）`);
  }
  const data: 型[] = await res.json();
}

// 送る（POST / PATCH）
const res = await fetch("/api/○○", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(送るデータ),
});

// 本文なし（DELETE）
const res = await fetch(`/api/○○/${id}`, { method: "DELETE" });

// イベントで使う
button.addEventListener("click", async () => {
  await 関数名();
});
```

| 書き方 | 意味 | 使った |
|---|---|---|
| `async function f(): Promise<型>` | `await` を使える関数。必ず Promise を返す | ✅ |
| `await Promise` | 終わるまで待って中身を取り出す。`async` の中だけ | ✅ |
| `res.ok` / `res.status` | 200 番台なら `true` / ステータスコード | ✅ |
| `await res.json()` | 本文を JSON として読む（型は `any`） | ✅ |
| `await res.text()` | 本文を文字として読む | |
| `JSON.stringify(オブジェクト)` | オブジェクト → JSON の文字 | ✅ |
| `JSON.parse(文字)` | JSON の文字 → オブジェクト | |
| `promise.then((値) => { ... })` | `await` を使わない、古い書き方 | |
| `try { ... } catch (e) { ... }` | `throw` されたエラーを受け止める（最終ステップ（品質）） | |

- `await` を忘れると `Promise {<pending>}`（まだ待っている引換券）が入る
- `fetch` は 404 や 500 でもエラーにならない。`res.ok` を自分で確かめる
- `preventDefault()` は `await` より前に書く

## 5. 配列で探す

| 書き方 | 返すもの | 見つからないとき | 使った |
|---|---|---|---|
| `filter((t) => 条件)` | 合うものすべての配列 | `[]` | ✅ |
| `find((t) => 条件)` | 合う最初の1つ | `undefined` | ✅ |
| `findIndex((t) => 条件)` | 何番目か | `-1` | |
| `some((t) => 条件)` | 1つでも合えば `true` | `false` | |
| `every((t) => 条件)` | 全部合えば `true` | — | |

- 数の `+1`：`n = n + 1`、`n += 1`、`n++`。どれも入れ直しなので `let`

## 6. ターミナルで確かめる

```bash
# GET
curl -i http://localhost:3000/api/todos

# POST
curl -i -X POST -H "Content-Type: application/json" -d '{"text":"牛乳を買う","deadline":"2026-10-20"}' http://localhost:3000/api/todos

# PATCH
curl -i -X PATCH -H "Content-Type: application/json" -d '{"done":true}' http://localhost:3000/api/todos/1

# DELETE
curl -i -X DELETE http://localhost:3000/api/todos/1
```

| オプション | 意味 |
|---|---|
| `-i` | ステータスコードとヘッダーも表示 |
| `-X メソッド` | メソッド（書かなければ GET） |
| `-H "名前: 値"` | ヘッダー |
| `-d '本文'` | 本文 |

| コマンド | 意味 |
|---|---|
| `lsof -nP -iTCP:3000 -sTCP:LISTEN` | 3000 番で待っているプログラムを調べる |
| `kill 番号` | そのプログラムを止める |
| `git -C フォルダ コマンド` | `cd` せずに、そのフォルダで git を実行 |

- サーバーは自分のターミナルで `npm run dev`、止めるのは `Ctrl + C`。curl は**別のターミナル**で
- `EADDRINUSE`：そのポートはもう使われている（古いサーバーが動いている）

## 7. ポート番号

| 番号 | 使われ方 |
|---|---|
| 80 / 443 | HTTP / HTTPS（URL で省略されている） |
| 22 | SSH |
| 3000、8080、5173 | 開発用のサーバー |
| 5432 | PostgreSQL（ステップ6） |

## 8. npm の scripts（このアプリ）

| コマンド | 中身 | 使う場面 |
|---|---|---|
| `npm run build` | `tsc -p src/client && tsc -p src/server` | 変換だけ（チェック + JS を作る。実行はしない） |
| `npm start` | `node dist/server.js` | 変換済みを動かす（公開先でも使う形） |
| `npm run dev` | `npm run build && npm start` | 開発中はこれ1つ |

- `start` と `test` だけは `run` を省略できる
- `&&` は「前が成功したら次を実行」

## 9. Markdown（README の書き方）

| 書き方 | 意味 |
|---|---|
| `# 見出し`、`## 見出し` | 大見出し、中見出し |
| `- 項目` / `1. 項目` | 箇条書き / 番号つき（`・` は箇条書きにならない） |
| `` `コード` `` | 短いコード |
| ` ```bash ` 〜 ` ``` ` | コマンドのかたまり（GitHub でコピーボタンがつく） |
| `[文字](URL)` | リンク |
| `\| 列 \| 列 \|` | 表 |

- 改行だけの行は、つながって1つの段落になる。段落を分けるには空行を入れる
