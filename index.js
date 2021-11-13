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
        'Add A Department Role', 'Add An Employee', 'Update Employee Role'],
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

            case 'Add A Department Role':
                console.log('Add A Department Role selecte\n')
                addDepartment();
                break;

            case 'Add An Employee':
                console.log('Add An Employee selected\n')
                addEmployee();
                break;

            case 'Update Employee Role':
                console.log('Update Employee Role selected\n')
                updateEmployee();
                break;
        }
    });
};

db.query("SELECT * from department", function (error, res) {
    showdepartments = res.map(dep => ({ name: dep.name, value: dep.id }))
  })

function addDepartment() {
    
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
    //let values = answers.departmentAdd;
    db.query({ 
        sql: 'INSERT INTO department (department_name) VALUES (?)',
        values: [answers.departmentAdd]
    },
        function (err, result) {
        if (err) throw err;
        console.log(`${answers.departmentAdd} has been added to department list`);
        startPrompt();
});
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
        message: (answers) => `Enter ${answers.firstName} ${answers.lastName}\'s department role number`,
        validate: function(role) {
            if (role) {
              return true;
            } else {
              return 'Please enter the employee\'s department role number';
            }
        }
    },

    //Employee manager id
    {
        name: 'manager_id',
        type: 'number',
        message: (answers) => `Enter ${answers.firstName} ${answers.lastName}\'s managers id number`,
        validate: function(manager_id) {
            if (manager_id) {
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
            values: [answers.firstName, answers.lastName, answers.role, answers.manager_id]
        },
            function (err, result) {
            if (err) throw err;
            console.log(`${answers.firstName} ${answers.lastName} has been added to employee list`);
            startPrompt();
    });
    })
    };

function updateEmployee() {
    
    //Select employee to update
    db.query('SELECT employee.first_name, employee.last_name, employee.role_id FROM employee', function (err, result) {
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
        .then((name)  => {
            db.query(`SELECT department_role.id, department_role.title FROM department_role`, function (err, result) {
                if (err) throw err;
                
                inquirer.prompt([
                    {
                        name: 'updateRole',
                        type: 'list',
                        message: `${name.employeeName}\'s new role: `,
                        choices: function() {
                            let roles = [];
                            result.forEach(res => {
                            roles.push(`${res.title}`);
                        })
                        return roles;
                    }
                }
                    ])
                    .then((answers)  => {
                        console.log(`${name.employeeName}\'s role has been updated to ${answers.updateRole}`);
                        db.query(`UPDATE employee SET WHERE employee.role_id = ${answers.updateRole} && CONCAT(employee.first_name, ,employee.last_name) = ${name.employeeName}`, function (err, result) {
                            if (err) throw err;
                        });
                    });
                });
        });
    });
}

function updateRole(answers) {
    db.query(`SELECT department_role.title FROM department_role`, function (err, result) {
        if (err) throw err;
        
        inquirer.prompt([
            {
                name: 'updateRole',
                type: 'list',
                message: `${answers}\'s new role: `,
                choices: function() {
                    let roles = [];
                    result.forEach(res => {
                    roles.push(`${res.title}`);
                })
                return roles;
            }
        }
            ])
            .then((answers)  => {
                console.log(`${name}\'s role has been updated to ${answers.updateRole}`);
                //db.query(`UPDATE employee SET WHEN ${name.role_id} != ${answers.updateRole}`)
                //db.query(` UPDATE employee SET role_id = ${answers.updateRole} WHERE employee.id = ${name.id}`)
                
            });
        });
    }

    function getId(name) {
        let getId = db.query(`SELECT * FROM employee WHEN LIKE employee.first_name && employee.last_name = ${name}`, function (err, result) {
            if (err) throw err;
            console.log(result)
        });
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
        console.table(result);
 
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
        console.table(result);
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