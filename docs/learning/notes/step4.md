# ステップ4：TypeScript（まとめ）

期間: 2026-10-09
ゴール: `main.js` を TypeScript（`main.ts`）に書き換え、型チェックを通してから JS に変換して動かす → 達成

早見表（紹介しただけで使っていない知識も含む）
- TypeScript・npm・tsconfig・エラーの読み方：[reference/typescript.md](../reference/typescript.md)

---

## 作ったもの

```
app/
├── package.json        使う道具の一覧（typescript）と scripts（"build": "tsc"）
├── package-lock.json   実際に入ったバージョン
├── tsconfig.json       tsc への指示書（src → public、strict）
├── node_modules/       道具の本体（git に入れない）
├── src/
│   └── main.ts         書くのはここ（public/main.js から git mv）
└── public/
    ├── index.html
    ├── style.css
    └── main.js         npm run build で作られる（git に入れない）
```

```
main.ts の形

type Todo = { text: string; deadline: string; done: boolean; };
let todos: Todo[] = [];

getElement<T>(selector): T      探す → なければ throw → 返す
const ul / todoInput / deadlineInput / form / remaining = getElement<...>(...)   最初に1回だけ探す

formatDeadline(deadline: string): string
createTodoElement(todo: Todo): HTMLLIElement
render(): void                  ul を作り直し、残り件数を String(...) で入れる
form の submit → todos.push(...) → form.reset() → render()
```

### このステップで決めたこと
| 番号 | 内容 |
|---|---|
| D-0011 | TS は `src/` に書いて `public/` に変換する。変換した `main.js` は git に入れない。`tsconfig.json` は手で書く |
| — | `null` かもしれない要素は `if` + `throw` で確かめる（`!` と `?.` は使わない）。`getElement<T>` にまとめる |
| — | `deadline` に `?` はつけない（入力欄からは空でも `""` が来る） |

---

## 4-1 TypeScript の役割と準備

```
main.ts ──①型チェック──▶ 間違いがあればエラー（報告するだけ）
        ──②変換───────▶ main.js（型を消しただけの JS）──▶ ブラウザで動く
```

- **型は実行するときには残らない**。役に立つのは書いているときとチェックするとき
- **`node hello.ts` は型を消して実行するだけで、チェックしない**。JS は型を気にせず代入でき、ないプロパティは `undefined` になるので、エラーにならずに動いてしまう
- 道具は npm で入れる。`package.json` は一覧表、`node_modules/` は本体。**作り直せるものは git に入れない**（`npm install` で入る）
- `package-lock.json` で全員がまったく同じバージョンを使える
- `npx` で `Need to install` が出たら `n`。外側のフォルダで実行して、npm から別物の `tsc` を取り寄せてしまった

## 4-2 型の基本

- 型は `: 型` で書く。**書くのは推論できないところだけ**（引数、戻り値、空の配列）
- `const todos: Todo[]` は「`todos` は `Todo[]` 型」。`[]` まで含めて1つの型（要素1つは `Todo`）
- `?` は「なくてもよい」。楽になるぶん、使う側で確かめる必要が出る。型は「データの説明書」なので事実に合わせる
- `practice/todo.js` を TS にしたら、ステップ3から残っていた `return a;` が見つかった（JS では最後の行まで来て初めて止まる）

## 4-3 tsconfig.json とフォルダ構成

- 書くファイル（`src/`）とブラウザに渡すファイル（`public/`）を分ける（D-0011）
- `git mv` で移動すると、名前が変わったと記録されて履歴がつながる
- **エラーがあっても `main.js` は作られる**（チェックと変換は別の仕事）。だから書き換えの途中でも画面は動いた
- `package.json` の `,` 抜けで `invalid package`。JSON は JS より厳しい

## 4-4 `main.ts` への書き換え

- エラー19個も、種類で分けると4つ（型の書き忘れ、null、`.value` がない、number を文字列の場所に）
- `querySelector` は `null` かもしれない（TS は HTML を読まない）。**型を書いても null の可能性は消えない。確かめる処理が必要**
- `if (!x) throw ...` の下では null ではなくなる（型の絞り込み）。`!` や `?.` だと、なかったときにステップ3の「何も起きず原因探し」に戻る
- id で探すと何の要素か分からない → `querySelector<HTMLInputElement>("#todo")`
- JS は数を `textContent` に入れると自動で文字列にしていた。TS では `String(...)` で明示する
- **同じことを何度も書いたら関数にまとめる**：`getElement<T>`。`querySelector` を2回呼ぶと、確かめたものと返すものが別になる。確かめるのは変数に入れたもの
- `"#todos"` のような文字列の間違いは TS でも分からない → 実行時に `throw` のメッセージで分かる

## 4-5 仕上げと技術の選択肢

- `app/` を push（`node_modules/` と `public/main.js` は入っていない）。README の使用技術を TypeScript に
- TS のメリット：ステップ3のつまずき（`time.datetime`、`button.class`、`classList.add = ...`、`todos.append`、`li.createElement`）は、TS なら書いた瞬間に分かる。ステップ5からはブラウザとサーバーで同じ `type Todo` を使える

| 分類 | 選択肢 | どんなときに |
|---|---|---|
| 型をつける | **TypeScript**（採用） | 今の主流 |
| | JSDoc | JS のままコメントで型。変換がいらない |
| | Flow | ほぼ使われない |
| 変換の道具 | **tsc**（採用） | チェックと変換の両方 |
| | esbuild / SWC | 型を消すだけで速い。チェックは tsc に任せる |
| | Vite | 開発用サーバー。保存で自動更新。React の定番 |
| 実行環境 | Node.js | `.ts` は型を消して実行（チェックなし） |
| | Deno / Bun | TS をそのまま動かせる |

- **React** を使うと、`render()` での作り直しや `getElement` で要素を探す処理を自分で書かなくてよくなる。React と TS の組み合わせ（`.tsx`）が今の定番

---

## つまずいたことと解決方法
| つまずき | 原因 | 解決 |
|---|---|---|
| `typescript` が書かれた場所を `node_modules/typescript/` と答えた | 本体の場所と一覧表を混同 | 一覧表は `package.json` の `devDependencies` |
| `.gitignore`・`tsconfig.json` の最後の改行が抜けた | ステップ0と同じ | 最後の行で Enter を押してから保存 |
| `npx tsc` で `Need to install ... tsc@2.0.4` に `y` | 外側のフォルダで実行して、別物のパッケージを取り寄せた | `cd app` してから実行。`Need to install` は `n` |
| `invalid package` | `package.json` の `,` 抜け | JSON は区切りの `,` が必須 |
| `: void` が見つからない | 書き足すものを「探すもの」と誤解 | 戻り値の型と同じ場所に書く |
| `form#todo` で `TS1005` | CSS のセレクタを JS にそのまま書いた | `#todo` は `querySelector("...")` の中だけ |
| null を確かめても直らない | 使った後に確かめていた | 探す → 確かめる → 使う の順 |
| `getElement` を作ってもエラー10個 | `querySelector` を2回呼び、`T` を使っていなかった | 変数に入れて確かめ、`querySelector<T>` と `: T` |
| `Cannot find name 'element'` / `'querySelector'` | `const` の抜け、`document.` の抜け | エラー文の「何が見つからないか」を読む |
| `Property 'reset' does not exist on type 'HTMLInputElement'` | `<form>` を `HTMLInputElement` にした | `HTMLFormElement` |

## 要復習
- `flex-basis: 100%` の役割（ステップ2から持ち越し）
- `;` の抜け、変数名の snake_case（`form_todo` → `todoInput`）
- コミットメッセージに「何が変わったか」を書く（`TypeScript 利用` → `main.js を TypeScript に書き換え、npm run build で JS を作る形にした`）
- `app/README.md` に `npm install` と `npm run build` を書く（ステップ5で）
- `tsc` は「検証して実行」ではなく「検証して**変換**」（理解度チェック Q1）
