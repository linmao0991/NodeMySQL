const mysql = require("mysql");
const inquirer = require("inquirer");
let departments = [];

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    displayDepartments();
});

function displayDepartments(){
    connection.query(
        "SELECT * FROM departments",
        function(err, res){
            for (let i = 0; i < res.length; i++){
                if( departments.indexOf(res[i].department_name) === -1 ){
                    departments.push(res[i].department_name);
                }
            }
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
            name: "prompt",
            message: "Please select a function.",
            choices: [
                "List All Departments",
                "List by Department",
                "Add New Department",
                'Exit'
            ]
        }
    ]).then(function(ans){
        switch (ans.prompt) {
            case "List All Departments":
                displayDepartments();
                break;
            case "List by Department":
                viewDepartment();
                break;
            case "Add New Department":
                addNewDepartment()
                break;
            case "Exit":
                process.exit();
                break;
        }
    });
}

function addNewDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "newDepartment",
            message: "Please enter in a department name",
            validate: function(value){
                if( departments.indexOf(value) !== -1){
                    console.log("\nYour department is already in the database, please try a different name.");
                    return false;
                }else{
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "overhead",
            message: "Please enter in over head cost for new department.",
            validate: function (value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(ans){
        connection.query(
            "INSERT INTO departments (department_name, over_head_costs) VALUES (?,?)",
            [ans.newDepartment, ans.overhead],
            function(err, res){
                if(err) throw err
                console.log("Department: "+ans.newDepartment+" Added.");
                userPrompt();
            }
        )
    })
}

function viewDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Please select a Department."
        }
    ]).then(function(ans){
        console.log(ans.department);
        connection.query(
            "SELECT * FROM departments WHERE department_name = ? ",
            [ans.department],
            function(err, res){
                if(err) throw err;
                console.log(res);
                displayItems(res);
                userPrompt()
        });
    });
} 

function displayItems(data) {
    let inventoryData = data;
    let idTitle = "Department ID";
    let departTitle = "Department";
    let overheadTitle = "Over Head";
    let salesTitle = "Sales";
    let totalProfitTitle = "Total Profit"
    let idMaxSpace = idTitle.length;
    let departmentMaxSpace = departTitle.length;
    let overheadMaxSpace = overheadTitle.length;
    let salesMaxSpace = salesTitle.length;
    let totalProfitMax = totalProfitTitle.length; 
    let productOutput = "";
    let dashDivider = "";
    let invetoryTitles = "";
    let displayArray = [];

    for ( let i = 0; i < inventoryData.length; i ++){
        if ( inventoryData[i].department_id.toString().length > idMaxSpace){
            idMaxSpace = inventoryData[i].department_id.toString().length;
        }
        if ( inventoryData[i].department_name.length > departmentMaxSpace){
            departmentMaxSpace = inventoryData[i].department_name.length
        }
        if ( inventoryData[i].over_head_costs.toFixed(2).toString().length > overheadMaxSpace){
            overheadMaxSpace = inventoryData[i].over_head_costs.toFixed(2).toString().length
        }
        if ( inventoryData[i].product_sales.toFixed(2).toString().length > salesMaxSpace){
            salesMaxSpace = inventoryData[i].product_sales.toFixed(2).toString().length;
        }
        if ( inventoryData[i].total_profit.toFixed(2).toString().length > totalProfitMax){
            totalProfitMax = inventoryData[i].total_profit.toFixed(2).toString().length;
        }
    }

    idTitle = idTitle+spaceFinder(idMaxSpace-idTitle.length);
    departTitle = departTitle+spaceFinder(departmentMaxSpace-departTitle.length);
    overheadTitle = overheadTitle+spaceFinder(overheadMaxSpace-overheadTitle.length);
    salesTitle = salesTitle+spaceFinder(salesMaxSpace-salesTitle.length);
    totalProfitTitle = totalProfitTitle+spaceFinder(totalProfitMax-totalProfitTitle.length);
    invetoryTitles = "| "+idTitle+" | "+departTitle+" | "+overheadTitle+" | "+salesTitle+" | "+totalProfitTitle+" |";
    
    for (let i = 0; i < inventoryData.length; i++){
        let itemId =  inventoryData[i].department_id+spaceFinder(idMaxSpace-inventoryData[i].department_id.toString().length);
        let department = inventoryData[i].department_name+spaceFinder(departmentMaxSpace-inventoryData[i].department_name.length);
        let overhead = inventoryData[i].over_head_costs.toFixed(2)+spaceFinder(overheadMaxSpace - inventoryData[i].over_head_costs.toFixed(2).toString().length);
        let sales = inventoryData[i].product_sales.toFixed(2)+spaceFinder(salesMaxSpace-inventoryData[i].product_sales.toFixed(2).toString().length);
        let totalProfit = inventoryData[i].total_profit.toFixed(2)+spaceFinder(totalProfitMax-inventoryData[i].total_profit.toFixed(2).toString().length);
        productOutput = "| "+itemId+" | "+department+" | "+overhead+" | "+sales+" | "+totalProfit+" |";
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