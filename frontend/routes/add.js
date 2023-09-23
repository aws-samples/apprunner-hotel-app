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
const https = require("https")

/* Add a new room */
router.post('/', function (req, res, next) {
  if (req.body.roomNumber && req.body.floorNumber && req.body.hasView) {
    console.log('New room request received. roomNumber: %s, floorNumber: %s, hasView: %s', req.body.roomNumber, req.body.floorNumber, req.body.hasView);
    
    var roomNumber = req.body.roomNumber;
    var floorNumber = req.body.floorNumber;
    var hasView = req.body.hasView;

    var postData = JSON.stringify({
      "roomNumber": roomNumber,
      "floorNumber": floorNumber,
      "hasView": hasView
    });

    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };
    var url = config.app.backend + 'room';
    var req = https.request(url, options, (resp) => {
      let body = '';
      resp.on('data', (chunk) => {
        body += chunk;
      });
      resp.on('end', () => {
          console.log(JSON.parse(body))
          if(body.includes('error')) {
            res.render('add', { title: 'Add new room', menuTitle: config.app.hotel_name, view: 'Yes', result: JSON.parse(body).error });
          }
          else {
            res.render('add', { title: 'Add new room', menuTitle: config.app.hotel_name, view: 'Yes', result: JSON.parse(body).rooms });
          } 
      })
    }).on('error', (e) => {
      console.error(e);
      throw new Error('Error adding new room: ' + e.message);
    });
    req.write(postData);
    req.end();
  } else {
    throw new Error('Missing room id, floor or has view parameters');
  }
});

router.get('/', function(req, res, next) {
    res.render('add', { title: 'Add new room', menuTitle: config.app.hotel_name, view: 'No' });
});

module.exports = router;
