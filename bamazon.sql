DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT(10) NULL,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone 11 Pro 256 GB","Electronics",1149.00,1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Duct Tape","Packaging Supplies",3.34,10000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Magic: The Gathering Throne of Eldraine Booster Pack","Toys & Games",3.75,100000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sony XBR-65A9G 65 Inch TV","Electronics",3498.00,10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Modern Linen Fabric Futon Sectional Sofa","Furniture",449.99,3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sauder Dakota Pass Lift-Top Coffee Table","Furniture",125.40,7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fallout 76","Toys & Games",15.75,100000000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ring Peephole Cam - Smart video doorbell","Home Secuirty",199.00,100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Instant Pot DUO60 6 Qt","Kitchen",79.00,65);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("WORX WR150 Landroid L 20V Robotic Lawn Mower","Lawn & Garden",1199.00,6);