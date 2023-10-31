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

// promisify dbquery for employee IDs to adjust data to be useable in inquirer choices array

function getEmployeeIdArray() {
    return new Promise((resolve, reject) => {
        db.query("SELECT id FROM employee", (err, result) => {
            if (err) {
                reject(err)
            } else {
                const idArray = result.map(result => result.id);

                resolve(idArray)
            }
        })
    })
}

// add all into an async function to utilize await, use try...catch for errors

async function updateEmployeeQuestions(funcparam) {
    try {
        const roleNames = await getRolesArray();
        const employeeIds = await getEmployeeIdArray();
        const questions = [{
            type: "list",
            message: "Select the ID of your emplyee, if you dont know it, look at the employee table:",
            choices: employeeIds,
            name: "employeeID"
        },
        {
            type: "list",
            message: "Select the new role for your employee:",
            choices: roleNames,
            name: "role"
        }

        ];

        const answers = await inquirer.prompt(questions);

// Use awaited data in dbquery to produce function

        db.query(`SELECT id FROM roles WHERE title = ?`, answers.role, (err,result) =>{
            if (err){
                console.error(err);
            }
            db.query(`UPDATE employee SET role_id = ? WHERE id = ?`,[result[0].id, answers.employeeID], (err,res) => {
                if (err){
                    console.error(err);
                } else {
                    console.log('Success!', res);
                    funcparam();
                }
            })
        })
    } catch (err) {
        console.error('error', err)
    }
}

// export for use in index

module.exports = updateEmployeeQuestions;