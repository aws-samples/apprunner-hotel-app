var config = {
    infra: {},
    app: {},
    backend: {}
};
config.infra.region = process.env.AWS_REGION;
config.app.hotel_name = process.env.HOTEL_NAME;
config.app.backend = process.env.BACKEND_URL;

module.exports = config;