-- TRUNCATE TABLE topics

-- TRUNCATE TABLE votes

-- INSERT INTO topics (`id`, `title`, `description`, `created_at`, `updated_at`)
-- VALUES ('topic_id', 'title', 'description', NOW(), NOW());

-- INSERT INTO votes (`id`, `user_id`, `topic_id`, `answer`, `created_at`)
-- VALUES ('vote_id', 'user_id', 'topic_id', 1, NOW());

-- SELECT
--       topics.id AS id,
--       JSON_ARRAYAGG(
--         JSON_OBJECT(
--           'vote_id', votes.id,
--           'user_id', votes.user_id,
--           'answer', votes.answer,
--           'created_at', votes.created_at
--         )
--       ) AS votes,
--       MAX(topics.title) AS title,
--       MAX(topics.description) AS `description`,
--       MAX(topics.created_at) AS created_at,
--       MAX(topics.updated_at) AS updated_at
--       FROM topics
--       LEFT JOIN votes ON topics.id = votes.topic_id
--       WHERE topics.id = 'topic_id'
--       GROUP BY topics.id;
