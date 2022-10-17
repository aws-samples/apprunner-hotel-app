const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const mysql = require('mysql');

var rdsPool = null;
var rdsUrl = null;

const region = process.env.AWS_REGION;
console.log('Application launched in: ', region);

const secretsManagerClient = new SecretsManagerClient({
  region: region
});
  
const params = {
  SecretId: process.env.secret
}

secretsManagerClient.send(new GetSecretValueCommand(params), async (err, data) => {
    if (err) {
        throw(err);
    }
    else {
        const secret = await JSON.parse(data.SecretString);
        rdsUrl = secret.host;
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
    }
});

module.exports = function() { return [rdsPool, rdsUrl]; }