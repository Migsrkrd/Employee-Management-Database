USE company_db;

Select department.id AS Department_ID, department.name AS department_name FROM department;

SELECT  roles.id AS Role_ID, roles.title AS Job_Title, department.name AS Department, roles.salary AS Salary
FROM roles
JOIN department ON roles.department_id = department.id;


SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, 
       roles.title AS Job_Title, department.name AS Department, roles.salary AS Salary, m.first_name AS Manager
FROM employee e
JOIN roles ON e.role_id = roles.id
JOIN department ON roles.department_id = department.id
LEFT JOIN employee m ON e.manager_id = m.id


