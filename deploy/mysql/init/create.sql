 CREATE DATABASE IF NOT EXISTS animes_database;

 USE animes_database;

 CREATE TABLE IF NOT EXISTS anime_list (
    idAnime INT(11) AUTO_INCREMENT PRIMARY KEY,
    gender VARCHAR(255),
    title VARCHAR(255),
    type VARCHAR(255),
    source VARCHAR(255),
    idUser INT(11)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

 CREATE TABLE IF NOT EXISTS blacklist_tokens (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255),
    created_at TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

 CREATE TABLE IF NOT EXISTS source (
    idSource INT(11) AUTO_INCREMENT PRIMARY KEY,
    Descricao VARCHAR(255)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
    INSERT INTO source (Descricao) VALUES
    ('4-koma manga'),
    ('Book'),
    ('Card game'),
    ('Digital manga'),
    ('Game'),
    ('Light novel'),
    ('Manga'),
    ('Music'),
    ('Novel'),
    ('Original'),
    ('Other'),
    ('Picture book'),
    ('Radio'),
    ('Unknown'),
    ('Visual novel'),
    ('Web manga');




 CREATE TABLE IF NOT EXISTS type (
    idType INT(11) AUTO_INCREMENT PRIMARY KEY,
    Descricao VARCHAR(255)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
    INSERT INTO type (Descricao) VALUES
    ('Movie'),
    ('Music'),
    ('ONA'),
    ('OVA'),
    ('Special'),
    ('TV');



 CREATE TABLE IF NOT EXISTS usuarios (
    idUser INT(11) AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(10)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;



 INSERT INTO usuarios (username, password, role) VALUES
('admin', '$2b$10$xgL4jI9OvuOQ9cYPUkEFCeFgnj5/5xhyEfcPeJRDI2BiLbnh0jc6a', 'Admin');


