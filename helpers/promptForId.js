const inquirer = require("inquirer");

// Queries the database for a list of items and associated ids.
// Prompts the user to select one of the items using the provided prompt.
// Returns a promise that, when fulfilled, returns the id corresponding to the item the user chooses.
function promptForId(db, idField, otherField, alias, table, prompt, extraChoices = []) {
    // Select ids and another column with an alias from the table
    // (Prepared statements weren't working as expected here for some reason, so I'm using a template literal)
    return db.query(`SELECT ${idField}, ${otherField} AS ${alias} FROM ${table}`)
    .then((result) => {
        // Get the list of items and their associated ids from the query result
        let promptsList = result[0].map((x) => {return {name: x[alias], value: x[idField]}});
        // Prompt the user for the item
        return inquirer.prompt([
            {
                type: "list",
                name: "item",
                message: prompt,
                choices: extraChoices.concat(promptsList)
            }
        ]);
    }).then(({item}) => {
        // Return the id associated with the item the user selected
        return item;
    });
}

module.exports = promptForId;