USE systeme_de_vote

CREATE TABLE votes (
    `id` VARCHAR(36) PRIMARY KEY NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    topic_id VARCHAR(36) NOT NULL,
    answer ,
    created_at TIMESTAMP
)