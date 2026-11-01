# メンターの Issue の写し

`app/` の GitHub のリポジトリは非公開で、Claude は Issue を直接読めない。そのため、学習者が貼りつけた本文をここに写して保管する（D-0025）。

| ファイル | Issue | ステップ |
|---|---|---|
| [issue-1.md](issue-1.md) | #1 タグと、絞り込み・検索 | 8 |
| [issue-2.md](issue-2.md) | #2 リストの共有と、リアルタイムの反映 | （やめた。D-0031） |
| [issue-3.md](issue-3.md) | #3 画像から ToDo の候補を抜き出す（Claude API） | （やめた。D-0031） |
| [issue-4.md](issue-4.md) | #4 DB の読み書きを pg の SQL から Drizzle ORM に置き換える | 9 |
| [issue-5.md](issue-5.md) | #5 API のサーバーを Express から Hono に置き換える | 10 |
| [issue-6.md](issue-6.md) | #6 React Router のアプリを作り、ユーザー登録・ログイン・ログアウトの画面を移す | 11 |
| [issue-7.md](issue-7.md) | #7 Todo の画面を React Router に移し、古い画面を消す | 12 |

#4〜#7 は「0周目」：今の Todo アプリを、うえさかと同じ技術スタック（Drizzle・Hono・React Router）に1つずつ移す。

- ステップを始めるときは、そのステップの Issue のファイルだけを読んで、項目と流れを決める（ほかのファイルは開かない）。
- 新しい Issue を受け取ったら、`issue-<番号>.md` として同じ形で写し、この表に1行足す。
- Issue の本文が GitHub で書き換わったら、学習者に貼り直してもらい、写しも直す。
