-- Schema File -- 
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department_role (
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(50) NOT NULL,
salary  INT NOT NULL,
department_id  INT,
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE SET NULL,
PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR(40) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id)
  REFERENCES department_role(id)
  ON DELETE SET NULL,
  manager_id INT
);