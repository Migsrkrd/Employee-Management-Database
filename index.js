const mysql = require('mysql2');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);


function startQuestions() {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all Employees", "add a department", "Add a role", "Add an employee", "Update an employee role"],
            name: "Action"

        })
        .then((response) => {
            console.log(response);
            if (response.Action === "View all departments") {
                db.query("SELECT * FROM department", function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    startQuestions();
                })
            };
            if (response.Action === "View all roles") {
                db.query("SELECT * FROM roles", function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    startQuestions();
                })
            }
            if (response.Action === "View all Employees") {
                db.query("SELECT * FROM employee", function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    startQuestions();
                })
            }
        })

}

startQuestions();



