var config = {
    infra: {},
    app: {},
    secret: {}
};
config.infra.region = process.env.AWS_REGION;
config.app.hotel_name = process.env.HOTEL_NAME;
config.secret.db_secret = process.env.MYSQL_SECRET;
config.secret.db_secret_value = retrieve_secret_value(config.secret.db_secret);

function retrieve_secret_value(secret_id) {
    var AWS = require('aws-sdk');
    var client = new AWS.SecretsManager({
        region: config.infra.region
    });
    return client.getSecretValue({SecretId: secret_id}).promise();
}

module.exports = config;