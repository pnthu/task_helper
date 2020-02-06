const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'huutoan99!',
    database: 'task_helper',
})

module.exports = connection