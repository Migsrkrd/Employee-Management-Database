const mysql = require('mysql2');
const inquirer = require('inquirer');
const addRoleQuestions = require('./roleQuestions')
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

// function getDepartmentArray() {
//     return new Promise((resolve, reject) => {
//         db.query("SELECT name FROM department", (err, result) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 const departmentsArray = result.map(result => result.name);

//                 resolve(departmentsArray)
//             }
//         })
//     })
// }

// async function addRoleQuestions() {
//     try {
//         const departmentNames = await getDepartmentArray();
//         const questions = [{
//             type: "input",
//             message: "Enter the name of the Role you would like to add:",
//             name: "Role"
//         },
//         {
//             type: "number",
//             message: "Enter the salary for this role:",
//             name: "salary"
//         },
//         {

//             type: "list",
//             message: "Please select the department that role belongs to",
//             choices: departmentNames,
//             name: "department"
//         }];

//         const answers = await inquirer.prompt(questions);

//         db.query(`SELECT id FROM department WHERE department.name = ?`, answers.department, (error, res) => {
//             if (error) {
//                 console.error(error)
//             } else {
//                 db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, [answers.Role, answers.salary, res[0].id], (err, result) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         console.log("Success!");
//                         startQuestions();
//                     }
//                 })
//             }
//         })
//     } catch (err) {
//         console.error('error', err)
//     }
// }

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

async function addEmployeeQuestions() {
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
                if (res.length === 0) {
                    res = [{ id: null }]
                }
                console.log(res)
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [answers.firstName, answers.lastName, completed[0].id, res[0].id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Success!", result);
                        startQuestions();
                    }
                })
            })
        })
    } catch (err) {
        console.error('error', err)
    }
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

async function updateEmployeeQuestions() {
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
                    startQuestions();
                }
            })
        })
    } catch (err) {
        console.error('error', err)
    }
}


function startQuestions() {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all Employees", "add a department", "Add a role", "Add an employee", "Update an employee role"],
            name: "Action"

        })
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
                addRoleQuestions(startQuestions);
                
            }
            if (response.Action === "Add an employee") {
                addEmployeeQuestions();
            }
            if (response.Action === "Update an employee role"){
                updateEmployeeQuestions();

            }
        })

}

startQuestions();



