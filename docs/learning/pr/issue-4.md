# Issue #4 の PR の材料（ステップ9）

ブランチ `feature/4-drizzle` → `main`。PR の本文は学習者が書く（D-0025）。下の「前後の SQL」は Claude の下書きで、そのまま貼ってよい。

## PR の本文の骨組み（中身は学習者が書く）
- 概要：何をしたか（1〜2文）
- 変更内容：表の定義（`schema.ts`）、マイグレーション（`drizzle/`、`schema.sql` を消した）、`server.ts` のクエリ、ログ
- Issue の範囲を超えたこと：ステップ8（Issue #1）のタグの表と API も Drizzle に移して含めた。表は3つではなく5つになる（D-0033）
- 完了条件：Issue のチェックリストと、どう確かめたか
- 前後の SQL：下の表
- 気づいたこと：drizzle-kit が作った `0001_tags.sql` の順番を直したこと、`drizzle-kit migrate` が失敗の理由を出さないこと、など

## 前後の SQL（API ごと）
- 前：`main` の `pool.query`（タグは `feature/1-tags-search`）。後：Drizzle のログ（`logger: true`）。
- `params` は省いた（パスワードやセッションのハッシュが入るため）。
- Drizzle の SQL の特徴：名前を `"…"` で囲む、`insert` は省いた列も `default` と書く、`where` の条件をかっこで囲む、`returning *` ではなく列を書く。削除は消えた行を数えるために `returning "id"` を足した。

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
