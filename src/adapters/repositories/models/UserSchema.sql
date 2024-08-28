USE systeme_de_vote

CREATE TABLE users (
    `id` VARCHAR(36) PRIMARY KEY NOT NULL,
    username VARCHAR(24) NOT NULL,
    email VARCHAR(36) NOT NULL,
    `password` VARCHAR(36) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)