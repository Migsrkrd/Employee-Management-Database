USE company_db;

-- sample inserts

INSERT INTO department (name)
VALUES ("Engineering"),
        ("Finance"),
        ("legal"),
        ("Accounting"),
        ("IT"),
        ("Office Management"),
        ("Sales");

INSERT INTO roles(title, salary, department_id)
VALUES ("sales Lead", 100000, 7),
        ("Cash Flows",90000 ,2 ),
        ("CopyWriter",100000 ,3 ),
        ("Computer Support",80000 ,5 ),
        ("Accounts Payable",90000 ,4 ),
        ("Reception", 70000, 6),
        ("Salesperson", 80000, 7);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Steve", "Smith", 1, null),
        ("Lisa", "North", 2, null),
        ("Will", "Hacket", 3, null),
        ("Mandy", "Simpson", 5, null),
        ("Walder", "Frey", 4, null),
        ("Brock", "Purdy", 6, 5),
        ("Rachel", "Green", 1, null),
        ("Matt", "Wilks", 7, 1);
