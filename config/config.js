const convict = require('convict');

let config = convict({
    authToken: {
        format: String,
        default: 'X-Authorization'
    },
    db: {
        host: { // host, rather than hostname, as mysql connection string uses 'host'
            format: String,
            default: "localhost"
            //default: "mudfoot.doc.stu.mmu.ac.uk"
        },
        port: {
            format: Number,
            default: 3306
        },
        user: {
            format: String,
            default: 'anwarn'
            //default: 'root'
        },
        password: {
            format: String,
            default: 'groupsliN6'
            //default: 'Faisal123'
        },
        database: {
            format: String,
            default: 'chittr'
            //default: 'anwarn'
        },
        multipleStatements:{
            format: Boolean,
            default: true
        }
    }
});


module.exports = config;
