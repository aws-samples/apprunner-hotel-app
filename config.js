var config = {
    infra: {},
    app: {},
    secret: {}
};
config.infra.region = process.env.AWS_REGION;
config.app.hotel_name = process.env.HOTEL_NAME;
config.secret.db_secret = process.env.MYSQL_SECRET;
module.exports = config;