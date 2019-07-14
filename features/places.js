// Load process.env values from .env file
require('dotenv').config();

var Amadeus = require('amadeus');

// TODO: integrate with Amadeus SDK for places of interest
// var amadeus = new Amadeus({
//   clientId: process.env.AMADEAUS_API_KEY,
//   clientSecret: process.env.AMADEAUS_API_SECRET
// });

// amadeus.referenceData.urls.checkinLinks
//   .get({
//     airlineCode: 'BA'
//   })
//   .then(function(response) {
//     console.log(response.data[0].href);
//   })
//   .catch(function(responseError) {
//     console.log(responseError.code);
//   });

module.exports = function(controller) {
  /* places */
  controller.hears(['Where to have fun'], ['message'], async (bot, message) => {
    await bot.reply(message, 'What do you like? Skydiving is pretty fun :)');
  });
};
