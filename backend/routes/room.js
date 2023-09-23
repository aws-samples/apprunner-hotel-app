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
const rds = require('../rds');

function getRooms(req, res, next) {
  const [pool, url] = rds();
  pool.getConnection(function(error, con){
    if (error) {
      next(error);
    }
    else {
      con.query('SELECT * FROM hotel.rooms', function(error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).json({ error: error });
        }
        if (results) {
          console.log('results: %j', results);
          res.status(200).json({rooms: results})
        }
      });
      con.release();
    }
  }); 
}

function addRoom(req, res, next) {
  console.log(req.body)
  if (req.body.roomNumber && req.body.floorNumber && req.body.hasView) {
    const roomNumber = req.body.roomNumber;
    const floorNumber = req.body.floorNumber;
    const hasView = req.body.hasView;

    console.log('New room request received. roomNumber: %s, floorNumber: %s, hasView: %s', roomNumber, floorNumber, hasView);
    
    var sql = "INSERT INTO hotel.rooms (id, floor, hasView) VALUES (?, ?, ?)";
    sqlParams = [roomNumber, floorNumber, hasView];
    
    const [pool, url] = rds();
    pool.getConnection(function(error, con){
      if (error) {
        next(error)
      }
      else {
        con.query(sql, sqlParams, function(error, results, fields) {
          if (error) {
              console.log(error);
              res.status(500).json({ error: error });
          }
          if (results) {
              console.log('results: %j', results);
              res.status(200).json({rooms: results})
          }
          });
      }
      con.release();
    });
  } else {
    console.log("Missing params");
    res.status(500).json({ error: 'Missing params'});
  }
}

router.get('/', function(req, res, next) {
try {
  getRooms(req, res, next);
} catch (err) {
  next(err);
}
});

router.post('/', function (req, res, next) {
try {
  addRoom(req, res, next);
} catch (err) {
  next(err);
}
});

module.exports = router;