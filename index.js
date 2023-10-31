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
                db.query(`Select department.id AS Department_ID, department.name AS department_name FROM department;`, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    startQuestions();
                })
            };
            if (response.Action === "View all roles") {
                db.query(`SELECT  roles.id AS Role_ID, roles.title AS Job_Title, department.name AS Department, roles.salary AS Salary
                FROM roles
                JOIN department ON roles.department_id = department.id;`, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    startQuestions();
                })
            }
            if (response.Action === "View all Employees") {
                db.query(`SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, 
                roles.title AS Job_Title, department.name AS Department, roles.salary AS Salary, m.first_name AS Manager
                FROM employee e
                 JOIN roles ON e.role_id = roles.id
                JOIN department ON roles.department_id = department.id
                LEFT JOIN employee m ON e.manager_id = m.id`, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    startQuestions();
                })
            }
            if (response.Action === "add a department") {
                inquirer
                    .prompt({
                        type: "input",
                        message: "Enter the name of the Department you would like to add:",
                        name: "addedDepartment"
                    })
                    .then((response) => {
                        db.query(`INSERT INTO department (name) VALUES (?)`, response.addedDepartment, (err, result) => {
                            if (err) {
                                console.log(err);
                                startQuestions();
                            }
                            console.log("affectedRows:", result.affectedRows);
                            startQuestions();
                        })
                    })
            }
            if (response.Action === "Add a role") {
                inquirer
                    .prompt([{
                        type: "input",
                        message: "Enter the name of the Role you would like to add:",
                        name: "Role"
                    },
                    {
                        type: "number",
                        message: "Enter the salary for this role:",
                        name: "salary"
                    },
                    {

                        type: "list",
                        message: "Please select the department that role belongs to",
                        // choices: 
                        name: "department"
                    }
                    ])
                    .then((response) => {
                        db.query(`SELECT id FROM department where name = ?`, response.department, (err, result) => {
                            db.query(`INSERT INTO department (title, salary, department_id) VALUES (?)`, response.Role, response.salary, result, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    startQuestions();
                                }
                                console.log("affectedRows:", result.affectedRows);
                                startQuestions();
                            })
                        })
                    })
            }
        })

}

startQuestions();



