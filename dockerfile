# Base image for Ubuntu
FROM ubuntu:latest

# Set the working directory
WORKDIR /app

# Install MySQL
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server

# Replace the MySQL configuration file with the bind-address value
RUN echo "[mysqld]" > /etc/mysql/conf.d/bind.cnf && \
    echo "bind-address=0.0.0.0" >> /etc/mysql/conf.d/bind.cnf

# Set environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_USER=auth
ENV MYSQL_PASSWORD=Auth1908@
ENV MYSQL_DATABASE=auth
# Create the /nonexistent directory
RUN mkdir /nonexistent

# Install Node.js
RUN apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Install Git
RUN apt-get install -y git

# Clone the Git repository using the environment variables
RUN git clone https://github.com/eduardop10/TasksScheduler.git .

# Install dependencies
RUN npm install

# Expose ports for MySQL and the Node.js application
EXPOSE 3306
EXPOSE 3000

# Start MySQL service and run the Node.js application
CMD service mysql start && \
    sleep 5 && \
    mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;" && \
    mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE USER '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';" && \
    mysql -u root -p$MYSQL_ROOT_PASSWORD -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'localhost';" && \
    mysql -u root -p$MYSQL_ROOT_PASSWORD -e "ALTER USER '$MYSQL_USER'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_PASSWORD'; FLUSH PRIVILEGES;" && \
    mysql -u root -p$MYSQL_ROOT_PASSWORD -e "FLUSH PRIVILEGES;" && \
    mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE -e "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, type VARCHAR(1), email VARCHAR(100) NOT NULL UNIQUE, pass VARCHAR(100) NOT NULL);" && \
    mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE -e "CREATE TABLE IF NOT EXISTS tasks (task_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, task_date DATE NOT NULL, summary VARCHAR(2500), FOREIGN KEY (user_id) REFERENCES users(id));" && \
    #Set some Manager users, in all cases the password is manager
    mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE -e "INSERT INTO users (type, email, pass) VALUES ('M', 'manager1@manager.com', '\\\$2b\\\$10\\\$h7VfI5.q93CdNaq7oD4GjeXTITBNLf8lczcp/lJ3.PRvJQoJGyT36'), ('M', 'manager2@manager.com', '\\\$2b\\\$10\\\$h7VfI5.q93CdNaq7oD4GjeXTITBNLf8lczcp/lJ3.PRvJQoJGyT36'), ('M', 'manager3@manager.com', '\\\$2b\\\$10\\\$h7VfI5.q93CdNaq7oD4GjeXTITBNLf8lczcp/lJ3.PRvJQoJGyT36');" && \
    npm start
