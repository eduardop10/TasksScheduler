-- Create the database
CREATE DATABASE IF NOT EXISTS auth;

-- Create the user
CREATE USER 'auth'@'localhost' IDENTIFIED BY 'Auth1908@';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON auth.* TO 'auth'@'localhost';

-- Update user authentication
ALTER USER 'auth'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Auth1908@';

-- Flush privileges
FLUSH PRIVILEGES;

-- Use database
USE auth;
 
-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(1),
  email VARCHAR(100) NOT NULL UNIQUE,
  pass VARCHAR(100) NOT NULL
);

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  task_date DATE NOT NULL,
  summary VARCHAR(2500),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert records into the users table the pass in all cases is "manager" hashed with bcrypt using managerPassHashGenerator.js script
INSERT INTO users (type, email, pass)
VALUES
  ('M', 'manager1@manager.com', '$2b$10$h7VfI5.q93CdNaq7oD4GjeXTITBNLf8lczcp/lJ3.PRvJQoJGyT36'),
  ('M', 'manager2@manager.com', '$2b$10$h7VfI5.q93CdNaq7oD4GjeXTITBNLf8lczcp/lJ3.PRvJQoJGyT36'),
  ('M', 'manager3@manager.com', '$2b$10$h7VfI5.q93CdNaq7oD4GjeXTITBNLf8lczcp/lJ3.PRvJQoJGyT36');
