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

function createTable(req, res) {
  const [pool, url] = rds();
  pool.getConnection(function(error, con) {
    if (error) {
        return res.status(500).json({ error: error });
    }
    else {
      console.log("Create table in database if not exists!");

      con.query('CREATE DATABASE IF NOT EXISTS hotel;', function(error, result, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
      });
  
      con.query('USE hotel;', function(error, result, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
      });
  
      con.query('CREATE TABLE IF NOT EXISTS rooms(id int NOT NULL, floor int, hasView boolean, occupied boolean, comment varchar(60), PRIMARY KEY(id));', function(error, result, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
        res.status(200).json({status: 'success'})
      });
      con.release();     
    }
  });
}

router.get('/', function(req, res, next) {
  try {
    createTable(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
