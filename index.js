//Get all needed requirements
const inquirer = require('inquirer');
require('dotenv').config()
const fs = require('fs');
const cTable = require('console.table');

//const generateDATABASE = require('./generateDATABASE');

const mysql = require('mysql2');

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
        values: answers.departmentAdd
    },
        function (err, result) {
        if (err) throw err;
        console.log(`${answers.departmentAdd} has been added to department list`);
        startPrompt();
});
})
};

function AddEmployee() {
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
        type: 'input',
        message: (answers) => `Enter ${answers.firstName} ${answers.lastName}\'s department role`,
        validate: function(role) {
            if (role) {
              return true;
            } else {
              return 'Please enter the employee\'s department role';
            }
        }
    },

    //Employee manager id
    {
        name: 'manager_id',
        type: 'number',
        message: (answers) => `Enter ${answers.firstName} ${answers.lastName}\'s manager id`,
        validate: function(manager_id) {
            if (manager_id) {
              return true;
            } else {
              return 'Please enter the employee\'s manager id';
            }
        }
    }, 
    ])

    .then((answers) => {
        db.query(`INSERT INTO `)
        //const manager = new Manager(answers.name, answers.id ,answers.email, answers.officeNumber);
        //employeeTeam.push(manager);
        startPrompt();
    });
}

function viewDepartments() {
    //query to get all departments
    db.query('SELECT department.id As id, department.department_name As Departments FROM department', function (err, result) {
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
        /*result.forEach(res => {
            console.log(`${res.title} | $${res.salary} | ${res.department_id}`);
        });*/
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



/*function confirmTeam() {
    console.log (`You have ${employeeTeam.length} member/s in your team`);
    //print team members
    console.log('Your Team Consists Of: ')

    employeeTeam.forEach(member => {
        console.log(member);
    })

    console.log(`
                                        Finished!
  
                              Successfully created team profile`
    );
    fs.writeFileSync('example-index.html', generateDATABASE(employeeTeam)), (err) => console.error(err);
}

const generateDB = (employeeTeam) => {
Insert answers to table fields here
};*/

const init = () => {
    console.log(`
                ____________________EMPLOYEE TRACKER______________________
  
                    An easy way to manage employee data
                    
                    `)
      startPrompt()
};
 
init();