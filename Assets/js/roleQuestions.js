const mysql = require('mysql2');
const inquirer = require('inquirer');

// add requires and sql connections for function

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    }
);

// promisify dbquery for department names to adjust data to be useable in inquirer choices array

function getDepartmentArray() {
    return new Promise((resolve, reject) => {
        db.query("SELECT name FROM department", (err, result) => {
            if (err) {
                reject(err)
            } else {
                const departmentsArray = result.map(result => result.name);

                resolve(departmentsArray)
            }
        })
    })
}

// add all into an async function to utilize await, use try...catch for errors

async function addRoleQuestions(funcparam) {
    try {
        const departmentNames = await getDepartmentArray();
        const questions = [{
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
            choices: departmentNames,
            name: "department"
        }];

        const answers = await inquirer.prompt(questions);

// Use awaited data in dbquery to produce function
   
        db.query(`SELECT id FROM department WHERE department.name = ?`, answers.department, (error, res) => {
            if (error) {
                console.error(error)
            } else {
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, [answers.Role, answers.salary, res[0].id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Success!");
                        funcparam();
                    }
                })
            }
        })
    } catch (err) {
        console.error('error', err)
    }
}

// export for use in index

module.exports = addRoleQuestions;