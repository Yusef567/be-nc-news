\c nc_news_test

-- SELECT CAST(count(comments) AS INT)
--   AS comment_count,articles.title,articles.topic,articles.author,
--   articles.created_at,articles.votes,articles.article_img_url,articles.body,articles.article_id
--   FROM comments
--   FULL OUTER JOIN articles ON articles.article_id = comments.article_id
--   GROUP BY articles.article_id
--   ORDER BY created_at desc;

  DELETE FROM comments WHERE comment_id = 1 RETURNING *;
  SELECT CAST(count(comments) AS INT)

    AS comment_count,articles.title,articles.topic,articles.author,
    articles.created_at,articles.votes,articles.article_img_url,articles.body,articles.article_id
    FROM comments
    FULL OUTER JOIN articles ON articles.article_id = comments.article_id
    WHERE articles.article_id = 5
    GROUP BY articles.article_id
     ORDER BY created_at desc;

-- psql -f ./practice.sql



