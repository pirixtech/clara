// Load process.env values from .env file
require('dotenv').config();

var Amadeus = require('amadeus');

// TODO: integrate with Amadeus SDK for places of interest
var amadeus = new Amadeus({
  clientId: process.env.AMADEAUS_API_KEY,
  clientSecret: process.env.AMADEAUS_API_SECRET,
  logLevel: 'debug',
  hostname: 'test'
});

/* get points of interests response from Amadeus database */
function getPointsOfInterests() {
  amadeus.referenceData.locations.pointsOfInterest
    .get({
      latitude: '43.653226',
      longitude: '-79.383184',
      radius: '10'
    })
    .then(function(response) {
      console.log('response code: ' + response.statusCode);
      console.log('response body: ' + response.body);
      console.log('response result: ' + response.result);
      console.log('response data: ' + response.data);
      console.log('response parsed: ' + response.parsed);
      console.log('response request: ' + response.request);

      return response.result; // return result for further classification
    })
    .catch(function(responseError) {
      console.error(responseError.code);
    });
}

/* get a list of categories for further classification */
function getCategories(poiResponse) {
  let categories = [];
  for (const place of poiResponse['data']) {
    categories += place['category'];
  }

  return Set(categories);
}

/* get a list of places to be presented in a row style */
function getPlaces(poiResponse) {
  let places = [];
  for (const place of poiResponse['data']) {
    places += place['name'];
  }

  return Set(places);
}

/* geocoding user location
  https://developers.google.com/maps/documentation/geocoding/intro
*/
function lookupUserLocation() {}

function fbPlacesTempl(sights, restaurants, experience) {
  // TODO: use a factory to produce the templates
  var viewImageUrl =
    'https://www.toronto.ca/wp-content/uploads/2017/07/9163-invest-in-toronto-995x330.png';
  var resaurantUrl =
    'https://www.blogto.com/eat_drink/2018/09/essential-restaurants-toronto/';
  var sightsUrl =
    'https://www.blogto.com/city/2015/08/the_10_most_breathtaking_views_of_toronto/';
  var experiencesUrl =
    'https://www.blogto.com/city/2016/09/17_super_touristy_things_you_must_do_in_toronto/';
  var fallbackUrl = 'https://www.blogto.com';
  return {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: 'Sights',
          subtitle: `Toooooooooo many people, Please don't go`,
          image_url: viewImageUrl,
          buttons: [
            {
              title: 'View',
              type: 'web_url',
              url: sightsUrl,
              messenger_extensions: true,
              webview_height_ratio: 'full',
              fallback_url: fallbackUrl
            }
          ]
        },
        {
          title: 'Restaurants',
          subtitle: `Toooooooooo many people, Please don't go`,
          image_url: viewImageUrl,
          buttons: [
            {
              title: 'View',
              type: 'web_url',
              url: resaurantUrl,
              messenger_extensions: true,
              webview_height_ratio: 'full',
              fallback_url: fallbackUrl
            }
          ]
        },
        {
          title: 'Experiences',
          subtitle: `Toooooooooo many people, Please don't go`,
          image_url: viewImageUrl,
          buttons: [
            {
              title: 'View',
              type: 'web_url',
              url: experiencesUrl,
              messenger_extensions: true,
              webview_height_ratio: 'full',
              fallback_url: fallbackUrl
            }
          ]
        }
      ]
    }
  };
}

module.exports = function(controller) {
  /* places */
  controller.hears(
    [new RegExp(/Where to have fun(.*)/i), new RegExp(/Places to see(.*)/i)],
    ['message'],
    async (bot, message) => {
      // TODO: Dynamically adjust attachment content
      let attachment = fbPlacesTempl();
      await bot.reply(message, { attachment: attachment });
    }
  );
};
