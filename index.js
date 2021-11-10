//Get all needed requirements
const inquirer = require('inquirer');
require('dotenv').config()
const fs = require('fs');
const generateDATABASE = require('./generateDATABASE');

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

const employeeTeam = [];

/*Need to start prompts with selector with all depts, all roles, 
all employees, add ept, add role, add employee and update role*/

function startPrompt() {
    inquirer.prompt([
    {
        name: 'options',
        type: 'list',
        message: 'I would like to: ',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 
        'Add A Role', 'Add A Employee', 'Update Employee Role'],
    },
    ])

    .then((answers) => { //convert to switch statement
        if(answers.options === 'View All Departments') {
            console.log('View All Departments selected')
            viewDepartments();
            return;

        } else if(answers.options === 'View All Roles') {
            console.log('View All Roles selected')
            viewRoles();
            return;

        } else if(answers.options === 'View All Employees') {
            console.log('View All Employees selected')
            viewEmployees();
            return;
        } //other options
    });
};

function addDepartment() {
        inquirer.prompt([
            //Department name
        {
        name: 'departmentName',
        type: 'input',
        message: 'Enter the department name you want to add',
        validate: function(departmentName) {
            if (departmentName) {
                return true;
            } else {
                return 'Please enter the department name you want to add';
            }
        }
    },
    ]);
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
        message: 'Enter the team manager\'s name',
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
        //const manager = new Manager(answers.name, answers.id ,answers.email, answers.officeNumber);
        //employeeTeam.push(manager);
        startPrompt();
    });
}

function viewDepartments() {
    //query to get all departments
    db.query('SELECT*FROM department', function (err, result) {
        if (err) throw err;
        console.log(result);
        startPrompt();
    });
}

function viewRoles() {
    //query to get all roles
    db.query('SELECT*FROM department_role', function (err, result) {
        if (err) throw err;
        console.log(result);
        startPrompt();
    });
}

function viewEmployees() {
    //query to get all employees
    db.query('SELECT*FROM employee', function (err, result) {
        if (err) throw err;
        console.log(result);
        startPrompt();
    });
}

function confirmTeam() {
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
/*Insert answers to table fields here*/
};

const init = () => {
    console.log(`
                ____________________EMPLOYEE TRACKER______________________
  
                    An easy way to manage employee data
                    
                    `)
      startPrompt()
};
 
init();