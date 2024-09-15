var config = {
    infra: {},
    app: {},
    secret: {}
};

// Define a function to initialize the config
async function initializeConfig() {
    config.infra.region = process.env.AWS_REGION;
    config.app.hotel_param = process.env.HOTEL_NAME_PARAM;
    config.secret.db_secret = process.env.MYSQL_SECRET;

    // Await the retrieval of secret value and SSM parameter
    config.secret.db_secret_value = await retrieve_secret_value(config.secret.db_secret);
    config.app.hotel_name = await retrieve_ssm_parameter(config.app.hotel_param);

    return config; // Return the fully loaded config
}

// Asynchronous function to retrieve secret value
async function retrieve_secret_value(secret_id) {
    var AWS = require('aws-sdk');
    var client = new AWS.SecretsManager({
        region: config.infra.region
    });

    try {
        const data = await client.getSecretValue({ SecretId: secret_id }).promise();
        return data.SecretString || data; // Return the secret string if available
    } catch (err) {
        console.error("Error retrieving secret:", err);
        throw err;
    }
}

// Asynchronous function to retrieve SSM parameter
async function retrieve_ssm_parameter(parameter_name) {
    var AWS = require('aws-sdk');
    var client = new AWS.SSM({
        region: config.infra.region
    });

    try {
        const data = await client.getParameter({ Name: parameter_name }).promise();
        return data.Parameter.Value; // Return the parameter value
    } catch (err) {
        console.error("Error retrieving parameter:", err);
        throw err;
    }
}

// Export the config as a promise
module.exports = initializeConfig();
