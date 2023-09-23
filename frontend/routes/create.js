/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const express = require('express');
const router = express.Router();
const config = require('../config');
const https = require("https");

router.get('/', function(req, res, next) {
  var url = config.app.backend + 'create';
  https.get(url, (resp) => {
    let body = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      body += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(body));
      if(body.includes('error')) {
        res.render('create', { menuTitle: config.app.hotel_name, url: url, result: JSON.parse(body).error });
      }
      else {
        res.render('create', { menuTitle: config.app.hotel_name, url: url, result: JSON.parse(body).status });
      } 
      
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}); 

module.exports = router;