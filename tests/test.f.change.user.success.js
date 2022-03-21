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
     First (synchronously), log in as one user - first user in the array - so that the test system is authenticated to create auctions
     */
    before(function() {
        return chai.request(server_url)
            .post('/login')
            .send(
                {
                    email: arrayOfGoodUsersData[0].email,
                    password: arrayOfGoodUsersData[0].password
                }
            )
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('token');
                authorization_token = res.body['token'];
                user_id = res.body['id'];
            })
            .catch(function (err) {
                throw err; // there is any error
            });
        //});
    });

    /*
     Now change user's details
     */
    it('Should return 201 status code, changed given_name and family_name', function () {

        // console.log("authorization_token=", authorization_token);
        // console.log("user_id=", user_id);

        return chai.request(server_url)
            .patch('/user/' + user_id)
            .set('X-Authorization', authorization_token)
            .send(
                {
                    given_name: arrayOfGoodUsersData[0].givenName + 'changed',
                    family_name: arrayOfGoodUsersData[0].familyName + ' Changed',
                }
            )
            .then(function(res){
                expect(res).to.have.status(201);
            })
            .catch(function (err) {
                throw err; // there is any error
            });
    });


    /*
     Now tidy up: log out
     */

    after(function() {
        return chai.request(server_url)
            .post('/logout')
            .set('X-Authorization', authorization_token)
            .then(function(res){
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err; // there is any error
            });
    });
});