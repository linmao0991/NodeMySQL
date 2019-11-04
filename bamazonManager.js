const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    displayInventory();
});

function userPrompt(){
    inquirer.prompt([
        {
            type: "list",
            name: "customerPrompt",
            message: "What would you like to do?",
            choices: [
                "Display All Inventory",
                "Display Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    ]).then(function(ans){
        switch(ans.customerPrompt){
            case "Display Low Inventory":
                displayLowInventory();
                break;
            case "Display All Inventory":
                displayInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct()
                break;
            case "Exit":
                console.log("Good Bye.");
                process.exit();
                break;
        }
    });
}

function addNewProduct(){
    inquirer.prompt([
        {
            type: "input",
            name: "productname",
            message: "Please enter in product name: ",
        },
        {
            type: "input",
            name: "department",
            message: "Please enter department: "
        },
        {
            type: "input",
            name: "price",
            message: "Please enter price of item: ",
            validate: function(value){
                if( isNaN(value) === false && value > 0){
                    return true;
                }
                console.log("\nPlease enter price as a NUMBER above 0");
                return false;
            }
        },
        {
            type: "input",
            name: "stock",
            message: "Please enter the quantity of stock: ",
            validate: function(value){
                if( isNaN(value) === false && value > 0){
                    return true;
                }
                console.log("\nPlease enter stock as a NUMBER above 0");
                return false;
            }
        }
    ]).then(function(ans){
        let product = ans.productname;
        let department = ans.department;
        let price = ans.price;
        let stock = ans.stock;
        console.log("--------------------------");
        console.log("--------Add Product-------");
        console.log("--------------------------");
        console.log("Product Name: "+product);
        console.log("Department: "+department);
        console.log("Price: "+price);
        console.log("Stock: "+stock);
        inquirer.prompt([
            {
                type: "confirm",
                name: "addConfirm",
                message: "Do you want to add the above item to the inventory?"
            }
        ]).then(function (ans){
            if (ans.addConfirm === true){
                connection.query(
                    "INSERT products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)",
                    [product,department,price,stock],
                    function(err, res){
                        if(err) throw err;
                        console.log("---------Add new product: Complete---------");
                        userPrompt(); 
                });
            }else{
                console.log("---------Add new product: Cancelled---------")
                userPrompt();
            }
        });
    });
}

function addInventory(){
    inquirer.prompt([
        {
            type: "input",
            name: "itemid",
            message: "Please enter an item id:",
            validate: function(value){
                if( isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Please enter quantity to add to inventory:",
            validate: function(value){
                if( isNaN(value) === false){
                    return true
                }
                return false;
            }
        }
    ]).then(function(ans){
        let itemid = ans.itemid;
        let quantity = ans.quantity;
        console.log("Before sql query");
        connection.query(
            "SELECT * FROM products WHERE item_id = ?",
            [itemid],
            function(err, res){
                if(err) throw err;
                console.log("--------------------------");
                console.log("-----Update Inventory-----");
                console.log("--------------------------");
                console.log("Item ID: "+res[0].item_id);
                console.log("Product Name: "+res[0].product_name);
                console.log("Current Inventory: "+res[0].stock_quantity);
                console.log("Quantity to add: "+quantity);
                inquirer.prompt([
                    {
                        type: "confirm",
                        name: "confirmInventory",
                        message: "Do you want to confirm inventory update?"
                    }
                ]).then(function(ans){
                    if( ans.confirmInventory === false){
                        userPrompt();
                    }else if( ans.confirmInventory === true){
                        let productInfo = new productData(res[0].item_id, res[0].product_name, res[0].department_name, res[0].price, res[0].stock_quantity);
                        productInfo = new Array(productInfo);
                        updateInventory(productInfo, quantity).then(function(success){
                            console.log(success);
                            userPrompt();
                        }).catch(function(err){
                            console.log("----------Update Incomplete: Error----------");
                            throw err;
                        })
                    }else{
                        userPrompt();
                    }
                })
            }
        );
    });
}

function productData( itemid, productname, department, price, quantity){
    this.item_id = itemid;
    this.product_name = productname;
    this.department_name = department;
    this.price = price;
    this.stock_quantity = quantity;
}


function updateInventory(data, quantity){
    let itemInfo = data;
    return new Promise(function(reslove, reject){
        connection.query(
            "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
            [quantity, itemInfo[0].item_id],
            function (err){
                if(err) return reject(err);
                return reslove("----------Update Complete----------");
            });
    });
}

function displayLowInventory(){
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        function (err, res){
            if(err) throw err;
            console.log("----------------------------------------------");
            console.log("----------Products with low inventory---------");
            console.log("----------------------------------------------");
            displayItems(res);
            userPrompt();
        }
    )
}

function displayInventory(){
    connection.query(
        "SELECT * FROM products",
        function(err, res){
            if(err) throw err;
            displayItems (res);
            userPrompt();
        }
    )
}

function spaceFinder(x){
    let spaceCount = x;
    let spaceString = "";
    for (let i = 0; i <= spaceCount; i++){
        spaceString = spaceString+" ";
    }
    return spaceString;
}

function dashFinder(x){
    let dashCount = x;
    let dashString = "";
    for (let i = 0; i <= dashCount; i++){
        dashString = dashString+"-";
    }
    return  dashString;
}

function displayItems(data) {
    let inventoryData = data;
    let idTitle = "Item ID";
    let productTitle = "Product Name";
    let departTitle = "Department";
    let priceTitle = "Price";
    let quantityTitle = "Stock";
    let productSalesTitle = "Product Sales"
    let idMaxSpace = idTitle.length;
    let productMaxSpace = productTitle.length;
    let departmentMaxSpace = departTitle.length;
    let priceMaxSpace = priceTitle.length;
    let stockMaxSpace = quantityTitle.length;
    let productSalesMax = productSalesTitle.length;
    let productOutput = "";
    let dashDivider = "";
    let invetoryTitles = "";
    let displayArray = [];

    for ( let i = 0; i < inventoryData.length; i ++){
        if ( inventoryData[i].item_id.toString().length > idMaxSpace){
            idMaxSpace = inventoryData[i].item_id.toString().length;
        }
        if ( inventoryData[i].product_name.length > productMaxSpace){
            productMaxSpace = inventoryData[i].product_name.length
        }
        if ( inventoryData[i].department_name.length > departmentMaxSpace){
            departmentMaxSpace = inventoryData[i].department_name.length
        }
        if ( inventoryData[i].price.toFixed(2).toString().length > priceMaxSpace){
            priceMaxSpace = inventoryData[i].price.toFixed(2).toString().length
        }
        if ( inventoryData[i].stock_quantity.toString().length > stockMaxSpace){
            stockMaxSpace = inventoryData[i].stock_quantity.toString().length;
        }
        if ( inventoryData[i].product_sales.toFixed(2).toString().length > productSalesMax){
            productSalesMax = inventoryData[i].product_sales.toFixed(2).toString().length;
        }
    }

    idTitle = idTitle+spaceFinder(idMaxSpace-idTitle.length);
    productTitle = productTitle+spaceFinder(productMaxSpace-productTitle.length);
    departTitle = departTitle+spaceFinder(departmentMaxSpace-departTitle.length);
    priceTitle = priceTitle+spaceFinder(priceMaxSpace-priceTitle.length);
    quantityTitle = quantityTitle+spaceFinder(stockMaxSpace-quantityTitle.length);
    productSalesTitle = productSalesTitle+spaceFinder(productSalesMax-productSalesTitle.length);
    invetoryTitles = "| "+idTitle+" | "+productTitle+" | "+departTitle+" | "+priceTitle+" | "+quantityTitle+" | "+productSalesTitle+" |";
    
    for (let i = 0; i < inventoryData.length; i++){
        let itemId =  inventoryData[i].item_id+spaceFinder(idMaxSpace-inventoryData[i].item_id.toString().length);
        let productName = inventoryData[i].product_name+spaceFinder(productMaxSpace-inventoryData[i].product_name.length);
        let department = inventoryData[i].department_name+spaceFinder(departmentMaxSpace-inventoryData[i].department_name.length);
        let price = inventoryData[i].price.toFixed(2)+spaceFinder(priceMaxSpace - inventoryData[i].price.toFixed(2).toString().length);
        let stock = inventoryData[i].stock_quantity+spaceFinder(stockMaxSpace-inventoryData[i].stock_quantity.toString().length);
        let productSales = inventoryData[i].product_sales.toFixed(2)+spaceFinder(productSalesMax-inventoryData[i].product_sales.toFixed(2).toString().length);
        productOutput = "| "+itemId+" | "+productName+" | "+department+" | "+price+" | "+stock+" | "+productSales+" |";
        displayArray.push(productOutput);
    }
    dashDivider = dashFinder(productOutput.length);

    console.log(dashDivider);
    console.log(invetoryTitles);
    console.log(dashDivider);
    for (let i = 0; i < displayArray.length; i++){
        console.log(displayArray[i])
        console.log(dashDivider);
    }
}
