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

function userPrompt(){
    inquirer.prompt([
        {
            type: "list",
            name: "customerPrompt",
            message: "What would you like to do?",
            choices: [
                "Order Item",
                "Display Inventory",
                "Exit"
            ]
        }
    ]).then(function(ans){
        switch(ans.customerPrompt){
            case "Order Item":
                customerOrder();
                break;
            case "Display Inventory":
                displayInventory();
                break;
            case "Exit":
                console.log("Good Bye.");
                process.exit();
                break;
        }
    });
}

function customerOrder(){
    inquirer.
    prompt([
        {
            type: "input",
            name: "itemid",
            message: "Please enter the id of the product you would like to purchase.",
            validate: function(value) {
                if (isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "itemquantity",
            message: "How many would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(ans){
        let itemID = ans.itemid;
        let quantity = parseInt(ans.itemquantity);
        connection.query(
            "SELECT * FROM products WHERE item_id = ? ",
            [itemID],
            function(err, res){
                if(err) throw err;
                if( res[0].stock_quantity === 0){
                    console.log("Sorry we are out of stock!");
                    displayInventory(res);
                }else if ( res[0].stock_quantity > 0 && res[0].stock_quantity < quantity){
                    console.log("Sorry we only have "+res[0].stock_quantity+" in stock.");
                    inquirer.prompt([
                        {
                            type: "confirm",
                            name: "updatequantity",
                            message: "Do you want to update order quantity?",
                        }
                    ]).then(function(ans){
                        if( ans.updatequantity === true){
                            inquirer.prompt([
                                {
                                    type: "input",
                                    name: "newquantity",
                                    message: "Please enter the updated quantity you want.",
                                    validate: function(value){
                                        if (value > res[0].stock_quantity){
                                            return false;
                                        }
                                        return true;
                                    }
                                }
                            ]).then(function(ans){
                                let thisOrder = new orderInfo(res[0].item_id, res[0].product_name, res[0].department_name, res[0].price,ans.newquantity);
                                let data = new Array(thisOrder);
                                console.log("----------Order placed!----------");
                                updateInventory(data).then(function(success){
                                    console.log(success);
                                    userPrompt();
                                }).catch(function(err){
                                    console.log("----------Order Failed!----------");
                                    throw err;
                                });
                            });
                        }else{
                        console.log("----------Order cancelled----------");
                        userPrompt();
                        }
                    });
                }else{
                    let thisOrder = new orderInfo(res[0].item_id, res[0].product_name, res[0].department_name, res[0].price,quantity);
                    let data = new Array(thisOrder);
                    console.log(data);
                    console.log("----------Order Placed----------");
                    updateInventory(data).then(function(success){
                        console.log(success);
                        userPrompt();
                    }).catch(function(err){
                        console.log("----------Order Failed!----------");
                        throw err;
                    });
                }
            }
        )

    });
}

function updateInventory(data){
    let itemInfo = data;
    return new Promise(function(reslove, reject){
        connection.query(
            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
            [itemInfo[0].stock_quantity, itemInfo[0].item_id, itemInfo[0].item_id],
            function (err){
                if(err) return reject(err);
                displayOrder(itemInfo);
                return reslove("----------Order Complete----------");
            });
    });
}


function orderInfo( itemid, productname, department, price, quantity){
    this.item_id = itemid;
    this.product_name = productname;
    this.department_name = department;
    this.price = price;
    this.stock_quantity = quantity;
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
    let idMaxSpace = idTitle.length;
    let productMaxSpace = productTitle.length;
    let departmentMaxSpace = departTitle.length;
    let priceMaxSpace = priceTitle.length;
    let stockMaxSpace = quantityTitle.length;
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
    }

    idTitle = idTitle+spaceFinder(idMaxSpace-idTitle.length);
    productTitle = productTitle+spaceFinder(productMaxSpace-productTitle.length);
    departTitle = departTitle+spaceFinder(departmentMaxSpace-departTitle.length);
    priceTitle = priceTitle+spaceFinder(priceMaxSpace-priceTitle.length);
    quantityTitle = quantityTitle+spaceFinder(stockMaxSpace-quantityTitle.length);
    invetoryTitles = "| "+idTitle+" | "+productTitle+" | "+departTitle+" | "+priceTitle+" | "+quantityTitle+" |";
    
    for (let i = 0; i < inventoryData.length; i++){
        let itemId =  inventoryData[i].item_id+spaceFinder(idMaxSpace-inventoryData[i].item_id.toString().length);
        let productName = inventoryData[i].product_name+spaceFinder(productMaxSpace-inventoryData[i].product_name.length);
        let department = inventoryData[i].department_name+spaceFinder(departmentMaxSpace-inventoryData[i].department_name.length);
        let price = inventoryData[i].price.toFixed(2)+spaceFinder(priceMaxSpace - inventoryData[i].price.toFixed(2).toString().length);
        let stock = inventoryData[i].stock_quantity+spaceFinder(stockMaxSpace-inventoryData[i].stock_quantity.toString().length);
        productOutput = "| "+itemId+" | "+productName+" | "+department+" | "+price+" | "+stock+" |";
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

function displayOrder(data) {
    let inventoryData = data;
    let idTitle = "Item ID";
    let productTitle = "Product Name";
    let departTitle = "Department";
    let priceTitle = "Price";
    let quantityTitle = "Order Quantity";
    let idMaxSpace = idTitle.length;
    let productMaxSpace = productTitle.length;
    let departmentMaxSpace = departTitle.length;
    let priceMaxSpace = priceTitle.length;
    let stockMaxSpace = quantityTitle.length;
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
    }

    idTitle = idTitle+spaceFinder(idMaxSpace-idTitle.length);
    productTitle = productTitle+spaceFinder(productMaxSpace-productTitle.length);
    departTitle = departTitle+spaceFinder(departmentMaxSpace-departTitle.length);
    priceTitle = priceTitle+spaceFinder(priceMaxSpace-priceTitle.length);
    quantityTitle = quantityTitle+spaceFinder(stockMaxSpace-quantityTitle.length);
    invetoryTitles = "| "+idTitle+" | "+productTitle+" | "+departTitle+" | "+priceTitle+" | "+quantityTitle+" |";
    
    for (let i = 0; i < inventoryData.length; i++){
        let itemId =  inventoryData[i].item_id+spaceFinder(idMaxSpace-inventoryData[i].item_id.toString().length);
        let productName = inventoryData[i].product_name+spaceFinder(productMaxSpace-inventoryData[i].product_name.length);
        let department = inventoryData[i].department_name+spaceFinder(departmentMaxSpace-inventoryData[i].department_name.length);
        let price = inventoryData[i].price.toFixed(2)+spaceFinder(priceMaxSpace - inventoryData[i].price.toFixed(2).toString().length);
        let stock = inventoryData[i].stock_quantity+spaceFinder(stockMaxSpace-inventoryData[i].stock_quantity.toString().length);
        productOutput = "| "+itemId+" | "+productName+" | "+department+" | "+price+" | "+stock+" |";
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