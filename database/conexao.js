const mysql = require('mysql2')

//usar connection pool reduz o tempo gasto com a conexao com o mysql server
//o pool nao cria todas as conexoes de uma vez, ele vai criando conforme for solicitado ate atingir o seu limite

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'teste',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool 