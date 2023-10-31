DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;


-- create table department and add values
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT NOT NULL auto_increment PRIMARY KEY,
    name VARCHAR(30)
);

-- create table roles and add values
DROP TABLE IF EXISTS roles;
CREATE TABLE roles(
id INT NOT NULL auto_increment PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE CASCADE
);

-- create table employee and add values
DROP TABLE IF EXISTS employee;
CREATE TABLE employee(
id INT NOT NULL auto_increment PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT Null,
FOREIGN KEY (role_id)
REFERENCES roles(id)
ON DELETE SET NULL
);