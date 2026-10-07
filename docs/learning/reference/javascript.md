# JavaScript の書き方（早見表）

作成: 2026-10-06（ステップ3）
詳しく調べるとき: [MDN の JavaScript リファレンス](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference)

各表の「使った」欄の印：✅ = 練習または ToDo アプリで使った、空欄 = 紹介だけ（必要になったら使う）

---

## 1. 変数

| 書き方 | 意味 | 使った |
|---|---|---|
| `const x = 1;` | 入れ直さない変数。**迷ったらこれ** | ✅ |
| `let x = 0;` | 入れ直す変数（数を数える箱など） | ✅ |
| `var x = 0;` | 古い書き方。今は使わない | |

- `=` の右側は、先に計算されて値になってから左の変数に入る（`const r1 = a(3);` はこの時点で `a` が実行される）

## 2. 型（データの種類）

| 種類 | 例 | Python との違い | 使った |
|---|---|---|---|
| 文字列 | `"牛乳"`、`` `残り ${n} 件` `` | f-string の代わりに `` ` `` と `${}` | ✅ |
| 数値 | `3`、`1.5` | 整数と小数を分けない | ✅ |
| 真偽値 | `true`、`false` | 小文字（Python は `True`） | ✅ |
| 値がない | `null`、`undefined` | Python の `None` にあたるものが2つ。`return` のない関数は `undefined` を返す | ✅ |
| 配列 | `["a", "b"]` | Python のリスト | ✅ |
| オブジェクト | `{ text: "掃除", done: true }` | Python の辞書に近い。名前に `" "` はいらない | ✅ |

- `"..."` で囲まないと式として計算される（`2026-10-10` は引き算で `2006` になる）
- 日付：基本の型にはない。`new Date("2026-10-10")` は「日時」で時差の問題がある。ToDo の期限は文字列 `"2026-10-10"` で持つ（入力欄も JSON も文字列。この形なら大小比較で日付順になる）。ほかに `Temporal.PlainDate`（新しい仕組み）、ライブラリの Day.js・date-fns

## 3. 配列とオブジェクト

```js
const todos = [
  { text: "掃除をする", deadline: "2026-10-10", done: true },
  { text: "大学に連絡", deadline: "2026-10-11", done: false },
];

todos.length      // 2（個数）
todos[0]          // 1件目（番号は 0 から）
todos[1].text     // "大学に連絡"
```

| 書き方 | すること | 使った |
|---|---|---|
| `todos.push(x)` | 最後に1つ足す | ✅ |
| `todos.filter(...)` | 条件に合うものだけの新しい配列を作る（1件ずつ質問して `true` だけ残す） | ✅ |
| `todos.unshift(x)` | 最初に1つ足す | |
| `todos.pop()` / `todos.shift()` | 最後 / 最初の1つを取り除く | |
| `todos.splice(番号, 個数)` | 途中から取り除く（`indexOf` が -1 だと最後が消える落とし穴） | |
| `todos.indexOf(x)` | 何番目か（ないと -1） | |
| `todos.find(...)` | 条件に合う最初の1つを取り出す | |
| `todos.map(...)` | 1つずつ変換した新しい配列を作る | |

## 4. 条件と繰り返し

```js
if (!todo.done) {
  // 未完了のとき
} else {
  // 完了のとき
}

for (const todo of todos) {
  console.log(todo.text);
}
```

| 書き方 | 意味 | 使った |
|---|---|---|
| `a === b` | 等しい（**`==` は型を勝手に変えるので使わない**） | |
| `a !== b` | 等しくない（オブジェクトは「同じものか」で比べる） | ✅ |
| `!x` | 反対にする（「〜ではない」） | ✅ |
| `a && b` / `a \|\| b` | かつ / または | |
| `for (const x of 配列)` | 1つずつ取り出して繰り返す | ✅ |

- まとまりは字下げではなく `{ }` で表す。条件は `( )` で囲む
- `{ }` の中で作った `const` / `let` は、その `{ }` の中でしか使えない（ブロックスコープ。Python と違う）
- `if` で偽として扱われる値（falsy）：`false`、`""`、`0`、`null`、`undefined`、`NaN`
- `;` は文の終わりにつける。`{ }` で終わる `if`・`for`・`function` のあとにはつけない

## 5. 関数

```js
function countRemaining(todos) {
  let count = 0;
  for (const todo of todos) {
    if (!todo.done) {
      count++;
    }
  }
  return count;
}

console.log(`残り ${countRemaining(todos)} 件`);
```

- **表示（`console.log`）と返す（`return`）は別物**。`console.log` も Python の `print()` も、画面に出すだけで値は返さない
- 数を1つ増やす：`count = count + 1;` → `count += 1;` → `count++;`
- アロー関数：`(t) => t !== todo`。`{ }` を書かないと、式の結果をそのまま返す
- **関数は `( )` で呼ぶ**。`classList.add = "..."` と `=` で書くと、関数を上書きするだけ
- 関数は作られた場所の変数を覚えている（クロージャ）
- オブジェクトや配列は、変数に入れても関数に渡してもコピーされず、同じものを指す
- `const` が禁止するのは入れ直しだけ。中身の変更（`push`、`todo.done = true`）はできる

### 文字列・数値
| 書き方 | 結果 | 使った |
|---|---|---|
| `"2026-10-10".split("-")` | `["2026", "10", "10"]` | ✅ |
| `Number("05")` | `5`（変換できないと `NaN`） | ✅ |
| `"2026-10-10".slice(5)` | `"10-10"` | |
| `"  牛乳 ".trim()` | `"牛乳"`（前後の空白を取る） | |

## 6. 名前のつけ方（言語ごとの慣習）

| 書き方 | 例 | 使う場所 |
|---|---|---|
| camelCase | `dueDate`、`countRemaining` | JS / TS の変数・関数・プロパティ |
| PascalCase | `TodoItem` | クラス、React の部品 |
| snake_case | `due_date` | Python、データベースの列名 |
| kebab-case | `delete-button` | CSS の class 名、URL、ファイル名 |
| UPPER_SNAKE | `MAX_LENGTH` | 変えない設定値 |

- 真偽値は `is〜`・`has〜` で始めると分かりやすい（`done` のような形容詞でもよい）
- 中身が分かる名前にする（`a` より `count`）

## 7. DOM（ブラウザの JS）

- ブラウザは HTML から DOM（メモリの中の要素の木）を作る。**JS が変えるのは DOM だけ**で、再読み込みで戻る
- `<head>` に `<script src="main.js" defer></script>`（`defer`：HTML を読み終えてから実行）。ほかに `</body>` の直前、`type="module"`

| 書き方 | すること | 使った |
|---|---|---|
| `document.querySelector("セレクタ")` | 最初の1つを探す（ないと `null`） | ✅ |
| `document.querySelectorAll("セレクタ")` | 全部を探す（一覧。`addEventListener` は持っていない） | |
| `document.getElementById("id")` | id で探す（`#` はつけない） | |
| `要素.querySelector(...)` | その要素の中だけを探す | ✅ |
| `document.createElement("li")` | 要素を作る（`document` だけが持つ） | ✅ |
| `親.append(子, "文字", ...)` / `親.prepend(...)` | 最後 / 最初に入れる | ✅ |
| `親.replaceChildren()` | 中身を全部消す | ✅ |
| `要素.remove()` | 自分を消す | |
| `el.textContent` | 中の文字（ユーザーの入力はこれで入れる） | ✅ |
| `el.innerHTML` | 中の HTML（**ユーザーの入力に使わない**。XSS） | |
| `el.classList.add / remove / toggle("done", 真偽値)` | class をつける・外す・切り替える | ✅ |
| `input.value` / `input.checked` | 入力欄の値 / チェックの状態 | ✅ |
| `form.reset()` | フォームの入力欄を空に戻す | ✅ |

### JS での属性名（HTML と違うもの）
| HTML | JS |
|---|---|
| `class` | `classList` / `className` |
| `datetime` | `dateTime` |
| `for` | `htmlFor` |

### id と class
| | id | class |
|---|---|---|
| ページの中で | 1つだけ | いくつでも |
| 1つの要素に | 1つ | いくつでも |
| 使いどころ | JS で1つを探す目印、`label` の `for` | 見た目（CSS）、同じものがたくさん、状態（`done`） |

## 8. イベント

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();   // もともとの動き（送信と再読み込み）を止める
});
```

- 登録した時点では実行されない。イベントが起きたとき**ブラウザが呼ぶ**
- イベントは要素にくっついている。要素を捨てるとイベントも消える。作り直されない要素に何度も登録すると重なる

| イベント | 起きるとき | 使った |
|---|---|---|
| `submit` | フォームが送信された | ✅ |
| `click` | クリックされた | ✅ |
| `change` | チェックや選択が変わった | ✅ |
| `input` | 1文字打つたび | |
| `keydown` | キーが押された（`event.key`） | |

| `event` の中身 | 意味 |
|---|---|
| `event.preventDefault()` | もともとの動きを止める |
| `event.target` | イベントが起きた要素 |
| `event.key` | 押されたキー |

## 9. エラーの読み方

`main.js:44 Uncaught TypeError: todos.append is not a function` → main.js の 44 行目で、`todos` が `append` という関数を持っていなかった

| エラー | 意味 | よくある原因 |
|---|---|---|
| `SyntaxError` | 文法の間違い（ファイル全体が動かない） | `,` `)` `}` の抜け |
| `ReferenceError: x is not defined` | 変数がない | つづり、`const` の書き忘れ、`{ }` の外から使った |
| `TypeError: x.y is not a function` | `y` という関数を持っていない | 関数名の間違い、違う種類のものに使った |
| `TypeError: Cannot read properties of null` | `null` から取り出そうとした | `querySelector` で見つからなかった |
