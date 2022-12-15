const mysql = require('mysql');
var config = require('./config');
var rdsPool = null;
var rdsUrl = null;

if(!config.infra.region) {
  throw new Error('AWS_REGION environment variable must be set. This is usually set by Fargate');
}
console.log('Application launched in: ', config.region);

if(!config.secret.db_secret) {
  throw new Error('MYSQL_SECRET environment variable must be set');
}

const secret = JSON.parse(config.secret.db_secret);
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
