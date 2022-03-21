/*
 Test the unsuccessful changing of user details.
 */


const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const filename = path.basename(__filename);

// Require the project-specific JavaScript files
const config = require('./config/config.js');
const userdata = require('./data/users.data.js');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const server_url = config.getProperties().url;
let arrayOfGoodUsersData = userdata.usersGoodData(); // get an array of the data to test successful POST /users
let test_case_count = 0; // count of test cases
let authorization_token = ""; // This variable is unlikely to be used (unless I create a false token)
let user_id = 0; // For an arbitrary userid.

describe('Test unsuccessful change (amendment) of users.', function () {

    // Output filename of test script for cross reference
    before(function(){
        console.log('    [Script: ' + filename + ']')
    });

    /*
     Attempt to change a user from the sample data, with no authentication.
     */

    user_id = 11; // Use a user_id from the sample data.

    it('Should return 401 status code, as PATCH issued with no authorization', function () {
        return chai.request(server_url)
            .patch('/user/' + user_id)
            .send(
                {
                    given_name: arrayOfGoodUsersData[0].givenName + ' changed',
                    family_name: arrayOfGoodUsersData[0].familyName + ' Changed',
                }
            )
            .then(function(res){
                expect(res).to.have.status(201);
                throw err("There appears to be no authentication required to change a user.");
            })
            .catch(function (err) {
                expect(err).to.have.status(401);
            });
    });

    /*
     Attempt to change a non-existent user
     */

    user_id = 101909101; // Use a user_id for a user that shouldn't exist

    it('Should return 400 or 404 status code, as PATCH issued with no authorization', function () {
        return chai.request(server_url)
            .patch('/user/' + user_id)
            .send(
                {
                    given_name: arrayOfGoodUsersData[0].givenName + 'changed',
                    family_name: arrayOfGoodUsersData[0].familyName + ' Changed',
                }
            )
            .then(function(res){
                expect(res).to.have.status(201);
                throw err("There appears to be no authentication required to change a user; and a non-existent user is changed.");
            })
            .catch(function (err) {
                // It is NOT normal to do this kind of conditional-expect testing
                // Normally you would construct a separate test case for each status code.
                // console.log('Status code:', err.status);
                if(err.status === 400) {
                    expect(err).to.have.status(400);
                } else if (err.status === 401) {
                    expect(err).to.have.status(401);
                } else if (err.status === 404) {
                    expect(err).to.have.status(404);
                } else {
                    throw err("Unexpected error");
                }

            });
    });


});