\c nc_news_test

UPDATE articles SET votes = votes + -5 WHERE article_id = 1
 RETURNING *
-- SELECT * FROM articles WHERE article_id = 1;

-- psql -f ./practice.sql

-- SELECT CAST(25.65 AS int);