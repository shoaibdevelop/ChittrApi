/*
 This file contains test data for testing users

 Note 1: the intention is that the JSON data is loaded into a global data structure that is then available for each of the test files
 userid and token will need to be updated depending on the results from the GETs and POSTs.

 Note 2: there are two exports. One exports 'good data' (data that should enable a successful creation of a users) and one exports 'bad data' (data intended to cause a 4xx or 5xx)
 */
'use strict';

exports.chitsGoodData = function () {
    return [
        {
            "testDescription" : "Create chit.",
            "timestamp": new Date(2019, 9, 19, 14, 19, 0).getTime(),
            "chit_content": "Having lunch with Turing!",
            "location": {
                "longitude": -2.2400273,
                "latitude": 53.4764454
            }
        },
        {
            "testDescription" : "Create chit.",
            "timestamp": new Date(2019, 8, 28, 3, 4, 0).getTime(),
            "chit_content": "3am and still can't sleep :("
        },
        {
            "testDescription" : "Create chit.",
            "timestamp": new Date(2019, 9, 2, 11, 25, 0).getTime(),
            "chit_content": "I'm so lost. I can see nothing but cloud and farmland!",
            "location": {
                "longitude": -4.076277,
                "latitude": 53.068504
            }
        }

    ]
};

exports.chitsBadData = function () {
    return [
        {   // too long a chit. Exceeds 141
            "testDescription" : "Chit content above 141 characters.",
            "timestamp": new Date(2019, 8, 28, 3, 4, 0).getTime(),
            "chit_content": "if i keep typing for a very very long time then this chit will definitely be over 141 characters. That sentence was 97 in total but I am hoping that this second sentence fills up the remaining"
        },

    ]
};
