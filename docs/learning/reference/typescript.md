# TypeScript と npm（早見表）

作成: 2026-10-09（ステップ4）
詳しく調べるとき: [TypeScript ハンドブック](https://www.typescriptlang.org/docs/handbook/intro.html)、[tsconfig の全設定](https://www.typescriptlang.org/tsconfig)

各表の「使った」欄の印：✅ = 練習または ToDo アプリで使った、空欄 = 紹介だけ（必要になったら使う）

---

## 1. npm（道具の取り寄せ係）

| コマンド | 意味 | 使った |
|---|---|---|
| `npm init -y` | `package.json` を作る（質問を全部「はい」で飛ばす） | ✅ |
| `npm install -D 名前` | 開発用の道具として入れる（`devDependencies` に書かれる） | ✅ |
| `npm install 名前` | 実行にも使う道具として入れる（`dependencies`。Express はこちら） | |
| `npm install` | `package.json` と `package-lock.json` を見て、全部入れ直す（clone した後） | |
| `npm ci` | `package-lock.json` どおりに、きっちり入れ直す（公開先や CI で使う） | |
| `npm run 名前` | `package.json` の `scripts` に書いたコマンドを実行 | ✅ |
| `npx 名前` | `node_modules/.bin/` にある道具を実行する | ✅ |

| ファイル | 中身 | git に入れるか |
|---|---|---|
| `package.json` | 使う道具の一覧表、scripts | 入れる |
| `package-lock.json` | 実際に入った正確なバージョン | 入れる |
| `node_modules/` | 道具の本体（`npm install` で作り直せる。OS ごとに中身が違うこともある） | **入れない** |

- `"typescript": "^7.0.2"` の `^` は「7.x.x の中で 7.0.2 以上」。`~7.0.2` は「7.0.x の中で」
- **`npx` で `Need to install the following packages` が出たら `n` で止める**。入れたはずの道具が見つかっていない合図（たいていフォルダ違い）。npm には有名な名前に似せた悪意のあるパッケージもある（タイポスクワッティング）
- `bin` = 実行できるプログラムを置く場所（`/usr/local/bin`、`node_modules/.bin`）。ほかに `src`（書くコード）、`dist` / `build`（出来上がったもの）、`lib`（ライブラリ）

## 2. JSON（`package.json` などの書き方）

| 規則 | JS のオブジェクト | JSON |
|---|---|---|
| キー | `{ text: "牛乳" }` | `{ "text": "牛乳" }`（必ず `"`） |
| 文字列 | `'...'` も `"..."` も | `"..."` だけ |
| 区切りの `,` | 最後に `,` があっても OK | **間の `,` が抜けても、最後に `,` があってもエラー** |
| コメント | 書ける | 書けない（`tsconfig.json` だけは特別に書ける） |
| 値 | 何でも | 文字列・数・true / false・null・配列・オブジェクトだけ |

## 3. 型の書き方

| 書き方 | 意味 | 使った |
|---|---|---|
| `let count = 0;` | 書かなくても値から `number` と分かる（**型推論**） | ✅ |
| `let todos: Todo[] = [];` | 空の配列は中身が分からないので書く | ✅ |
| `function f(n: number): string { }` | 引数は必ず書く。戻り値も書くのがおすすめ | ✅ |
| `function render(): void { }` | 何も返さない | ✅ |
| `string` / `number` / `boolean` | 基本の型 | ✅ |
| `string[]`、`Todo[]` | 配列。`[]` まで含めて1つの型 | ✅ |
| `type Todo = { text: string; done: boolean; };` | オブジェクトの形に名前をつける。名前は PascalCase | ✅ |
| `memo?: string` | あってもなくてもよい。型は `string \| undefined` になり、使う側で確かめる必要がある | ✅（練習） |
| `string \| null` | どちらか（ユニオン型） | ✅ |
| `interface Todo { text: string; }` | `type` とほぼ同じ。どちらでもよい。チームで決める | |
| `"todo" \| "done"` | 決まった文字列だけ（リテラル型） | |
| `any` | 何でもよい。**チェックが止まるので使わない** | |
| `unknown` | 何か分からない。使う前に確かめる必要がある（`any` の安全版。ステップ5で受け取るデータなど） | |
| `function f<T>(...): T` | 呼ぶ人が `< >` で型を指定できる（ジェネリクス） | ✅ |

### 型を書く場所
- まず何も書かずに `tsc` を実行し、`implicitly has an 'any' type` と言われた場所に書く
- ほぼ決まっている：**関数の引数と戻り値、空の配列、データの形（`type`）**。それ以外は書かない

## 4. DOM の型

| 要素 | 型 | 使った |
|---|---|---|
| `<li>` / `<ul>` | `HTMLLIElement` / `HTMLUListElement` | ✅ |
| `<input>` / `<form>` | `HTMLInputElement` / `HTMLFormElement` | ✅ |
| `<span>` | `HTMLSpanElement` | ✅ |
| `<button>` / `<time>` | `HTMLButtonElement` / `HTMLTimeElement` | |
| 何でもよい | `HTMLElement`（HTML の要素）、`Element`（SVG なども含む） | ✅ |

- `querySelector("ul")`（タグ名）→ `HTMLUListElement | null`。`querySelector("#todo")`（id）→ `Element | null`（何の要素か分からない）
- `querySelector<HTMLInputElement>("#todo")` で何の要素かを教える
- TS は `index.html` を読まないので、見つかるかどうかは分からない → `null` かもしれない

### `null` かもしれない値の扱い

| 書き方 | 意味 | 採用 |
|---|---|---|
| `if (!ul) { throw new Error("ul が見つかりません"); }` | なければ原因つきで止まる。この下では `null` ではない（**型の絞り込み**） | ✅ |
| `document.querySelector("ul")!` | 「絶対ある」と約束してチェックを黙らせる。なかったときに分かりにくいエラー | |
| `ul?.replaceChildren()` | `null` なら何もしない。なかったときに何も起きず気づけない | |
| `ul ?? 代わりの値` | `null` / `undefined` のときだけ右を使う | |
| `x as HTMLInputElement` | 「この型だと思って」と言い切る。間違っていてもチェックされない | |

- 関数の外の `if` で確かめた変数も、`function` の中では「null かも」に戻る（いつ呼ばれるか分からないため）→ `getElement<T>` のように、確かめて返す関数にまとめる

## 5. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2022", "dom"],
    "rootDir": "src",
    "outDir": "public",
    "strict": true
  },
  "include": ["src"]
}
```

| 設定 | 意味 | 使った |
|---|---|---|
| `target` | どの年の JS に変換するか | ✅ |
| `lib` | 使える機能。`dom` で `document` などの型が使える | ✅ |
| `rootDir` / `outDir` | 元の場所 / 出力先 | ✅ |
| `strict` | 厳しくチェック（`any` が勝手に入るのを禁止など）。**必ず `true`** | ✅ |
| `include` | チェックするファイルの範囲 | ✅ |
| `noEmitOnError` | エラーがあると JS を作らない（既定は作る） | |
| `noUnusedLocals` / `noUnusedParameters` | 使っていない変数・引数をエラーにする | |
| `noUncheckedIndexedAccess` | `ymd[1]` のような配列の要素を「ないかも（undefined）」として扱う | |
| `module` | `import` / `export` をどう変換するか（ステップ5の Node.js 側で使う） | |
| `sourceMap` | 開発者ツールで `.ts` のまま行を追えるようにする | |

- `npx tsc --init` は Node.js 向けの設定（`module: nodenext` など）になるので、ブラウザ用には手で書いた

## 6. コマンドとエラーの読み方

| コマンド | 意味 | 使った |
|---|---|---|
| `npx tsc` / `npm run build` | `tsconfig.json` を読んでチェックと変換 | ✅ |
| `npx tsc --noEmit ファイル` | チェックだけ（JS を作らない） | ✅ |
| `npx tsc --watch` | 保存するたびに自動で変換 | |
| `node ファイル.ts` | 型を消して実行（**チェックしない**） | ✅ |

```
src/main.ts(67,5): error TS18047: 'ul' is possibly 'null'.
  ファイル  行,列        番号     内容
```

| よく出るエラー | 意味 |
|---|---|
| TS1005 `')' expected` など | 文法のエラー。これがあると型のエラーが隠れる。最初に直す |
| TS2304 `Cannot find name 'x'` | その名前がない（`const` の抜け、つづり、`document.` の抜け） |
| TS2322 `Type 'A' is not assignable to type 'B'` | B の場所に A を入れようとした |
| TS2339 `Property 'x' does not exist on type 'Y'` | Y は x を持っていない |
| TS2551 `... Did you mean 'y'?` | つづり違いの提案。**提案はヒント程度に**（`onreset` のような勘違いもある） |
| TS7006 / 7034 / 7005 `implicitly has an 'any' type` | 型が分からない。引数などに型を書く |
| TS18047 `'x' is possibly 'null'` | `null` かもしれない。確かめてから使う |

- エラーが出た場所に原因があるとは限らない（`getElement` の戻り値の型が原因で、使う側の10か所でエラーになった）。VS Code で名前にマウスを乗せて型を見る
