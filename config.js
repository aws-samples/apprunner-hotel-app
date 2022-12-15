var config = {}
config.region = process.env.AWS_REGION;
config.db_secret = process.env.MYSQL_SECRET;
config.hotel_name = process.env.HOTEL_NAME;

module.exports = config;