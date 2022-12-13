const hotelName = process.env.HOTEL_NAME || 'AWS App Runner Hotel';

module.exports = function() { return {hotelName}; }