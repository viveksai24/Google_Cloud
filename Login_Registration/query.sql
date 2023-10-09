-- for the sample database
CREATE DATABASE userdb;
USE userdb;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);
-- Insert sample users
INSERT INTO users (firstname, lastname, email, password) VALUES
    ('John', 'Doe', 'john@example.com', 'password123'),
    ('Jane', 'Smith', 'jane@example.com', 'pass456'),
    ('Alice', 'Johnson', 'alice@example.com', 'securepass');
