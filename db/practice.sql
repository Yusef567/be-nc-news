\c nc_news_test

SELECT count(*) 
AS comment_count,articles.title,articles.topic,articles.author,
articles.created_at,articles.votes,articles.article_img_url,articles.article_id
FROM comments
JOIN articles ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;
-- psql -f ./practice.sql

