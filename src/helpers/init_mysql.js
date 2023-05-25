var mysql = require('mysql');

config = {
    host: 'localhost', // O host do banco. Ex: localhost
    user: 'auth', // Um usuário do banco. Ex: user 
    password: 'Auth1908@', // A senha do usuário. Ex: user123
    database: 'auth' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
}
var connection =mysql.createConnection(config); //added the line

connection.connect(function(err){
  if (err){
    console.log('error connecting:' + err.stack);
  }
  console.log('connected successfully to MySQL.');
});

module.exports ={
     connection : mysql.createConnection(config) 
} 
