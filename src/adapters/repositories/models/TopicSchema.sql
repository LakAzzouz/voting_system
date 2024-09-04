USE systeme_de_vote

CREATE TABLE topics (
    `id` VARCHAR(36) PRIMARY KEY NOT NULL,
    title VARCHAR(36) NOT NULL,
    `description` VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)