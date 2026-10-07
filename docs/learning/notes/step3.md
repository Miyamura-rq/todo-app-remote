# ステップ3：JavaScript（まとめ）

期間: 2026-10-06 〜 2026-10-07
ゴール: 画面で ToDo を追加・完了・削除できる（再読み込みで消える）→ 達成

早見表（紹介しただけで使っていない知識も含む）
- JavaScript の書き方・DOM・イベント：[reference/javascript.md](../reference/javascript.md)

---

## 作ったもの

```
app/public/
├── index.html   <script src="main.js" defer> を追加、見本の <li> を削除
├── style.css    label でチェックボックスを包む形に合わせた
└── main.js      ToDo の追加・完了・削除・期限の表示・残り件数
```

```
main.js の形（D-0009：データから画面を作り直す）

let todos = [];                    ← 正しい情報はここだけ

formatDeadline(deadline)           "2026-10-10" → "10/10" を返す
createTodoElement(todo)            ToDo 1件から <li> を作って返す
  ├─ チェックの change → todo.done を書き換えて render()
  └─ 削除の click      → todos を filter で入れ直して render()
render()                           <ul> を空にして todos から作り直す。残り件数も書き換える

form の submit → preventDefault → todos.push(...) → form.reset() → render()
render()                           開いたときに1回
```

### このステップで決めたこと
| 番号 | 内容 |
|---|---|
| D-0009 | 画面は配列 `todos`（データ）から `render()` で作り直す（B）。チェックボックスは `<label>` で包む |
| D-0010 | 書き方の選択肢は、説明したうえで Claude がおすすめを決めて示す |
| — | 期限は文字列 `"2026-10-10"` で持つ（Date は使わない）。削除は `filter` で入れ直す |

---

## 3-1 JS の基本文法

`practice/return.js`、`practice/todo.js` で練習（Node.js で実行）。

- 変数は `const`（入れ直さない）と `let`（入れ直す）。**迷ったら `const`**
- **`const` が禁止するのは「入れ直し」だけ**。`todos.push(...)` や `todo.done = true` のように中身を変えるのは OK。削除で `todos = todos.filter(...)` と入れ直すので `let` にした
- **「表示」と「返す」は別物**。`return` のない関数は `undefined` を返す。`console.log` も Python の `print()` も、画面に出すだけで値は返さない
- `=` の右側は先に計算される。`const r1 = a(3);` の時点で `a` が実行される
- `"..."` で囲まないと式になる（`2026-10-10` は引き算で `2006`）
- 期限は文字列で持つ：入力欄も JSON も文字列。`Date` は「日時」で時差の問題がある。`年-月-日` の文字列なら大小比較で日付順になる
- データは「オブジェクトの配列」で表す。ToDo ごとに変数（`todo1`、`todo2`…）は作らない（何件になるか分からないため）
- 名前のつけ方は言語ごとに違う：JS は camelCase、CSS の class は kebab-case、Python と DB は snake_case

## 3-2 HTML と JS をつなぐ

- ブラウザは HTML を読んで、メモリの中に要素の木（**DOM**）を作る。Elements タブが見せているのはファイルではなく DOM
- **JS が変えるのは DOM だけ**。ファイルは変わらないので、再読み込みで戻る
- `<head>` に `<script src="main.js" defer>`。`defer` がないと、DOM ができる前に JS が動いて要素が見つからない
- `querySelector("CSS と同じセレクタ")` で探す。`console.log` は、Node.js ならターミナル、ブラウザなら開発者ツールの Console に出る
- **id と class**：id はページに1つ（フォーム、一覧、件数）、class はいくつでも（各 ToDo、削除ボタン、`done`）。見た目は class、JS で1つを探す目印は id がよくある分け方

## 3-3 イベント

- `要素.addEventListener("イベント名", 関数)`。**登録した時点では実行されない**。イベントが起きたときに**ブラウザが呼ぶ**
- `submit` では `event.preventDefault()` でフォームのもともとの動き（送信と再読み込み）を止める
- `input.value` で入力欄の値。期限は `"2026-10-10"` の文字列、空なら空文字 `""`（`undefined` とは別。`if` では偽＝falsy）
- `form` という変数は勝手にはできない。`const form = document.querySelector("form");` で探して入れる

## 3-4 ToDo の追加

- **作る**のは `document.createElement(...)`、**入れる**のは `親.append(...)`。別の作業
- ユーザーの入力は **`textContent`** で入れる。`innerHTML` だと入力が HTML として解釈され、JS が実行されてしまう（XSS。ステップ8）
- JS での属性名は HTML と違うことがある：`dateTime`、`classList.add(...)` / `className`、`htmlFor`
- **関数は `( )` で呼ぶ**。`classList.add = "..."`、`todos.append = {...}` のように `=` で書くと、関数を上書きするだけで何も起きない
- 配列に足すのは `push`、DOM に入れるのは `append`。種類が違うと持っている関数が違う（`TypeError: ... is not a function`）
- 1行もエラーなく動くかは Console で確かめる。**JS は文法の間違いが1か所あるとファイル全体が動かない**。実行中のエラーは、その行から下が動かない

### データから画面を作り直す（B）
```
データを変える（push / done を書き換える / filter）→ render() → 画面はデータを映したもの
```
- 画面だけ変えても、次の `render()` で元に戻る（チェックが外れた）
- ステップ5でサーバから配列を受け取ったら `render()` するだけで済む。React と同じ考え方

## 3-5 完了・削除・残り件数

- イベントは **`createTodoElement` の中で登録**する。そこでは `input` と `todo` が最初からペアになっている
- 関数は、作られた場所の変数を覚えている（**クロージャ**）。1件目の中で作った関数は1件目の `todo` を覚えている
- オブジェクトや配列は**コピーされず同じものを指す**。だから `todo.done = ...` で `todos` の中も変わる
- イベントは要素にくっついていて、`replaceChildren()` で要素と一緒に捨てられる。**作り直されない要素（form）には1回だけ登録**する（render の中に書くと重なる）
- 削除：`todos = todos.filter((t) => t !== todo);`。`filter` は1件ずつ質問して `true` のものだけ残した新しい配列を作る
- 残り件数：`todos.filter((todo) => !todo.done).length`

## 3-6 仕上げと技術の選択肢

- 期限：`formatDeadline` で `split("-")` と `Number(...)` を使って `10/10` に。期限がないときは `<time>` を作らない
- `{ }` の中で作った `const` / `let` は、その `{ }` の中でしか使えない（**ブロックスコープ**。Python と違う）
- 「作ったらすぐ入れる」順に書くと、画面の並びとコードの順番がそろって読みやすい

| 選択肢 | どんなものか |
|---|---|
| **素の JS**（採用） | 何も入れずに動く。仕組みの理解に必須 |
| TypeScript | JS に型を足したもの。変換して JS にする（ステップ4） |
| WebAssembly（Rust、C++ など） | 重い計算用。画面の操作は JS から |
| jQuery | 昔の主流。新規ではほぼ使わない |
| React / Vue / Svelte / Angular | データを変えると画面が自動で書き換わる。React が最も使われている |

- **選ぶ基準**：規模（画面と状態の多さ）、チームの経験、情報と部品の多さ、求人
- **React** は JS の代わりではなく、JS で書く**ライブラリ**（追加の道具）。自分で書いた `render()`・`createTodoElement` が、React では自動の書き換え・コンポーネントにあたる

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| 期限が `2006` になった | `2026-10-10` が引き算になった | `"2026-10-10"` と文字列にする |
| データの写し間違い（`done` が全部 `true`） | 問題文と見比べていなかった | 書いたら元の情報と照らし合わせる |
| Console に要素そのものが出た | `.value` の抜け | 入力欄の値は `input.value` |
| `li.createElement is not a function` | `createElement` は `document` だけが持つ | `document.createElement(...)` で作り、`append` で入れる |
| 削除ボタンが赤くならない | `classList.add = "..."`（関数を上書き） | `classList.add("...")` と `( )` で呼ぶ |
| `todos.append is not a function` | 配列に DOM の関数を使った | 配列は `push` |
| チェックしても取り消し線がつかない | `todos` を変えただけで `render()` していない | 「データを変える → render()」 |
| `checkbox.addEventListener is not a function` | `querySelectorAll` の結果（一覧）に登録しようとした。下の `render()` も止まった | 使わない行は消す。イベントは `createTodoElement` の中で |
| `NaN/NaN` | `Number("ymd[1]")`（変数を `" "` で囲んだ） | `Number(ymd[1])` |
| `time is not defined` | `if` の `{ }` の中で作った `time` を外で使った | `{ }` の中で `append` する |
| `;` の抜けが続いた | 書き終えたあと行末を見ていない | 書いたら行末を確かめる。`Shift + Option + F` で空白はそろう |

## 要復習
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- 関数を `=` で上書きしてしまう間違い（2回）。`〇〇.△△(...)` は関数、`=` は値を入れるとき
