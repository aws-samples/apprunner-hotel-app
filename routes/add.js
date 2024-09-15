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

var express = require('express');
var router = express.Router();
var rds = require('../rds');

const configPromise = require('../config');

configPromise.then((config) => {
    console.log('Config loaded:', config);
    /* Add a new room */
    router.post('/', function (req, res, next) {
      if (req.body.roomNumber && req.body.floorNumber && req.body.hasView) {
        
        const roomNumber = req.body.roomNumber;
        const floorNumber = req.body.floorNumber;
        const hasView = req.body.hasView;

        console.log('New room request received. roomNumber: %s, floorNumber: %s, hasView: %s', roomNumber, floorNumber, hasView);
        
        var sql = "INSERT INTO hotel.rooms (id, floor, hasView) VALUES (?, ?, ?)";
        sqlParams = [roomNumber, floorNumber, hasView];
        
        rds().then(([pool, url]) => {
            pool.getConnection(function(err, con){
              if (err) {
                next(err)
              }
              else {
                con.query(sql, sqlParams, function(err, result, fields) {
                  con.release();
                  if (err) res.send(err);
                  if (result) res.render('add', { title: 'Add new room', view: 'No', result: { roomId: roomNumber } });
                  if (fields) console.log(fields);
              });
              }
            });
          }).catch(error => {
            console.error('Failed to initialize RDS connection:', error);
            process.exit(1);
          });
      } else {
        throw new Error('Missing room id, floor or has view parameters');
      }
    });

    router.get('/', function(req, res, next) {
        res.render('add', { title: 'Add new room', menuTitle: config.app.hotel_name, view: 'No' });
    });
}).catch((error) => {
    console.error('Error loading config:', error);
});

module.exports = router;
