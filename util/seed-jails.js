const jailsSeedData = require('../seeds/jails');
const Jails = require('../models/jail');
const dbCon = require('../config/db');



let jail;

try {

    async function seed(data) {
        for(const _jail of data) {
            jail = new Jails(_jail);
            await jail.save();
            console.log("New jail stored", jail._id);
        };
        console.log("DONE!");
        process.exit();
    };

    seed(jailsSeedData);
}
catch (e) {
    console.log(e);
}
