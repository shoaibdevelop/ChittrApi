/*
 Test the successful creation of users
 */


// Require the necessary testing libraries
const chai = require('chai');
const chaiHttp = require('chai-http');

// Require the project-specific JavaScript files
const config = require('./config/config.js');
const userdata = require('./data/users.data.js');
const chitdata = require('./data/chits.data.js')

const path = require('path');
const filename = path.basename(__filename);

const expect = chai.expect;
chai.use(chaiHttp);

const server_url = config.getProperties().url;
let arrayOfGoodUsersData = userdata.usersGoodData(); // get an array of the data to test successful POST /users
let arrayOfGoodChitsData = chitdata.chitsGoodData(); // get an array of the data to test successful POST /users

let arrayOfBadChitsData = chitdata.chitsBadData();

let authorization_token = "";

describe('Test successful creation of chits.', function () {

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
            })
            .catch(function (err) {
                throw err; // there is any error
            });
        //});
    });


    it('Should return 201, and JSON with id of new chit: ' + arrayOfGoodChitsData[0].testDescription, function () {
        return chai.request(server_url)
            .post('/chits')
            .set('X-Authorization', authorization_token)
            .send({
                "timestamp": arrayOfGoodChitsData[0].timestamp,
                "chit_content": arrayOfGoodChitsData[0].chit_content,
                "location": {
                    "longitude": arrayOfGoodChitsData[0].location.longitude,
                    "latitude": arrayOfGoodChitsData[0].location.latitude
                }
            })
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.have.property('chit_id');
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('Should return 201, and JSON with id of new chit: ' + arrayOfGoodChitsData[1].testDescription, function () {
        return chai.request(server_url)
            .post('/chits')
            .set('X-Authorization', authorization_token)
            .send({
                "timestamp": arrayOfGoodChitsData[1].timestamp,
                "chit_content": arrayOfGoodChitsData[1].chit_content
            })
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.have.property('chit_id');
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('Should return 201, and JSON with id of new chit: ' + arrayOfGoodChitsData[2].testDescription, function () {
        return chai.request(server_url)
            .post('/chits')
            .set('X-Authorization', authorization_token)
            .send({
                "timestamp": arrayOfGoodChitsData[2].timestamp,
                "chit_content": arrayOfGoodChitsData[2].chit_content,
                "location": {
                    "longitude": arrayOfGoodChitsData[2].location.longitude,
                    "latitude": arrayOfGoodChitsData[2].location.latitude
                }
            })
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.have.property('chit_id');
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('Should return 4xx status code: ' + arrayOfBadChitsData[0].testDescription, function () {
        return chai.request(server_url)
            .post('/chits')
            .set('X-Authorization', authorization_token)
            .send({
                "timestamp": arrayOfBadChitsData[0].timestamp,
                "chit_content": arrayOfBadChitsData[0].chit_content
            })
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.have.property('chit_id');
                throw new Error('Incorrectly creating chit.');
            })
            .catch(function (err) {
                if (typeof err.status !== 'undefined') {
                    expect(err).to.have.status(400);
                }
                else {
                    throw err;
                }
            });
    });

});


