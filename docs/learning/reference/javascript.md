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
| `todos.push(x)` | 最後に1つ足す | |
| `todos.filter(...)` | 条件に合うものだけの新しい配列を作る | |
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
| `a !== b` | 等しくない | |
| `!x` | 反対にする（「〜ではない」） | ✅ |
| `a && b` / `a \|\| b` | かつ / または | |
| `for (const x of 配列)` | 1つずつ取り出して繰り返す | ✅ |

- まとまりは字下げではなく `{ }` で表す。条件は `( )` で囲む
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
