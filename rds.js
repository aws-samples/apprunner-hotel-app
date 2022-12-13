const mysql = require('mysql');

var rdsPool = null;
var rdsUrl = null;

const region = process.env.AWS_REGION;
console.log('Application launched in: ', region);

if(!process.env.MYSQL_SECRET) {
  throw new Error('MYSQL_SECRET environment variable must be set');
}

const secret = JSON.parse(process.env.MYSQL_SECRET);
rdsUrl = secret.host;
console.log(`Connecting to RDS at ${rdsUrl}`);

rdsPool = mysql.createPool({
  connectionLimit : 12,
  host: secret.host,
  password: secret.password,
  user: secret.username
});
rdsPool.on('error', err=> {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
}); 

rdsPool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

module.exports = function() { return [rdsPool, rdsUrl]; }
