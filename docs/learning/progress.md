# 学習状況

段階：未着手 → 学習中 → 説明できる → 一人でできる
「説明できる」以上は、セッション終わりの理解度チェックで判断する（D-0002）。

## ステップ0：道具の準備
まとめ：[notes/step0.md](notes/step0.md)

| 項目 | 段階 | メモ |
|---|---|---|
| ターミナルの基本操作（cd / ls / pwd / cat） | 学習中 | 0-1 完了（2026-10-01）。隠しファイル、.gitignore の役割まで理解。理解度チェックはまだ |
| VS Code でプロジェクトを開く | 学習中 | 0-2 完了（2026-10-01）。`code .` の登録（PATH）を自分で解決。VS Code が .git を隠す理由まで理解。理解度チェックはまだ |
| git で変更を記録する（add / commit / log） | 学習中 | 0-3 完了（2026-10-01）。untracked と modified の違い、diff の +/-、--amend、コミット ID がハッシュであること、commit は .git に保存されることまで理解。Vim の操作でつまずいた。課題：①コミットメッセージに「何をしたか」を書く（「小修正」になりがち）②ステージがある理由 ③.git を親へたどって探す仕組み。②③は 2026-10-06 の振り返りで説明できた（最初に見つかった .git で止まる点は補足） |
| GitHub に push する（commit と push の違い） | 説明できる | 0-4 完了（2026-10-01）。SSH 鍵の仕組み、remote（fetch / push）、app/ を別リポジトリにして push（D-0004）。.gitignore を共有する理由まで理解。ファイル末尾の改行・保存忘れでつまずいた。commit と push の違いは理解度チェックで説明できた |
| Node.js で JavaScript を動かす | 学習中 | 0-5 完了（2026-10-01）。公式インストーラーで v24（LTS）を導入、/usr/local/bin（PATH）に入ることを確認。対話モードと `node ファイル名` で実行。SyntaxError を読んで自分で修正。`"` と `` ` `` の違いは説明できた。「表示」と「返す（戻り値）」の違いは要復習（ステップ3で再確認） |

## ステップ1：Web の仕組み
まとめ：[notes/step1.md](notes/step1.md)

| 項目 | 段階 | メモ |
|---|---|---|
| 1-1 クライアントとサーバー | 説明できる | 2026-10-06。リクエスト／レスポンスの流れ（ブラウザ→Express→PostgreSQL）、再読み込みで消える理由（ページのメモリにしかない）を説明できた。ブラウザが DB と直接話さない理由（門番）は補足 |
| 1-2 URL と DNS | 説明できる | 2026-10-06。`nslookup` で IP を確認。localhost を「Wi-Fi の IP」と予想 → `ping` と `ipconfig getifaddr en0` で比べて「PC 内部」と自分で気づいた |
| 1-3 HTTP のリクエストとレスポンス（メソッド、ステータスコード） | 説明できる | 2026-10-06。4xx / 5xx の違いを理由つきで説明できた。番号は大まか（404・201 は補足）。問題文の読み違い（削除を PATCH と回答）あり |
| 1-4 開発者ツールで通信を見る | 説明できる | 2026-10-06。Network タブで Method / Status / Content-Type を読み取り、404 も自分で確認。github.com で約350リクエスト |
| 1-5 フロントエンドとバックエンドの役割分担 | 学習中 | 2026-10-06。他の選択肢（WebSocket、REST と GraphQL）を説明。通話アプリ（WebSocket と WebRTC）の質問あり。REST のパス（`POST /todos`）はヒント1段階で答えた |

## ステップ2：HTML / CSS
まとめ：[notes/step2.md](notes/step2.md)
ゴール：ToDo の画面（見た目だけ）を作り、GitHub に push する
早見表：[reference/html.md](reference/html.md)、[reference/css.md](reference/css.md)、デザインの値：[reference/design.md](reference/design.md)

| 項目 | 段階 | メモ |
|---|---|---|
| 2-1 HTML の基本（タグ・要素・属性・入れ子、head と body） | 説明できる | 2026-10-06。`practice/hello.html` を作成。`<p>` の中に `<ul>` を入れ、Elements タブで「ブラウザが `<p>` を閉じた」ことに自分で気づいた（入れられる要素が決まっている）。meta charset を消しても表示が変わらず「既定が UTF-8」と予想 → ブラウザの推測と、ヘッダー／meta の2つの伝え方を補足。`<hooter>` の誤字（HTML はエラーを出さない）。タグ・要素・属性を説明できた |
| 2-2 ToDo 画面の骨組み（見出し・フォーム・リスト、意味に合ったタグを選ぶ） | 説明できる | 2026-10-06。`app/public/index.html` を作成。header / main / footer、form（label・placeholder・required・maxlength・name）、ul / li、checkbox、time。期限の入力欄を自分で追加（D-0006）。表かリストか・完了で消すか残すかを比べて決めた（D-0008）。`<form>` で囲む理由（Enter で送信、required が働く）と、ul を選ぶ理由（順番に意味がない）を説明できた。`lang="jp"`、`<header>` の位置、ラベルに `id` をつけて `id` が重なる間違い（`id` = 指される側、`for` = 指す側）でつまずき、ヒント3で解決 |
| 2-3 CSS の基本（読み込み方、セレクタ、class、開発者ツールの Elements） | 説明できる | 2026-10-06。`app/public/style.css` を作成し `<link>` で読み込み。配色は黒＋ティールを2案から選んだ（design.md）。要素・子孫（`header h1`、`.done label`）・class・`:hover` を使用。class 名を状態で決める理由（`done`）と、Styles 欄の変更が再読み込みで戻る理由（ファイルは変わっておらず、読み直すと戻る）を説明できた。つづりの間違い（`font-coler`、`delete-bottun` → `buttun`）が続いた → CSS はエラーを出さないので、Styles 欄の ⚠ と VS Code の波線で確かめる |
| 2-4 レイアウト（ボックスモデル、Flexbox） | 説明できる | 2026-10-06。Computed タブで箱を確認し、余白がブラウザの初期設定だと自分で答えた。`box-sizing`、`max-width` + `margin: 0 auto`、Flexbox（form の横並び、ul の縦並び、li のカード）、`font: inherit`、`color-scheme`、`accent-color`、メディアクエリでスマホ時に2行へ折り返し（配置は自分で考えた）。スマホでの問題（ToDo 入力欄が 57px）は自分では気づかず、指摘で理解。`#` の抜け（`8FA59F`）と保存忘れあり。CSS の階層構造（入れ子）について質問あり。理解度チェック：右寄せの仕組み（label の `flex: 1`）は説明できた（親の `display: flex` は補足）。スマホの折り返しは `@media` と `flex-wrap` まで（`flex-basis: 100%` は要復習） |
| 2-5 仕上げと push、技術の選択肢（CSS フレームワークなど） | 学習中 | 2026-10-06。`app/` を push（コミットメッセージは「何ができるようになったか」を書くよう提案）。README の修正はステップ5でまとめてやると学習者が判断。Sass・Bootstrap・Tailwind・CSS Modules・テンプレートエンジン・React / Vue / Svelte と選ぶ基準を説明。React について質問あり（ステップ3・4のあとで再紹介） |

## ステップ3：JavaScript
まとめ：[notes/step3.md](notes/step3.md)
ゴール：画面で ToDo を追加・完了・削除できる（再読み込みで消える）
早見表：[reference/javascript.md](reference/javascript.md)

| 項目 | 段階 | メモ |
|---|---|---|
| 3-1 JS の基本文法（変数、型、配列・オブジェクト、if、for、関数、戻り値） | 説明できる | 2026-10-06。`practice/return.js`・`todo.js` を作成。「表示」と「返す」の違いを説明できた（return がないと undefined、print() も同じ）。`const r1 = a(3)` で a が実行される理由（右辺が先に評価される）は補足。期限を `2026-10-10` と書いて引き算になり、ヒント1で文字列に直した（Date ではなく文字列で持つ理由を説明）。done の値の写し間違い、todo1〜3 の変数を作る書き方（→ 配列に直接書く）を指摘で修正。`countRemaining` は手順のヒント1で自力で書けた。変数名 `a` は要改善 |
| 3-2 HTML と JS をつなぐ（`<script>` と `defer`、DOM、`querySelector`） | 説明できる | 2026-10-07。`app/public/main.js` を作成し `defer` で読み込み。Console で `textContent` を書き換え、画面・Elements は変わるがファイルは変わらず再読み込みで戻ることを確認（2-1・2-3 の体験と DOM をつなげた）。id と class の違いを質問 → 「ページに1つか、いくつもあるか」で説明。チェックボックスに id を使う理由（label と1対1）は答えられた。`console.log` がどこに出るか質問（ブラウザと Node.js の違い）。`;` の抜けが続く |
| 3-3 イベント（`addEventListener`、`submit` と `preventDefault`、入力値の取り出し） | 説明できる | 2026-10-07。`form` が勝手に探されると誤解 → `const form = document.querySelector("form")` を自分で思いついた。`form.querySelector` でフォーム内を探す書き方を自分で選んだ。`.value` の抜けはヒント1で修正。期限は `"2026-10-10"` の文字列。空の期限を「何も出ない」と答えた（実際は空文字 `""`）。`preventDefault` を消すと再読み込みされることを確認 |
| 3-4 ToDo の追加（`createElement` / `textContent`、`innerHTML` の危険、データから画面を作る） | 説明できる | 2026-10-07。B（配列 `todos` から `render()` で作り直す）を選択、label で包む形にした（D-0009）。`createTodoElement(todo)` で `<li>` を作って返す。つまずき：`li.createElement`（document だけが持つ）、組み立て（append）忘れ、`time.datetime`・`button.class`（JS の属性名）、`classList.add = ...` と `todos.append = ...`（関数を `=` で上書き。2回）、配列に `append`（→ `push`）。`textContent` のあと `prepend` で入れる工夫は自分で考えた。`done` の処理は `toggle` と `checked = todo.done` の短い書き方を選んだ。Console のエラー文を読んで原因を探す練習をした。再読み込みで消える理由は「DOM にしか記録されていない」（todos 配列もページのメモリにある、は補足）。期限の `10/10` 表示は 3-6 に回した |
| 3-5 完了・削除・残り件数 | 説明できる | 2026-10-07。チェックが画面だけ変わり `todos` が変わらないことに自分で気づいた。`querySelectorAll` で全チェックボックスを監視する方向で止まり → ヒント2で `createTodoElement` の中で登録（クロージャ、オブジェクトはコピーされず同じものを指す）。質問：イベントは勝手に実行されるのか（→ 関数が2つ、ブラウザが呼ぶ）、render のたびにイベントをリセットしないのか（→ 要素と一緒に捨てられる、消えない要素に登録すると重なる）、`event` はどこで使うか、`push` するなら `let` か（→ const は入れ直しの禁止で、中身の変更はできる）。削除は `filter` で入れ直す（D-0010 で Claude が決定）。`filter` の条件の仕組みを質問 |
| 3-6 仕上げと push、技術の選択肢（jQuery / React / Vue、WebAssembly） | 学習中 | 2026-10-07。`formatDeadline` で `10/10` 表示。`Number("ymd[1]")` で NaN、`const` 抜け、`if` を2つに分けて `time is not defined`（ブロックスコープ）。「作ったらすぐ入れる」順に直した。`app/` を push（メッセージは `js作成` → 次は「できるようになったこと」を書く）。README に JavaScript を追加。選択肢（TypeScript、WebAssembly、jQuery、React など）を説明。「React は JS の代わり？」と質問 |

## ステップ4：TypeScript
まとめ：[notes/step4.md](notes/step4.md)
ゴール：`main.js` を TypeScript（`main.ts`）に書き換え、型チェックを通してから JS に変換して動かす（動きはステップ3と同じ）
早見表：[reference/typescript.md](reference/typescript.md)

| 項目 | 段階 | メモ |
|---|---|---|
| 4-1 TypeScript の役割と準備（型チェックと変換、npm と package.json、`tsc`、Node.js で .ts を動かす） | 学習中 | 2026-10-09。`app/` で `npm init -y` と `npm install -D typescript`（7.0.2）。`typescript` が書かれた場所を `node_modules/typescript/` と答えた（→ `package.json` の `devDependencies`）。`node_modules/` を push しない理由を「開発用だから」と答えた → ヒント1で「`package.json` があれば `npm install` で同じものが入る」と説明できた。`package-lock.json` は補足。`.gitignore` の最後の改行が抜けた（ステップ0と同じ）。`bin`・JSON と JS の関係を質問。`practice/hello.ts` で `node` は「3行目でエラー」と予想 → `undefined` が出て終わる。JS は型を気にせず代入でき、ないプロパティは undefined になると自分で説明できた。`tsc` のエラー2つは予想どおり |
| 4-2 型の基本（型注釈と型推論、配列・オブジェクト、`type`、関数の引数と戻り値、`|` と `?`） | 学習中 | 2026-10-09。`practice/todo.js` を `todo.ts` にコピーして `tsc` → ステップ3から残っていた `return a;`（変数名を変えた残り）を発見。`type Todo`、`Todo[]`、引数・戻り値の型を自力で書けた。`let count: number = 0` は推論で不要、`type` の後の `;` 抜けを指摘。`const x: Todo[]` を「要素が Todo」と読んで迷った → 「`Todo[]` 全体で1つの型」と説明。`?` の有無でエラーが変わることを自分で説明できた。外側のフォルダで `npx tsc` を実行し、npm から別物の `tsc` パッケージを `y` で取り寄せた → `Need to install` が出たら `n` で止め、今いるフォルダを確かめる（タイポスクワッティング） |
| 4-3 tsconfig.json とフォルダ構成（`src/` から `public/` へ変換、`strict`、変換したファイルを git に入れるか） | 説明できる | 2026-10-09。A（`src/main.ts` → `public/main.js`、`public/main.js` は git に入れない）を Claude がおすすめ（D-0010）。`git mv` で移動、`tsconfig.json` を手で作成、`npm run build`。`package.json` の `,` 抜けで `invalid package` → ヒント1で修正（JSON の規則）。「エラーがあると main.js は作られない」と予想 → 19 errors でも作られた（チェックと変換は別。`noEmitOnError` は補足）。`tsconfig.json` の最後の改行抜け |
| 4-4 `main.ts` への書き換え（`Todo` 型、DOM の型、`null` かもしれない値、型エラーを読んで直す） | 説明できる | 2026-10-09。エラー19個を4種類に分けて対応。①型の書き忘れは自力で直せた（`deadline?` の `?` と `: void` は3回目の指摘で直った。`: void` を「探すもの」と誤解）。「TS のメリットが分かりにくい」「どこに型を書くか分かりにくい」と率直な感想 → ステップ3のつまずき6つが TS なら書いた瞬間に分かると説明、型は `tsc` に言われた場所に書けばよいと説明。②`null` は案A（`if` + `throw`）を Claude がおすすめ（D-0010）。`!`・`?.` は却下。`form#todo` と書いて文法エラー、使った後に確かめる順番の間違い → ヒントで修正。③`querySelector<HTMLInputElement>` を使えた。④件数は `Number` の逆でヒント1から `String(...)`。「querySelector の修正がだるい」→ `getElement<T>`（ジェネリクス）にまとめ、要素はファイルの最初で1回探す形に。`querySelector` を2回呼ぶ・`T` を使わない（ヒント2）、`const` 抜け・`document.` 抜けはエラー文から修正。エラー0、ブラウザで動作確認、`#todos` にすると Console に「#todos が見つかりません」と出ることを確認。変数名に snake_case（`form_todo`）、`;` 抜けが続く |
| 4-5 仕上げと push、技術の選択肢（JSDoc、esbuild / Vite、Deno / Bun、React の再紹介） | 学習中 | 2026-10-09。`app/` を push（`node_modules/` と `public/main.js` が入っていないことを確認、`git mv` で履歴がつながった）。README の使用技術を TypeScript に。`npm install` / `npm run build` は未記載（ステップ5で）。コミットメッセージは `TypeScript 利用`（`js作成` より改善。「何が変わったか」まではまだ）。選択肢（JSDoc、esbuild / SWC、Vite、Deno / Bun）と React の再紹介を説明 |

## ステップ5：サーバー（Node.js + Express）
まとめ：[notes/step5.md](notes/step5.md)
ゴール：Express のサーバーから画面を配信し、ToDo の追加・完了・削除を API 経由で行う（再読み込みしても消えない。サーバーを止めると消える）
早見表：[reference/server.md](reference/server.md)

| 項目 | 段階 | メモ |
|---|---|---|
| 5-1 サーバーを立てる（Express の導入、`listen` とポート、サーバー用の TS をどこに置き・どう動かすか） | 学習中 | 2026-10-13。構成は A（client → public、server → dist、tsconfig を2つ）に決定（D-0015）。`git mv`・`git rm`・tsconfig 2つ・インストールまで自分で実施。`-D` の有無の理由は説明できた（実行時に使うかどうか）。`@types/` とは何かを質問（→ JS のライブラリにあとから型をつける `.d.ts`）。`@types/node` が v26 で入っていた → Node.js に合わせて `@24` に。`server.ts` は「全くわからない」→ 部品ごと（import / `express()` / `app.get` / `app.listen`）と、ステップ3の `addEventListener`・`createElement`・`filter` との対応で説明。質問：`express()` とは、`req` / `res` はどこから来るのか、ブラウザは何を渡せるのか、`.get` と `"/"`、`listen` の引数。`req: Request, res: Response` と書いて4エラー（`fetch` 用の別の型）→ ヒント2で型注釈を消して解決。起動してブラウザに表示、`console.log` はターミナルに出る、`req.query` で `{ sort: "date" }`、`/abc` は `Cannot GET /abc`（手順書にないので関数が呼ばれない）、止めると接続拒否、を確認。404（返事がある）と接続拒否（返事がない）の違いを説明。コミットは日本語入力が混ざって失敗 → やり直して `local server` |
| 5-2 画面を配信する（`express.static` で `public/` を配信、起動コマンド `npm start` を決める） | 学習中 | 2026-10-13。`app.use(express.static("public"))` を追加。scripts は B（`start` = `node dist/server.js`、`dev` = build + start）を Claude がおすすめ（D-0010）。static を前に書くと `app.get("/")` が呼ばれない（手順書を上から見て、最初に返事をしたところで終わり）を確認し、`app.get("/")` を削除。Network で 304 → キャッシュを説明。再読み込みで消える理由を「public が改めて引っ張られるから」と回答 → 半分正解（main.js が最初から実行し直される。本当の原因は ToDo がサーバーに送られていないこと） |
| 5-3 API を作る（REST のパス設計、JSON、`id` をつける理由、GET / POST / PATCH / DELETE、ステータスコード、curl と開発者ツールで確かめる） | 学習中 | 2026-10-13。表の設計：GET は正解、POST に `/n`、PATCH・DELETE に `/n` なしと逆に → ヒント1（すでにある1つを指すか）で正解。ステータスコード（201・204）は答えを教えた。id が要る理由の質問には答えず → Claude が説明（理解度チェックで再確認）。GET・POST の実装：パスを `"` なしで書き正規表現のエラー、`res.json(/api/todos)`（パスを渡せば中身が返ると誤解）、`const nextId` に `++`。「`res.json` に何を入れるか伝わらない」「`/api` はそっちが決めたものだから説明すべき」「`+1` の書き方もないのか」と指摘 → パスは目印の文字列で変数とつながっていない、`res.json` には届けたいデータを渡す、数の `+1` は必ず入れ直し、と説明。次に `res.json("todos")`（文字と変数の区別）→ 修正。POST はヒント2で「作る → 入れる → 返す」に分けて完成。裏で動いていた 5-1 の古いサーバーで 404 → `lsof` と `kill` で止めて解決。POST できた。起動し直すと配列が消えることを確認。PATCH・DELETE：`:id`、`req.params.id` は文字列、`find`、404 で `return` を説明。1回目は `find` の条件が `=`（入れる）、`todo.id = req.body.done`、203、2つ目も `app.patch`、DELETE で返事なし、`const todo: Todo = find(...)` で型エラー → 「`if (!todo)` で書いてないか？」と質問 → `tsc` は1行ずつ見る、型を書かなければ `if` + `return` で絞り込まれる（4-4 の `getElement` と同じ）と説明。DELETE を `res.json(todo)` → 表に合わせて 204 に。`res.status(203)` だけで送っていない → `.end()` で送ると説明。完成し、curl で確認 |
| 5-4 画面から API を呼ぶ（`fetch`、非同期と `async` / `await`、データの持ち主がサーバーに移る） | 説明できる | 2026-10-13。「API は配布したキーで変更を加えることだと思っていた」→ プログラムから使う窓口、API キーは外部の API で誰かを見分ける合言葉、と説明。画面の更新は A（操作のたびに GET で取り直す）を Claude がおすすめ（D-0010）。「新しいものは必要な情報をそちらで提供して」→ 書き方の型を先に示す（D-0016）。`loadTodos` は型どおりに書けた。`Todo` に `id` を足すと submit の `push` で型エラー（直す場所を `tsc` が教える）。API 呼び出しを `postTodo` / `changeDone` / `deleteTodo` に自分で分けた。つまずき：`chengeDone` のつづり、`todoInput` に `.value` 抜け（3-3 と同じ）、`res.ok` の確認なし、`loadTodos()` の `await` 抜け、不要な `render()`。サーバーを止めたまま curl して接続できず → 番号が返らない＝止まっている、curl は別のターミナルで、と説明。`await` なしの `fetch` の結果（`Promise {<pending>}`）は Claude が説明。完成し、画面から追加した ToDo がサーバーに届いていることを確認 |
| 5-5 仕上げと push、README の起動方法、技術の選択肢（Fastify / Hono / NestJS、Python・Go・Ruby などの他言語、GraphQL / tRPC） | 学習中 | 2026-10-14。README に起動方法を書いた。1回目は `npm start` だけ（clone 直後は `dist/` がない）、`・` の箇条書き、末尾の改行なし → ヒント1で `npm run build` を足したが `mkdir ./dist &&` つき（2回目から失敗）→ 2行の `npm run build` → `npm start` に。push は学習者のターミナルからは成功（SSH の問題は Claude の実行環境だけ）。コミット `RAEDME変更` に main.ts も入っていた → 目的ごとに分ける。選択肢（Fastify・Hono・NestJS、他言語、GraphQL・tRPC、BaaS、Next.js）を説明。React + Next.js の実際の使われ方と TS が標準かを質問 |

## ステップ6：データベース（PostgreSQL）
まとめ：[notes/step6.md](notes/step6.md)
早見表：[reference/database.md](reference/database.md)
ゴール：ToDo を PostgreSQL に保存し、サーバーを止めても消えないようにする（API と画面は変えない）

| 項目 | 段階 | メモ |
|---|---|---|
| 6-1 データベースの役割と導入（ファイルではなく DB に保存する理由、テーブル・行・列、PostgreSQL を入れる、`psql` でつなぐ） | 説明できる | 2026-10-14。導入は A（Postgres.app）を Claude がおすすめ（D-0010）。PostgreSQL 18.6。`/etc/paths.d/` で PATH 登録（sudo のパスワードを1回打ち間違い）。`\l` で4つのデータベース（ユーザー名と同じ `recerqa`、`postgres`、`template0/1`）、`\conninfo` でソケット・5432・パスワードなし・Superuser を確認。`\l` のページャー `(END)` は `q` で抜けると説明。`\q` のあと zsh に `\conninfo` を打った → 行頭の表示で相手を見分ける。Stop して `psql` → ソケットのファイルがなく `No such file or directory`（ステップ5の接続拒否と同じ「相手がいない」）。予想は未回答 |
| 6-2 SQL の基本（`CREATE TABLE` と列の型、主キー、`INSERT` / `SELECT` / `UPDATE` / `DELETE`、`WHERE`、`ORDER BY`）を `psql` で手で打つ | 学習中 | 2026-10-14。`todo_app` を作成。`CREATE TABLE todos`：text（TEXT NOT NULL）・deadline（DATE、NULL 可）・done（BOOLEAN NOT NULL DEFAULT false）は自力で正解。id は1回目 `INTEGER NOT NULL` だけ（自動の番号と主キーが抜け）→ ヒント1。2回目は `GENERATED` 抜けの文法エラーを2回（`^` の直前に足りないものがある、と説明）→ 完成。後半（INSERT / SELECT / UPDATE / DELETE / ORDER BY）は「だいたい予想どおり」。開き直した `psql` が `recerqa` につながり、`\c todo_app` せずに同じテーブルをもう1つ作ってそこで練習していた（→ `psql todo_app`、行頭で箱を見分ける）。消した id は使い回されない（4 になった）、NULL は昇順で最後。`WHERE` なしの `UPDATE` も実際に打って全件 true に → 先に同じ WHERE で SELECT、件数を見る、と説明 |
| 6-3 Node.js から DB につなぐ（`pg` ライブラリ、接続情報を環境変数に置いて git に入れない、`await` でクエリを送る） | 学習中 | 2026-10-14。`pg` と Node.js の `--env-file` を Claude がおすすめ（D-0010）。`-D` の分け方は正解。「`"SQL の文"` とは何か」「`SELECT NOW()` が返すものの型を教えてもらえないと分かるわけない」と指摘 → `result` の形（`rows` は配列、キーは列名、`timestamptz` は `Date`）を先に示すべきだった（D-0016）。1回目：VS Code の自動 import（`get` from "http"）、import が途中、`Pool` を作ってから確かめる順番（4-4 と同じ）、`async` 抜け、`res.result`。2回目：`result.rows[0].now`（値だけ）→ 仕様の `{"now":...}` に合わせて `rows[0]`。`.gitignore` の `.env.*` が `.env.example` も隠す → `!.env.example`。`git status` の `Untracked files:` を `??` と結びつけられなかった（Claude の説明が短い表示と混ざっていた）。DB を止めて curl → Express 5 が 500 の HTML（`ECONNREFUSED`、スタックトレース）を返した |
| 6-4 API を DB に置き換える（配列の操作 → SQL、`$1` のプレースホルダと SQL インジェクション、`RETURNING`、`rowCount` で 404） | 学習中 | 2026-10-14。「DOM で todos を持つのをやめるのか、毎回 DB から取るのか」と質問 → `todos` は2つある（ブラウザの写しは変えない、サーバーの配列を DB に置き換える）と説明。`DATE` は `setTypeParser` で文字列のまま受け取る形を Claude がおすすめ（D-0010）。1回目：`$1` は全 API で使えた。VS Code の自動 import（`todo` from "node:test"、6-3 に続き2回目）、`Pool` の二重 import、テーブル名にデータベース名 `todo_app`（箱とテーブルの混同）、`RETUNING`、`RETURNING` を `WHERE` の前、POST で自分で作った todo（id 0）を返す、PATCH・DELETE で SELECT してから変更。2回目：1回の SQL の結果で 404 を判断する形に直せた。`res.json(result.rows)` で配列を返していた → 3回目で GET まで `rows[0]` にした（直しすぎ）。Postgres.app が止まっていて 500（ECONNREFUSED）、ソースを直してもサーバーを起動し直していない（2回）。止めて起動し直しても ToDo が残ることを確認（ステップ6のゴール達成）。期限なしで 500（`invalid input syntax for type date: ""`）→ `""` と `null` の違い、`||` の型を示し、サーバー側で `|| null` にする案を Claude がおすすめ（D-0010）→ 1回で書けた |
| 6-5 仕上げと push、テーブルを作る SQL をファイルに残す、技術の選択肢（MySQL / SQLite / MongoDB、ORM の Prisma / Drizzle、マネージド DB） | 学習中 | 2026-10-14。`schema.sql` の課題を「何がしたいのか全くわからない」→ DB の中身は git の外にある、自宅の Mac で clone すると `todos` がない、`package.json` → `npm install` と同じ「作り方のファイル」と説明。1回目は `CREATE DATABASE` と `\c` を入れ、`id NOT NULL INTEGER`（型と制約の順番）、`done` の `NOT NULL` 抜け → 修正。直す前のファイルで作ったテーブルが `todo_app_test` に残っていた（`IF NOT EXISTS` は古いテーブルがあっても黙って成功する → DB ごと作り直して確かめる）。README：手順の順番は正しく、`.env` のユーザー名に触れた。1回目は「リセットされます」が残り、必要なものに PostgreSQL がない → 修正。箇条書き直後の行がつながる Markdown の書き方を説明。コミットは分けずに1つ（`PostgreSQLによるDB管理`、8ファイル）で push。`.env` が入っていないことは確認 |

## ステップ7：ログイン（認証）
ゴール：登録とログインをして、自分の ToDo だけを見て操作できる（ログインしていない人や他人は、見ることも変えることもできない）
作り方：自分で作る＋セッション（D-0020）
早見表：[reference/auth.md](reference/auth.md)

| 項目 | 段階 | メモ |
|---|---|---|
| 7-1 ログインの仕組み（認証と認可、HTTP は毎回初対面、Cookie の流れ `Set-Cookie` → `Cookie`、Cookie はブラウザで書き換えられる、セッションと JWT、パスワードをそのまま保存しない理由）を練習用のルートと curl・開発者ツールで確かめる | 学習中 | 2026-10-27。作り方の選択肢（自前＋セッション／自前＋JWT／外部サービス）と選ぶときの基準を示し、自前＋セッションに決定（D-0020）。「A と B の違いをもう少し詳しく」「JWT のほうが最近よく使われているのか」と質問 → 番号札と通行証のたとえ、ログアウト・漏えいしたときの違い、短い JWT ＋リフレッシュトークンの組み合わせを説明。練習用のルート（`/practice/set`・`/practice/check`）：型と表だけを示した1回目は `(res, req)`、`await res.cookie(userId, 3)`、`res.headers.cookie()`、返事の形が表と違う。ヒント1（場所だけ）でも「そもそも何を書いたらいいのかわかってない」→ 手紙（`req`）と返信用の封筒（`res`）のたとえ、`/api/todos` との対応、①② の手順、骨組みで説明し、以後この形で最初からガイドすることに（D-0021）。2回目は `userId` の `"` 抜け（`Cannot find name 'userId'`）だけ。3回目は変数名を `cookie` に変えたが `res.json({cookie: result})` が残って build が失敗し、`npm run dev` が start まで進まず curl が `Couldn't connect` → 直して curl・開発者ツールで確認。Q1〜Q3（Cookie なしで `{}`、書き換えた値をサーバーは見分けられない、`userId=3` ならなりすませる）は「概ね想定通り」。後半：ハッシュ（ミキサーのたとえ）、ソルト、遅いハッシュを `node -e` で確認。Q4（なぜ照合できるか）は「ハッシュ関数に入れて結果を確認できる」で正解（保存したハッシュと比べる点は補足）。Q5 は「ソルトはサーバー側」は正解、「`req.cookie` と合わせて」は誤り → 混ぜるのはログインで入力されたパスワード（`req.body`）。パスワードを使うのはログインの1回だけ、Cookie はそのあと毎回、と2段階を整理。「Cookie で送り合うもの、サーバー側だけに保存するもの、ハッシュで確かめる値を全部含めて図にして」→ 全体の流れの図（`reference/images/login-flow.svg`）を作った。「Cookie の合言葉はハッシュを使わないの？」と質問 → DB が漏れたときのなりすましを防ぐため、DB にはハッシュ（SHA-256、ソルトなし）で保存することに（D-0022） |
| 7-2 users テーブルと外部キー（`users` の設計、`UNIQUE`、`todos` に `user_id` を足して `REFERENCES` でつなぐ、今ある ToDo の扱い、`ON DELETE`、`schema.sql` の更新） | 学習中 | 2026-10-27。D-0021 の形（目的・たとえ・型・骨組み・確かめ方）で課題を出した最初の項目。パスワードは1列（`password_hash`。ライブラリがソルトとハッシュを1つの文字列で返す）、`ON DELETE CASCADE`、今ある ToDo（1件）は DB ごと作り直す、を Claude がおすすめ（D-0010）。`users` は1回で正解。`todos.user_id` は `REFERENCES` が抜けて `NOT NULL ON DELETE CASCADE` だけ → 型と見比べるヒントで `REFERENCES users`（`(id)` 省略）に修正。予想は Q1（UNIQUE）・Q2（外部キー）・Q4（NOT NULL で 500）が正解。Q3 は「id = 1 の todo が消える」→ 2人のユーザーで試し、消えたのは `user_id` = 1 の ToDo 全部（id 1・2）で、b の ToDo（id 3）は残った。失敗した INSERT でも番号が進むことを DB で確認（users の次は 4、todos の次は 9。画面から4回追加を押していた）。報告は「追加を押しても表に追加されない、fetch が 500」だけで、Q1〜Q3 の結果とサーバーのエラー文は Claude が DB から確認した |
| 7-3 ユーザー登録（登録の API、ハッシュのライブラリを選ぶ、ソルトと遅いハッシュ、同じメールアドレスで 409、返事にパスワードを入れない） | 学習中 | 2026-10-27。始める前に、7-2 の `schema.sql` のコミットが入っていなかった（外側のフォルダで実行したらしい）→ `app/` に移ってやり直し、`package-lock.json`（body-parser・qs の更新）も別のコミットにした。ライブラリは argon2 / bcryptjs / `node:crypto` の scrypt を比べて argon2 をおすすめ（D-0010）。`POST /api/users` の1回目：`typeof` で確かめてから `.trim()`、`\|\|` の左から止まる性質で `.length` を守る、409 の `rowCount === 0` は正解。誤りは `ON ONCFLICT`（つづり）と `DO NOTHING` 抜け、列名 `passwordHash`（SQL は `password_hash`。PostgreSQL は `"` なしの名前を小文字で読む）、空のメールアドレスの 400 がない、`.end()` で `{id, email}` を返していない。`tsc` が通っても 500（SQL は TypeScript にはただの文字列）。2回目：`DO NOTHING` は追加。新しく `if (email = "")`（代入。`const` なので `TS2588`）、`result.row[0]`（`TS2551`）。つづりと列名は直っていない。2回目のあと、学習者の依頼で「先にレビュー、確かめ方はそのあと」に（D-0023）。3回目で型・SQL とも通った（`PREPARE` で確認）。`npm run build` を外側のフォルダで実行して `Could not read package.json` → `app/` で実行。予想は Q1「1」、Q2「空白なし・小文字の email」、Q3「同じ」、Q4「hash」。curl ①〜⑦は直す前に起動したままのサーバー（`ONCFLICT`）に送っていて 500 だった（build しても、動いているプロセスは起動したときの `dist` を使い続ける）。学習者の依頼で、実行の前に答え合わせ：Q1 は 4（7-2 で 3 まで進んでいる）、Q2 は 409（整えた結果 `c@example.com` と重なる）。`ON CONFLICT DO NOTHING` でも番号は1つ進むので、e は 6。Q3 は違う（ソルトが毎回違う。先頭の `$argon2id$v=19$m=65536,p=4,t=3$` は同じ）。Q4 は正解（`password_hash` と `created_at`）。curl ①〜⑦は学習者の判断で省略し、7-3 を終えた（新しいコードでの登録は 7-4 の確かめ方で行う） |
| 7-4 ログイン・ログアウト（パスワードの照合、セッションを作る・消す、Cookie の `HttpOnly`・`SameSite`・`Max-Age`、失敗の理由を細かく伝えない、401） | 未着手| 学習中 | 2026-10-28。3つに分けた（① `sessions` テーブル、② `POST /api/login`、③ `POST /api/logout`）。おすすめ（D-0010）：`token_hash` を主キー、期限7日、パスは `/api/login`・`/api/logout`、合言葉は `randomBytes(32)` の base64url、`sameSite: "lax"`。①② の1回目（「雑に書いてみた、`const result =` の型がおかしいと思う」）：`INTERVAL "7 days"`（`"` は列名の記号）、`await` 抜けで `result` が Promise、使わない結果に型と `rowCount` の確認と `XXX`、表の名前 `session`、Cookie を INSERT より前、`.end()`、ログインで長さを確認、登録まで整える前の `email` を SQL に渡す誤りが入った（7-3 のコミット済みのコードを壊した）。期限は DEFAULT ではなく INSERT に書くことをおすすめ（`IF NOT EXISTS` は既存の表を変えないため）。2回目：DB は1日・Cookie は7日の食い違い、長さの確認が残る。3回目で通った。学習者は前夜に自分で `dropdb`・`createdb` していて、表がない状態だった → `schema.sql` で3つ作った。確かめ方：⑤⑥ は同じ 401（ETag まで同じ）、⑦ は大文字でもログインでき `Set-Cookie: ...; Max-Age=604800; ...; HttpOnly; SameSite=Lax`。⑩ は `node` の `nod` が抜けて実行できず（Claude が計算して、2回目の行の `token_hash` と一致）。予想：Q2（同じ）・Q3（604800）・Q5（2行）は正解。Q4「⑩ は DB のハッシュと違う（ソルトが DB 側）」は誤り → 合言葉はソルトなしの SHA-256 なので一致する。ソルトがあると、届いた合言葉だけでは行を探せない（パスワードはメールアドレスで行を先に探すのでソルトを使える）。S-0019 の「パスワードか Cookie か」の区別がまだあいまい。ログアウトは 7-5 の最初の部分として作った（7-5 の B） |
| 7-5 自分の ToDo だけに（Cookie から「誰か」を割り出す処理＝ミドルウェア、ログインしていなければ 401、すべての SQL に `user_id` の条件、他人の id で変更・削除できないことを確かめる＝認可） | 学習中 | 2026-10-28。7-4 のログアウトとまとめて A〜D に分けた（A `cookie-parser`、B ログアウト、C 入口の係 `requireLogin`、D ToDo の4つのルート）。たとえは「ToDo の部屋の入口の係が番号札を台帳で調べ、名札（`res.locals.userId`）をつけて通す」。おすすめ（D-0010）：`cookie-parser`、`res.locals`、`app.use("/api/todos", requireLogin)`、他人の ToDo は 404。1回目：`res.locals.userId(result.rows[0])`（関数の呼び出しになり 500。`res.locals` が any なので `tsc` は通る）、`ORDER BY id WHERE`（順番）、係が見つからないとき 404、ログアウトが 401・404 を返して Cookie を消さない。2回目：ログアウトの 401 に `return` がなく `update(undefined)` でエラー、係の 401 が `.end()` で中身なし。3回目で通った。確かめ方 ①〜⑮ はすべて仕様どおり（d は id 3。7-4 の 409 で 2 が使われた）。Cookie なしと書き換えた Cookie と期限切れは同じ 401（ETag まで同じ）、他人の ToDo の PATCH・DELETE は 404 で c の ToDo は変わらない、期限切れの行は DB に残るが `expires_at > NOW()` で通らない、ログアウトで消えるのはその合言葉の行だけ（7-4 の c の2行は残る）。予想は今回は出さずに答え合わせ |
| 7-6 画面（登録・ログインのフォーム、ログインしているかで表示を切り替える、401 を受けたらログイン画面へ、ログアウトボタン） | 学習中 | 2026-10-28。A `GET /api/me`、B `index.html` の2つの `section`、C `style.css`（値は design.md）、D `main.ts`。おすすめ（D-0010）：1つの HTML で `hidden` で切り替える、`/api/me` を足す、ログインと同じフォームに「登録する」、登録のあとはそのままログイン。仕組みとして「JS は合言葉に一切さわらない（Set-Cookie の保存も Cookie の送信もブラウザがする）」を説明。1回目：A〜C は通った。D は `"#ogout-button"`（つづり。セレクタはただの文字列なので `tsc` は通る）と `hidden` の向きが逆で、画面がヘッダーだけになる。ほかに 401 の文なし、`await` なし、使わない `const res =`、骨組みのコメントの残り。2回目で通った（ログアウトで一覧を空にする処理も入れた）。確かめ方は手順どおりではなく、自分のアカウントを画面で登録して、追加・完了・削除・ログアウトまで使った（DB で確認）。予想は出さずに答え合わせ |
| 7-7 仕上げと push（README・`schema.sql`・`.env.example`、2人のユーザーで通しの確認、技術の選択肢：外部サービス、ライブラリ（express-session / Passport.js / Better Auth）、JWT、「Google でログイン」（OAuth）、パスキー、2段階認証） | 学習中 | 2026-10-28。A：技術の選択肢を早見表 `auth.md` に追加（作り方ごとの任せられる範囲、パスワード以外のログインの方法、今回作らなかったもの）。要点は「ログインの方法が変わっても、本人確認のあとのセッションは同じ」「実務では自前で書くことは少ない」。`.env.example`・`schema.sql` は直すところなし（セッションは秘密の鍵が要らないので `.env` に足すものがない。JWT なら署名の鍵が要る）。B：README は学習者の依頼で今回だけ Claude が書いた（機能・使用技術・古い DB の作り直し・`npm run dev`・最初の登録・API の表・公開するときの注意）。「注意」の節は学習者の判断で消した。C：2つのウィンドウでの通しの確認は、手順を出したが学習者の判断で実行せず、答え合わせだけ（普通のウィンドウとシークレットウィンドウは Cookie が別、ログアウトで消えるのはその合言葉の行だけ）。質問「`todos` が1つの表で、複数人の ToDo を1つのリストで持っているが問題ないか」→ 1つの表に全員分を入れて `user_id` で分けるのが普通の設計（ユーザーごとの表・DB と比べた）。そのかわり、すべての SQL に `user_id` の条件をつける責任がアプリにある。外部キーの列には索引が自動で作られないこと（`\d todos` で確認）、RLS も紹介 |

## ステップ8〜9
各ステップの始めに項目を追加する。ステップを終えたら `notes/step<番号>.md` にまとめを作り、見出しの下にリンクを置く。

## 先取りで説明済みのこと
- 2026-10-06：React とは何か（データを変えると画面が自動で書き換わる、コンポーネント、JSX）。ほかの選択肢 Vue / Svelte / Angular / Next.js。ステップ3・4のあとで再紹介
- 2026-10-01：JS をパソコンで動かせるのは Node.js（実行エンジン）のおかげ。ブラウザと Node.js でできることの違い（ステップ1・3・5で再登場）
- 2026-10-01：JS と TS の違いの概要（TS = JS + 型、実行前に間違いに気づける、JS に変換してから動かす）。詳しくはステップ4

## 理解度チェックの記録
| 日付 | ステップ | 質問 | 結果 |
|---|---|---|---|
| 2026-10-01 | 0 | add と commit の役割、ステージがある理由 | 役割は説明できた。理由は答えられず（要復習） |
| 2026-10-01 | 0 | app と外側でリポジトリが変わる理由 | 「参照する .git が違う」は説明できた。親へたどる仕組みは答えられず（要復習） |
| 2026-10-01 | 0 | commit と push の違い | 説明できた |
| 2026-10-06 | 0 | ステージがある理由（再確認） | 説明できた |
| 2026-10-06 | 0 | .git の探し方（再確認） | 説明できた（最初に見つかった .git で止まる点は補足） |
| 2026-10-06 | 1 | URL を開いてから画面が出るまでの流れ | ヒント2段階で説明できた（最初は GET / 200 と、CSS・JS の追加リクエストが抜けていた） |
| 2026-10-06 | 1 | ToDo 追加のメソッド・パス・ステータスコード | POST は正解。パスはヒント1段階で `/todos`。201 は補足 |
| 2026-10-06 | 2 | カードで期限と削除ボタンが右端に寄る理由 | label の `flex: 1` で説明できた（親 li の `display: flex` は補足） |
| 2026-10-06 | 2 | スマホでフォームが2行になる仕組み | `@media` と `flex-wrap` は説明できた。`flex-basis: 100%` が抜けた（要復習） |
| 2026-10-06 | 2 | `required` があるのにサーバーでもチェックする理由 | 「開発者ツールで操作できる」と説明できた（ブラウザを使わずに送れる点は補足） |
| 2026-10-07 | 3 | チェックを押してから取り消し線がつくまでの流れ | イベント → `todo.done` → `render()` の順は説明できた。どの todo かが分かる仕組み（クロージャ）と、`done` の class と CSS で線がつく点は補足 |
| 2026-10-07 | 3 | `push` は const でよいのに削除で let が必要な理由 | 説明できた（入れ直すと const ではエラー） |
| 2026-10-07 | 3 | `innerHTML` ではなく `textContent` を使う理由 | 説明できた（入力が HTML として解釈される。JS が実行される点＝XSS は補足） |
| 2026-10-09 | 4 | `node` と `tsc` が `.ts` にしていること | `node` は型を無視して実行、は説明できた。`tsc` を「検証して実行」と回答（→ 実行はせず、検証と JS への変換） |
| 2026-10-09 | 4 | `node_modules/` と `public/main.js` を push しない共通の理由 | 「ほかのファイルからローカルで作れる」と説明できた（`package.json` → `npm install`、`main.ts` → `npm run build` の対応は補足） |
| 2026-10-09 | 4 | `querySelector` が `null` を含む理由、`!` ではなく `if` + `throw` を選んだ理由 | 説明できた（TS は HTML を読まない。なかったときに原因が一目で分かる） |
| 2026-10-14 | 5 | 画面で ToDo を追加してから一覧に出るまでの流れ | 説明できた（ブラウザが POST → サーバーが配列に追加 → ブラウザが GET し直して描き直す）。201・200、JSON にして送ること、`render()` は補足 |
| 2026-10-14 | 5 | ToDo に id をつけた理由2つ | 1つ（削除でずれる）は説明できた。もう1つ（ブラウザとサーバーは別のオブジェクトなので `!==` が使えない）が抜けた（要復習） |
| 2026-10-14 | 5 | `npm run dev` で起きること、`tsc` と `node` の役割 | 実行されるコマンドの順番は答えられた。`tsc` = チェックと変換（実行しない）、`node` = 実行、の役割の説明が抜けた（要復習） |
| 2026-10-14 | 6 | ステップ6で止めても消えなくなった理由 | 「todos を DB 側で管理し始めた」と説明できた（DB は別のプログラムでディスクに書き込む、は補足） |
| 2026-10-14 | 6 | `$1` を使う理由 | 「SQL インジェクションを防ぐ」と答えられた。仕組み（`1 OR 1=1`、`$1` はただの値）は補足 |
| 2026-10-14 | 6 | 期限なしで 500 になった原因と、server.ts で直した理由 | 「null が string 型に合わない」と回答 → 原因は `""` が DATE 列に合わないこと。サーバーで直す理由（門番）が抜けた（要復習） |
| 2026-10-14 | 4・5 | `npm run dev` での `tsc` と `node` の役割（再確認） | 「ts を js に変換 → サーバー起動」と答えられた（改善）。`tsc` の型の検証が抜けた |
