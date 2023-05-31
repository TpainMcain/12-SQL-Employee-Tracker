// Import the required modules
const inquirer = require('inquirer');
const db = require('./config/connection');

// Validate user input function
function validateInput(errorMessage) {
    return input => {
        if (input) {
            return true;
        } else {
            console.log(errorMessage);
            return false;
        }
    };
}

// Start the server after connecting to the DB
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    startEmployeeTracker();
});

// Primary function to manage employees
function startEmployeeTracker() {
    // Provide user with action options
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View All Department', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    })
    .then(handleUserResponse);
}

// Handle user's response to prompt
function handleUserResponse(answer) {
    switch (answer.action) {
        case 'View All Department':
            return viewAll('department');
        case 'View All Roles':
            return viewAll('role');
        case 'View All Employees':
            return viewAll('employee');
        case 'Add A Department':
            return addDepartment();
        case 'Add A Role':
            return addRole();
        case 'Add An Employee':
            return addEmployee();
        case 'Update An Employee Role':
            return updateEmployeeRole();
        case 'Log Out':
            return logout();
    }
}

// View all items in the specified table
function viewAll(table) {
    const query = `SELECT * FROM ${table}`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log(`Viewing All ${table}:`);
        console.table(result);
        startEmployeeTracker();
    });
}

// Add a new department to the department table
function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?',
        validate: departmentInput => {
            if (departmentInput) {
                return true;
            } else {
                console.log('Please Add A Department!');
                return false;
            }
        }
    })
    .then(answer => {
        const query = `INSERT INTO department (name) VALUES (?)`;
        db.query(query, [answer.department], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answer.department} to the database.`);
            startEmployeeTracker();
        });
    });
}

// Add a new role to the role table
function addRole() {
    const query = `SELECT * FROM department`;
    db.query(query, (err, departments) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
                validate: validateInput('Please add a role!')
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: validateInput('Please add a salary!')
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: departments.map(department => department.name)
            }
        ])
        .then(answer => {
            const department = departments.find(dept => dept.name === answer.department);

            const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            db.query(query, [answer.role, answer.salary, department.id], (err, result) => {
                if (err) throw err;
                console.log(`Added ${answer.role} to the database.`);
                startEmployeeTracker();
            });
        });
    });
}

// Add a new employee to the employee table
function addEmployee() {
    const query = `SELECT * FROM role`;
    db.query(query, (err, roles) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the employees first name?',
                validate: validateInput('Please add a first name!')
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the employees last name?',
                validate: validateInput('Please add a last name!')
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employees role?',
                choices: roles.map(role => role.title)
            },
            {
                type: 'input',
                name: 'manager',
                message: 'Who is the employees manager?',
                validate: validateInput('Please add a manager!')
            }
        ])
        .then(answer => {
            const role = roles.find(r => r.title === answer.role);

            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            db.query(query, [answer.firstName, answer.lastName, role.id, answer.manager], (err, result) => {
                if (err) throw err;
                console.log(`Added ${answer.firstName} ${answer.lastName} to the database.`);
                startEmployeeTracker();
            });
        });
    });
}

// Update the role of an existing employee
function updateEmployeeRole() {
    const query = `SELECT * FROM employee`;
    db.query(query, (err, employees) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employees role do you want to update?',
                choices: employees.map(employee => employee.last_name)
            },
            {
                type: 'input',
                name: 'role',
                message: 'What is their new role?',
                validate: validateInput('Please add a role!')
            }
        ])
        .then(answer => {
            const employee = employees.find(emp => emp.last_name === answer.employee);

            const query = `UPDATE employee SET ? WHERE ?`;
            db.query(query, [{ role_id: answer.role }, { id: employee.id }], (err, result) => {
                if (err) throw err;
                console.log(`Updated ${answer.employee}'s role in the database.`);
                startEmployeeTracker();
            });
        });
    });
}

// Exit the application
function logout() {
    db.end();
    console.log("Good-Bye!");
}


