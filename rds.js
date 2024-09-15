const mysql = require('mysql');

function rds() {
  return new Promise((resolve, reject) => {
    const configPromise = require('./config');

    configPromise.then((config) => {
      console.log('Config loaded:', config);
      if(!config.infra.region) {
        throw new Error('AWS_REGION environment variable must be set. This is usually set by Fargate');
      }
      console.log('Application launched in: ', config.infra.region);
      
      if(!config.secret.db_secret) {
        throw new Error('MYSQL_SECRET environment variable must be set');
      }
      
      const secret = JSON.parse(config.secret.db_secret_value);
      console.log('Retrieved secret: ', secret);
      const rdsUrl = secret.host;
      console.log(`Connecting to RDS at ${rdsUrl}`);
      
      const rdsPool = mysql.createPool({
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
        if (error) {
          console.log(error);
          reject(error);
        }
        else {
          console.log('The solution is: ', results[0].solution);
          resolve([rdsPool, rdsUrl]);
        }
      });
    }).catch((error) => {
      console.error('Error loading config:', error);
      reject(error);
    });
  });
}

module.exports = rds;