const inquirer = require("inquirer");

// Queries the database for a list of items and associated ids.
// Prompts the user to select one of the items using the provided prompt.
// Returns a promise that, when fulfilled, returns the id corresponding to the item the user chooses.
function promptForId(db, idField, otherField, alias, table, prompt, extraChoices = []) {
    // Select ids and another column with an alias from the table
    // (Prepared statements weren't working as expected here for some reason. The template literal is probably safe enough since this function isn't user-facing, at least in the way I'm using it)
    return db.query(`SELECT ${idField}, ${otherField} AS ${alias} FROM ${table}`)
    .then((result) => {
        // Get the list of items from the query result
        let itemsList = result[0].map((x) => `${x[alias]} (id:${x[idField]})`);
        // Prompt the user for the item
        return inquirer.prompt([
            {
                type: "list",
                name: "item",
                message: prompt,
                choices: extraChoices.concat(itemsList)
            }
        ]);
    }).then(({item}) => {
        // Find the item id for the query. If the item does not have an id, return null.
        // (Regex selects the sequence of numbers preceding the ) that precedes the end of the input)
        let itemMatch = item.match(/\d*(?=\)(?=$))/);
        return (itemMatch) ? itemMatch[0] : itemMatch;
    });
}

module.exports = promptForId;