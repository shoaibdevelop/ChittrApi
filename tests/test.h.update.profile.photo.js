/*
 Test the successful upload, delete and download of a JPEG and PNG photos.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const filename = path.basename(__filename);

// Require the project-specific JavaScript files
const config = require('./config/config.js');
const userdata = require('./data/users.data.js');
const expect = chai.expect;

chai.use(chaiHttp);

const server_url = config.getProperties().url;
let arrayOfGoodUsersData = userdata.usersGoodData(); // get an array of the data to test successful POST /users
let test_case_count = 0; // count of test cases
let user_id = 2; // index to the THIRD user created during the tests
let authorization_token = "";

describe('Manage the photos (JPEG and PNG) of an auction.', function () {

    // Output filename of test script for cross reference
    before(function(){
        console.log('    [Script: ' + filename + ']')
    });

    /*
     First (synchronously), log in as one user so that the test system is authenticated to upload a photo to an auction
     */

    before(function() {
        return chai.request(server_url)
            .post('/login')
            .send(
                {
                    email: arrayOfGoodUsersData[user_id].email,
                    password: arrayOfGoodUsersData[user_id].password
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
    });

    /*
     Now add photo to auction
     */

    describe('Tests for add (POST) and get (GET) a JPEG photo.', function () {

        it('Should POST a JPEG photo, returning 201.', function () {
            return chai.request(server_url)
                .post('/user/photo')
                .set('X-Authorization', authorization_token)
                .set('Content-Type', 'image/jpeg')
                .attach('file', './tests/photos/PaintedFace.jpg')
                .send()
                .then(function (res) {
                    expect(res).to.have.status(201);
                })
                .catch(function (err) {
                    throw err;
                });
        });

        it('Should GET a JPEG photo, returning 200.', function () {
            return chai.request(server_url)
                .get('/user/' + user_id + '/photo')
                .send()
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'image/jpeg');
                })
                .catch(function (err) {
                    throw err;
                });
        });

        it('Should GET default JPEG photo, returning 200.', function () {
            return chai.request(server_url)
                .get('/user/5/photo')
                .send()
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'image/jpeg');
                })
                .catch(function (err) {
                    throw err;
                });
        });

    });

    // describe('Tests for add (POST) and get (GET)a PNG photo.', function () {
    //
    //     it('Should POST a PNG photo, returning 201.', function () {
    //         return chai.request(server_url)
    //             .post('/user/photo')
    //             .set('X-Authorization', authorization_token)
    //             .set('Content-Type', 'image/png')
    //             .attach('file', './tests/photos/cyborg.png')
    //             .send()
    //             .then(function (res) {
    //                 expect(res).to.have.status(201);
    //             })
    //             .catch(function (err) {
    //                 throw err;
    //             });
    //     });
    //
    //     it('Should get a PNG photo, returning 200.', function () {
    //         return chai.request(server_url)
    //             .get('/user/' + user_id + 'photo')
    //             .send()
    //             .then(function (res) {
    //                 expect(res).to.have.status(200);
    //                 expect(res).to.have.header('content-type', 'image/png');
    //             })
    //             .catch(function (err) {
    //                 throw err;
    //             });
    //     });
    //
    // });

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