const mysql = require('mysql2');
const inquirer = require('inquirer');
const addRoleQuestions = require('./Assets/js/roleQuestions')
const addEmployeeQuestions = require('./Assets/js/employeeQuestions')
const updateEmployeeQuestions = require('./Assets/js/update')
const PORT = process.env.PORT || 3001;

// connect to mysql

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

// looping function to loop inquirer

function startQuestions() {

// inquirer questions

    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all Employees", "add a department", "Add a role", "Add an employee", "Update an employee role"],
            name: "Action"
        })

// db query to view all departments and restart inquirer

        .then((response) => {
            if (response.Action === "View all departments") {
                db.query(`Select department.id AS Department_ID, department.name AS department_name FROM department;`, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    startQuestions();
                })
            };

// db query to view all roles with joined data and restart inquirer

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

// db query to view all employee with joined data and restart inquirer

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

// add in exported function from roleQuestions file in js folder

            if (response.Action === "Add a role") {
                addRoleQuestions(startQuestions);
            }

// add in exported function from employeeQuestions file in js folder

            if (response.Action === "Add an employee") {
                addEmployeeQuestions(startQuestions);
            }

// add in exported function from update file in js folder

            if (response.Action === "Update an employee role") {
                updateEmployeeQuestions(startQuestions);
            }
        })
}

startQuestions();



