DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    cost DECIMAL(10,2) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT(10) NULL,
    product_sales DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NULL,
    over_head_costs DECIMAL(10,2) DEFAULT 0.00,
    product_sales DECIMAL(10,2) DEFAULT 0.00,
    total_profit DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_costs, product_sales, total_profit)
VALUES ("Electronics",1000.00,0.00,0.00);

INSERT INTO departments (department_name, over_head_costs, product_sales, total_profit)
VALUES ("Packaging Supplies",1000.00,0.00,0.00);

INSERT INTO departments (department_name, over_head_costs, product_sales, total_profit)
VALUES ("Toys & Games",1000.00,0.00,0.00);

INSERT INTO departments (department_name, over_head_costs, product_sales, total_profit)
VALUES ("Furniture",1000.00,0.00,0.00);

INSERT INTO departments (department_name, over_head_costs, product_sales, total_profit)
VALUES ("Home Security",1000.00,0.00,0.00);

INSERT INTO departments (department_name, over_head_costs, product_sales, total_profit)
VALUES ("Kitchen",1000.00,0.00,0.00);

INSERT INTO departments (department_name, over_head_costs, product_sales, total_profit)
VALUES ("Lawn & Garden",1000.00,0.00,0.00);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("iPhone 11 Pro 256 GB","Electronics",1050.00,1149.00,1000);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("Duct Tape","Packaging Supplies",2.50,3.34,10000);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("Magic: The Gathering Throne of Eldraine Booster Pack","Toys & Games",3.25,3.75,100000);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("Sony XBR-65A9G 65 Inch TV","Electronics",2785.00,3498.00,10);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("Modern Linen Fabric Futon Sectional Sofa","Furniture",400.17,449.99,3);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("Sauder Dakota Pass Lift-Top Coffee Table","Furniture",85.00,125.40,7);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("Fallout 76","Toys & Games",40.00,15.75,100000000);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("Ring Peephole Cam - Smart video doorbell","Home Security",101.05,199.00,100);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("Instant Pot DUO60 6 Qt","Kitchen",64.99,79.00,65);

INSERT INTO products (product_name, department_name, cost, price, stock_quantity)
VALUES ("WORX WR150 Landroid L 20V Robotic Lawn Mower","Lawn & Garden",995.14,1199.00,6);