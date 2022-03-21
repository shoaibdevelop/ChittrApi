/*
 Test the successful changing of user details.
 */


const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const filename = path.basename(__filename);

// Require the project-specific JavaScript files
const config = require('./config/config.js');
const usersData = require('./data/users.data.js');

const expect = chai.expect;

chai.use(chaiHttp);

const server_url = config.getProperties().url;
let arrayOfGoodUsersData = usersData.usersGoodData(); // get an array of the data to test successful POST /users
let test_case_count = 0; // count of test cases
let authorization_token = "";
let user_id = 0;

describe('Test successful change (amendment) of users.', function () {

    // Output filename of test script for cross reference
    before(function(){
        console.log('    [Script: ' + filename + ']')
    });


    /*
     Get a single user
     */
    it('Should return 200 status code', function () {

        // console.log("authorization_token=", authorization_token);
        // console.log("user_id=", user_id);

        return chai.request(server_url)
            .get('/user/' + 1)
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('given_name');
                expect(res.body).to.have.property('family_name');
                expect(res.body).to.have.property('profile_photo_path');
                expect(res.body).to.have.property('recent_chits');
            })
            .catch(function (err) {
                throw err; // there is any error
            });
    });

    /*
     Get a non existing user
     */
    it('Should return 404 status code', function () {

        // console.log("authorization_token=", authorization_token);
        // console.log("user_id=", user_id);

        return chai.request(server_url)
            .get('/user/' + 100)
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('given_name');
                expect(res.body).to.have.property('family_name');
                expect(res.body).to.have.property('profile_photo_path');
                expect(res.body).to.have.property('recent_chits');
                throw new Error('Incorrectly creating user.');
            })
            .catch(function (err) {
                if (typeof err.status !== 'undefined') {
                    expect(err).to.have.status(404);
                } else {
                    throw err;
                }
            });
    });


});