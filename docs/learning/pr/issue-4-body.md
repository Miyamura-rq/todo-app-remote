Closes #4

## 概要
DB の読み書きを、pg で書いた SQL から Drizzle ORM に置き換えた。表の作成も、`psql -f db/schema.sql` から drizzle-kit のマイグレーションに置き換えた。

## 変更内容
- Drizzle ORM（0.45.4）と drizzle-kit（0.31.11）を入れ、`drizzle.config.ts` を作った
- 表の定義を `src/server/db/schema.ts` に TypeScript で書いた（`drizzle-kit pull` で作ってから整えた）。型は `$inferSelect` で表の定義から作る
- `drizzle/` のマイグレーション（`npm run db:generate`・`npm run db:migrate`）で表を作るようにし、`db/schema.sql` を消した。README の手順も直した
- `server.ts` の `pool.query` をすべて Drizzle のクエリにした。返事の ToDo とタグからは `user_id` を外した
- `logger: true` で、実行した SQL をターミナルに出すようにした
- ポートを環境変数 `PORT` で変えられるようにした（ふだんは 3000）

## Issue の範囲を超えたこと
#1（タグ）で作った `tags`・`todo_tag` の表とタグの API も、Drizzle に移して入れた。そのため、マイグレーションで作られる表は3つではなく5つになる。ToDo を作るときにタグも付ける処理は `db.transaction` で書いた。

## 完了条件
- [x] `server.ts` に `pool.query` が残っていない
- [x] 空の DB に README の手順どおりにマイグレーションを実行すると、表ができる（タグを含めて5つ）
- [x] ユーザー登録・ログイン・ログアウト・Todo の一覧・追加・完了・削除ができる（curl で確認）
- [x] 別のユーザーでログインすると、ほかのユーザーの Todo が見えない・変えられない（一覧は `[]`、変更・削除は 404）
- [x] 置き換える前の SQL と、Drizzle が発行した SQL を API ごとに並べた（下）

## 気づいたこと
- drizzle-kit が作った `0001_tags.sql` では、`todo_tag` の外部キーが、指す先の `todos` の `UNIQUE (id, user_id)` より先に並んでいて、流すとエラーになった。SQL ファイルの中で順番を入れ替えた
- `drizzle-kit migrate` は失敗しても理由を出さないので、psql で流して原因を確かめた

## 前後の SQL
前は `main` の `pool.query`（タグは #1 のブランチ）、後は Drizzle のログ。`params` は省いた。

<details>
<summary>API ごとの SQL</summary>

### POST /api/users（登録）
```sql
-- 前
INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id, email
-- 後
insert into "users" ("id", "email", "password_hash", "created_at") values (default, $1, $2, default) on conflict ("email") do nothing returning "id", "email"
```

### POST /api/login（ログイン）
```sql
-- 前
SELECT id, email, password_hash FROM users WHERE email = $1
INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')
-- 後
select "id", "email", "password_hash" from "users" where "users"."email" = $1
insert into "sessions" ("token_hash", "user_id", "expires_at", "created_at") values ($1, $2, now() + interval '7 days', default)
```

### POST /api/logout（ログアウト）
```sql
-- 前
DELETE FROM sessions WHERE token_hash = $1
-- 後
delete from "sessions" where "sessions"."token_hash" = $1
```

### ログインの確認（`requireLogin`。ログインが要る API のたびに）
```sql
-- 前
SELECT user_id FROM sessions WHERE token_hash = $1 AND expires_at > NOW()
-- 後
select "user_id" from "sessions" where ("sessions"."token_hash" = $1 and "sessions"."expires_at" > now())
```

### GET /api/me
```sql
-- 前
SELECT id, email FROM users WHERE id = $1
-- 後
select "id", "email" from "users" where "users"."id" = $1
```

### GET /api/todos（一覧）
```sql
-- 前（main）
SELECT * FROM todos WHERE user_id = $1 ORDER BY id
-- 前（タグのブランチ）
SELECT todos.id, todos.text, todos.deadline, todos.done,
       COALESCE(json_agg(json_build_object('id', tags.id, 'name', tags.name) ORDER BY tags.id)
                FILTER (WHERE tags.id IS NOT NULL), '[]') AS tags
FROM todos
LEFT JOIN todo_tag ON todos.id = todo_tag.todo_id
LEFT JOIN tags ON todo_tag.tag_id = tags.id
WHERE todos.user_id = $1
GROUP BY todos.id
ORDER BY todos.id
-- 後
select "todos"."id", "todos"."text", "todos"."deadline", "todos"."done", coalesce(
    json_agg(json_build_object('id', "tags"."id", 'name', "tags"."name") order by "tags"."id")
        filter (where "tags"."id" is not null),
    '[]')
from "todos"
left join "todo_tag" on "todo_tag"."todo_id" = "todos"."id"
left join "tags" on "tags"."id" = "todo_tag"."tag_id"
where "todos"."user_id" = $1 group by "todos"."id" order by "todos"."id"
```

### POST /api/todos（追加。タグも付ける）
```sql
-- 前（main）
INSERT INTO todos (text, deadline, user_id) VALUES ($1, $2, $3) RETURNING *
-- 前（タグのブランチ。pool.connect() で借りた接続で手で送る）
BEGIN
INSERT INTO todos (text, deadline, user_id) VALUES ($1, $2, $3) RETURNING id, text, deadline, done
SELECT id, name FROM tags WHERE user_id = $1 AND id = $2                                  -- タグごと
INSERT INTO todo_tag (user_id, todo_id, tag_id) VALUES ($1, $2, $3) ON CONFLICT (todo_id, tag_id) DO NOTHING
COMMIT                                                                                    -- 他人のタグなら ROLLBACK
-- 後（db.transaction が begin・commit・rollback を送る）
begin
insert into "todos" ("id", "text", "deadline", "done", "user_id") values (default, $1, $2, default, $3) returning "id", "text", "deadline", "done"
select "id", "name" from "tags" where ("tags"."id" = $1 and "tags"."user_id" = $2)          -- タグごと
insert into "todo_tag" ("user_id", "todo_id", "tag_id") values ($1, $2, $3) on conflict ("todo_id","tag_id") do nothing returning "tag_id"
commit                                                                                    -- 他人のタグなら rollback
```

### PATCH /api/todos/:id（完了の切り替え）
```sql
-- 前
UPDATE todos SET done = $1 WHERE id = $2 AND user_id = $3 RETURNING *
-- 後
update "todos" set "done" = $1 where ("todos"."id" = $2 and "todos"."user_id" = $3) returning "id", "text", "deadline", "done"
```

### DELETE /api/todos/:id（削除）
```sql
-- 前
DELETE FROM todos WHERE id = $1 AND user_id = $2
-- 後
delete from "todos" where ("todos"."id" = $1 and "todos"."user_id" = $2) returning "id"
```

### POST /api/todos/:id/tags/:tagId（タグを付ける）
```sql
-- 前（タグのブランチ）
SELECT todos.id FROM todos JOIN tags ON todos.user_id = tags.user_id WHERE todos.user_id = $1 AND todos.id = $2 AND tags.id = $3
INSERT INTO todo_tag (user_id, todo_id, tag_id) VALUES ($1, $2, $3) ON CONFLICT (todo_id, tag_id) DO NOTHING
-- 後
select "todos"."id" from "todos" inner join "tags" on "tags"."user_id" = "todos"."user_id" where ("todos"."user_id" = $1 and "todos"."id" = $2 and "tags"."id" = $3)
insert into "todo_tag" ("user_id", "todo_id", "tag_id") values ($1, $2, $3) on conflict ("todo_id","tag_id") do nothing
```

### DELETE /api/todos/:id/tags/:tagId（タグを外す）
```sql
-- 前（タグのブランチ）
DELETE FROM todo_tag WHERE user_id = $1 AND todo_id = $2 AND tag_id = $3
-- 後
delete from "todo_tag" where ("todo_tag"."user_id" = $1 and "todo_tag"."todo_id" = $2 and "todo_tag"."tag_id" = $3) returning "todo_id"
```

### GET /api/tags（タグの一覧）
```sql
-- 前（タグのブランチ）
SELECT id, name FROM tags WHERE user_id = $1 ORDER BY id
-- 後
select "id", "name" from "tags" where "tags"."user_id" = $1 order by "tags"."id"
```

### POST /api/tags（タグの作成）
```sql
-- 前（タグのブランチ）
INSERT INTO tags (name, user_id) VALUES ($1, $2) ON CONFLICT (name, user_id) DO NOTHING RETURNING id, name
-- 後
insert into "tags" ("id", "name", "user_id") values (default, $1, $2) on conflict ("user_id","name") do nothing returning "id", "name"
```

### DELETE /api/tags/:id（タグの削除）
```sql
-- 前（タグのブランチ）
DELETE FROM tags WHERE id = $1 AND user_id = $2
-- 後
delete from "tags" where ("tags"."id" = $1 and "tags"."user_id" = $2) returning "id"
```

</details>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
