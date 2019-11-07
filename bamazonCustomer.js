var inquirer = require("inquirer");
var mysql = require("mysql");



let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});



connection.connect(function (error) {

    if (error) {
        throw error;

    }
    console.log("Successfully connected");
    creation();

});


function creation() {
    connection.query("Select * From products", function (error, results) {

        if (error) {
            throw error;
        }

        for (let i = 0; i < results.length; i++) {


            console.log(results[i]);
            console.log("----------------------------------");
        }

        check();
    });




};


function questions() {


    setTimeout(function () {

        inquirer
            .prompt([

                {
                    type: "input",
                    message: "Please enter in the ID of what product you would like to purchase",
                    name: "id"
                },

                {
                    type: "input",
                    message: "How many would you like to buy?",
                    name: "quantity"
                }

            ])
            .then(function (answer) {

                const sqlQuery1 = "Select * from products";
                const sqlQuery2 = "Update products set ? where ?";
                var updatedCount;

                var product_Id = parseInt(answer.id);
                //Looping throught the list and printing out how many and what they ordered
                connection.query(sqlQuery1, function (error, results) {
                    if (error) {
                        throw error;
                    }

                    for (let i = 0; i < results.length; i++) {

                        if (results[i].item_id === product_Id) {
                            var specific_item = results[i].product_name;
                            var priceTotal = results[i].price * answer.quantity;

                            updatedCount = results[i].stock_quantity - answer.quantity;

                            const queryParams = [{ stock_quantity: updatedCount }, {
                                item_id: results[i].item_id
                            }]


                            setTimeout(function () {

                                connection.query(sqlQuery2, queryParams, function (error, results) {

                                    if (error) {
                                        throw error;
                                    }

                                    // if does not work then break code 
                                    if (updatedCount < 0) {
                                        console.log("We are currently in the process of restocking so please select another item");
                                    }
                                    // if does work then console log and stuff
                                    if (updatedCount >= 0) {


                                        console.log("Amount left in stock after purchase: " + updatedCount);

                                        console.log(`You ordered ${answer.quantity} ${specific_item}(s)`);
                                        console.log(`Your total Price is: ${priceTotal}`)


                                    }



                                })
                            }, 2000);

                            setTimeout(function () {
                                connection.end();



                            }, 5000);





                        }


                    }
                });
            });

    }, 900);
}

function check() {

    questions();



}

