const mysql = require('mysql2');
const inquirer = require('inquirer');

// add requires and sql connections for function

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
);

// promisify dbquery for role titles to adjust data to be useable in inquirer choices array

function getRolesArray() {
    return new Promise((resolve, reject) => {
        db.query("SELECT title FROM roles", (err, result) => {
            if (err) {
                reject(err)
            } else {
                const rolesArray = result.map(result => result.title);

                resolve(rolesArray)
            }
        })
    })
}

// promisify dbquery for employee first names to adjust data to be useable in inquirer choices array

function getFirstNameArray() {
    return new Promise((resolve, reject) => {
        db.query("SELECT first_name FROM employee", (err, result) => {
            if (err) {
                reject(err)
            } else {
                let nameArray = result.map(result => result.first_name);
                nameArray.push("none")
                resolve(nameArray)
            }
        })
    })
}

// add all into an async function to utilize await, use try...catch for errors

async function addEmployeeQuestions(funcparam) {
    try {
        const roleNames = await getRolesArray();
        const firstNames = await getFirstNameArray();
        const questions = [{
            type: "input",
            message: "Enter the first name of the employee:",
            name: "firstName"
        },
        {
            type: "input",
            message: "Enter the last name of the employee:",
            name: "lastName"
        },
        {

            type: "list",
            message: "Please select the department that role belongs to",
            choices: roleNames,
            name: "role"
        },
        {
            type: "list",
            message: "Please select the employees manager (if none, select none):",
            choices: firstNames,
            name: "manager"
        }

        ];

        const answers = await inquirer.prompt(questions);
        db.query(`SELECT id FROM roles WHERE title = ?`, answers.role, (err, completed) => {
            db.query(`SELECT id FROM employee WHERE employee.first_name = ?`, answers.manager, (error, res) => {
                
                // if the response selected is "none", disregard selecting its id and replace the res value with null to be inputted in next dbquery
                
                if (res.length === 0) {
                    res = [{ id: null }]
                }
                console.log(res)
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [answers.firstName, answers.lastName, completed[0].id, res[0].id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Success!", result);
                        funcparam();
                    }
                })
            })
        })
    } catch (err) {
        console.error('error', err)
    }
}

// export for use in index

module.exports = addEmployeeQuestions;