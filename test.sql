TRUNCATE TABLE topics

TRUNCATE TABLE votes

INSERT INTO topics (id, title, description)
VALUES (1, "title", "description");

INSERT INTO votes (id, user_id, topic_id, answer)
VALUES (1, 1, 1, 1);


SELECT
    topics.id AS topic_id,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'vote_id', votes.id,
            'user_id', votes.user_id,
            'answer', votes.answer
        )
    ) AS votes,
    MAX(topics.title) AS title,
    MAX(topics.description) AS description,
    MAX(topics.created_at) AS created_at,
    MAX(topics.updated_at) AS updated_at
FROM topics
LEFT JOIN votes ON topics.id = votes.topic_id
WHERE topics.id = 1
GROUP BY topics.id;
