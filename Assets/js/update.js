const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
);

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

module.exports = updateEmployeeQuestions;