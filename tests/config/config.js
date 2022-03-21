/*
 Configuration information e.g. URL of the server to test
 Credits: Tom Young !
 TODO: the BASEURL is hardcoded for the URL and port. This needs updating e.g. add something like port: { port: '5470'},
 */

'use strict';

const
    VERSION = 'v0.0.5',
    BASEURL = 'http://localhost:3333/api/v0.0.5',
    BASEPATH = `/api/${VERSION}`,
    convict = require('convict');

let
    config = convict({
        version: {
            format: String,
            default: VERSION,
            arg: 'version'
        },
        baseurl: {
            format: 'url',
            default: BASEURL,
            arg: 'baseurl'
        },
        basepath: {
            format: String,
            default: BASEPATH,
            arg: 'basepath'
        },
        url: {
            format: 'url',
            default: BASEURL,
            arg: 'url',
            env: 'URL'
        },
        log: {
            name: {
                format: String,
                default: 'apitest'
            },
            level: {
                format: String,
                default: 'debug',
                arg: 'log-level',
            }
        },
        authToken: {
            format: String,
            default: 'X-Authorization'
        }
    });

module.exports = config;
