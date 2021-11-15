//Get all needed requirements
const inquirer = require('inquirer');
require('dotenv').config()
const fs = require('fs');
const cTable = require('console.table');

//const generateDATABASE = require('./generateDATABASE');

const mysql = require('mysql2');
const { getPriority } = require('os');

// Connect to database
const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

/*Need to start prompts with selector with all depts, all roles, 
all employees, add ept, add role, add employee and update role*/

function startPrompt() {
    inquirer.prompt([
    {
        name: 'options',
        type: 'list',
        message: 'I would like to: ',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 
        'Add A Department', 'Add A Department Role', 'Add An Employee', 'Delete An Employee', 'Delete A Department', 'Delete A Department Role', 'Update Employee Role', 'Return To Menu', "Exit"],
    },
    ])

    .then((answers) => { //convert to switch statement
        let option = answers.options
        switch (option) {
            case 'View All Departments':
                console.log('View All Departments selected\n')
                viewDepartments();
                break;

            case 'View All Roles':
                console.log('View All Roles selected\n')
                viewRoles();
                break;

            case 'View All Employees':
                console.log('View All Employees selected\n')
                viewEmployees();
                break;

            case 'Add A Department':
                console.log('Add A Department selected\n')
                addDepartment();
                break;

            case 'Add A Department Role':
                console.log('Add A Department Role selected\n')
                addDepartmentRole();
                break;

            case 'Add An Employee':
                console.log('Add An Employee selected\n')
                addEmployee();
                break;

            case 'Delete An Employee':
                console.log('Delete An Employee selected\n')
                deleteEmployee();
                break;

            case 'Delete A Department':
                console.log('Delete A Department selected\n')
                deleteDepartment();
                break;

            case 'Delete A Department Role':
                console.log('Delete A Department Role selected\n')
                deleteDepartmentRole();
                break;

            case 'Update Employee Role':
                console.log('Update Employee Role selected\n')
                updateRole();
                break;

            case 'Return To Menu':
                console.log('Return To Menu selected\n')
                startPrompt()
                break;

            case 'Exit':
                console.log('Exit selected\n')
                db.end();
                break;
        }
    });
};

function addDepartment() {
    
    db.query('SELECT department.id As id, department.department_name As Departments FROM department', function (err, result) {
        if (err) throw err;
        console.table(result);

    inquirer.prompt([
    {
    name: 'departmentAdd',
    type: 'input',
    message: 'Enter the department name you want to add',
    validate: function(departmentAdd) {
        if (departmentAdd) {
            return true;
        } else {
            return 'Please enter the department name you want to add';
        }
    }
},
])
.then((answers) => { 
    db.query({ 
        sql: 'INSERT INTO department (department_name) VALUES (?)',
        values: [answers.departmentAdd]
    },
        function (err, result) {
        if (err) throw err;
        console.log(`${answers.departmentAdd} has been added to department list\n`);
        startPrompt();
});
});
})
}

function addDepartmentRole() {

    db.query(`SELECT department_role.title As Job_Title, 
    department_role.id As role_id, 
    department.department_name As Department, 
    department_role.salary As Salary FROM department_role 
    INNER JOIN department ON department_role.department_id = department.id`, function (err, result) {
        if (err) throw err;
        console.table(result);
    });

        db.query('SELECT department.id As id, department.department_name As Departments FROM department', function (err, result) {
            if (err) throw err;
            console.table(result);

    inquirer.prompt([
        //role name
    {
        name: 'roleTitle',
        type: 'input',
        message: 'Enter the role title',
        validate: function(roleTitle) {
            if (roleTitle) {
              return true;
            } else {
              return 'Please enter the role title';
            }
        }
    },

    //salary
    {
        name: 'roleSalary',
        type: 'input',
        message: 'Enter the role salary: $',
        validate: function(roleSalary) {
            if (roleSalary) {
                return true;
            } else {
                return 'Please enter the role salary';
            }
        }
    },

     //department id
     {
        name: 'deptid',
        type: 'number',
        message: (answers) => `Enter the ${answers.roleTitle} department id number`,
        validate: function(deptid) {
            if (deptid) {
              return true;
            } else {
              return 'Please enter the role department id number';
            }
        }
    },
    ])

    .then((answers) => {
        db.query({ 
            sql: 'INSERT INTO department_role (title, salary, department_id) VALUES (?,?,?)',
            values: [answers.roleTitle, answers.roleSalary, answers.deptid]
        },
            function (err, result) {
            if (err) throw err;
            console.log(`${answers.roleTitle} has been added to department list\n`);
            startPrompt();
    });
    })
    })
    };

function addEmployee() {
    inquirer.prompt([
        //Employee name
    {
        name: 'firstName',
        type: 'input',
        message: 'Enter the employee\'s first name',
        validate: function(firstName) {
            if (firstName) {
              return true;
            } else {
              return 'Please enter the employee\'s first name';
            }
        }
    },

    //Employee name
    {
        name: 'lastName',
        type: 'input',
        message: 'Enter the employee\'s last name',
        validate: function(lastName) {
            if (lastName) {
                return true;
            } else {
                return 'Please enter the employee\'s last name';
            }
        }
    },

     //Employee role
     {
        name: 'role',
        type: 'number',
        message: (answers) => `Enter ${answers.firstName} ${answers.lastName}\'s department role id number`,
        validate: function(role) {
            if (role) {
              return true;
            } else {
              return 'Please enter the employee\'s department role id number';
            }
        }
    },

    //Employee manager id
    {
        name: 'managerid',
        type: 'number',
        message: (answers) => `Enter ${answers.firstName} ${answers.lastName}\'s managers id number`,
        validate: function(managerid) {
            if (managerid) {
              return true;
            } else {
              return 'Please enter the employee\'s manager id number';
            }
        }
    }, 
    ])

    .then((answers) => {
        db.query({ 
            sql: 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
            values: [answers.firstName, answers.lastName, answers.role, answers.managerid]
        },
            function (err, result) {
            if (err) throw err;
            console.log(`${answers.firstName} ${answers.lastName} has been added to employee list\n`);
            startPrompt();
    });
    })
    };

function updateRole() {
    
    db.query(`SELECT employee.first_name, employee.last_name FROM employee`, function (err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: 'Update employee details for: ',
                choices: function() {
                    let employees = [];
                    result.forEach(res => {
                    employees.push(`${res.first_name} ${res.last_name}`);
                });
                return employees;
            }
        }
        ])
    .then((getname)  => {
        db.query(`SELECT department_role.title As Job_Title, 
    department_role.id As role_id, 
    department.department_name As Department, 
    department_role.salary As Salary FROM department_role 
    INNER JOIN department ON department_role.department_id = department.id`, function (err, result) {
        if (err) throw err;
        console.table(result);
    });

    db.query(`SELECT department_role.title, department_role.id FROM department_role`, function (err, result) {
        if (err) throw err;
        
        inquirer.prompt([
            {
                name: 'roleName',
                type: 'list',
                message: `What is ${getname.employeeName}\'s new role_id number: `,
                choices: function() {
                    let roles = [];
                    result.forEach(res => {
                    roles.push(`${res.id}`);
                });
                return roles;
            }
        }
        ])
            .then((answers)  => {
                db.query(`UPDATE employee SET role_id = ${answers.roleName} WHERE CONCAT(employee.first_name, ' ', employee.last_name) LIKE '%${getname.employeeName}%'`, function (err, result) {
                    if (err) throw err;
                    console.log(`${getname.employeeName}\'s role has been updated to ${answers.roleName}\n`);
                    startPrompt();
                }); 
            });
        });
    })
});
}

function deleteDepartment() {
    db.query('SELECT department.id As id, department.department_name As Departments FROM department', function (err, result) {
        if (err) throw err;
        console.table(result);

    inquirer.prompt([
    {
    name: 'departmentDelete',
    type: 'number',
    message: 'Enter the department id number you want to delete',
    validate: function(departmentAdd) {
        if (departmentAdd) {
            return true;
        } else {
            return 'Please enter the department id you want to delete';
        }
    }
},
])
.then((answers) => { 
    db.query(`DELETE FROM department WHERE department.id = '${answers.departmentDelete}'`, function (err, result) {
        if (err) throw err;
        console.log(`Department id ${answers.departmentDelete} has been deleted from department list\n`);
        startPrompt();
});
});
})
}

function deleteDepartmentRole() {
    db.query(`SELECT department_role.title As Job_Title, 
    department_role.id As role_id, 
    department_role.salary As Salary FROM department_role`, function (err, result) {
        if (err) throw err;
        console.table(result);

    inquirer.prompt([
    {
    name: 'departmentRoleDelete',
    type: 'number',
    message: 'Enter the department role id number you want to delete',
    validate: function(departmentRoleDelete) {
        if (departmentRoleDelete) {
            return true;
        } else {
            return 'Please enter the department role id you want to delete';
        }
    }
},
])
.then((answers) => { 
    db.query(`DELETE FROM department_role WHERE department_role.id = '${answers.departmentRoleDelete}'`, function (err, result) {
        if (err) throw err;
        console.log(`Department id ${answers.departmentRoleDelete} has been deleted from department role list\n`);
        startPrompt();
});
});
})
}


function deleteEmployee() {
    db.query(`SELECT employee.first_name, employee.last_name FROM employee`, function (err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: 'Select employee record to remove: ',
                choices: function() {
                    let employees = [];
                    result.forEach(res => {
                    employees.push(`${res.first_name} ${res.last_name}`);
                });
                return employees;
            }
        }
        ])
        .then ((answers) => {
            db.query(`DELETE FROM employee WHERE CONCAT(employee.first_name, ' ', employee.last_name) LIKE '%${answers.employeeName}%'`, function (err, result) {
                if (err) throw err;
                console.log(`Deleted ${answers.employeeName} from employee table\n`)
                startPrompt();
        })
    })
})
}

function viewDepartments() {
    //query to get all departments
    db.query('SELECT department.id As id, department.department_name As Departments FROM department', function (err, result) {
        if (err) throw err;
        console.table(result);
        startPrompt();
    });
}

function viewRoles() {
    //query to get all roles
    db.query(`SELECT department_role.title As Job_Title, 
    department_role.id As role_id, 
    department.department_name As Department, 
    department_role.salary As Salary FROM department_role 
    INNER JOIN department ON department_role.department_id = department.id`, function (err, result) {
        if (err) throw err;
        console.table(result,'\n');
 
        startPrompt();
    });
}

function viewEmployees() {
    //query to get all employees
    db.query(`SELECT employee.id As id, employee.first_name, employee.last_name, 
    department_role.title As Job_Title,
    department.department_name As Department,
    department_role.salary As Salary,
    CONCAT (m.first_name,' ',m.last_name) As Manager
    FROM employee

    LEFT JOIN department_role ON employee.role_id = department_role.id
    INNER JOIN department ON department_role.department_id = department.id
    LEFT JOIN employee m ON m.id = employee.manager_id`, function (err, result) {
        if (err) throw err;
        console.table(result,'\n');
        startPrompt();
    });
}

const init = () => {
    console.log(`
                ____________________EMPLOYEE TRACKER______________________
  
                           An easy way to manage employee data
                    
                    `)
      startPrompt()
};
 
init();