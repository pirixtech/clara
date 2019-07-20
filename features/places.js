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

module.exports = function(controller) {
  /* places */
  controller.hears(
    ['Where to have fun', 'Places to see'],
    ['message'],
    async (bot, message) => {
      // TODO: Dynamically adjust attachment content
      let attachment = {
        type: 'template',
        payload: {
          template_type: 'list',
          top_element_style: 'compact',
          elements: [
            {
              title: "Toooooooooo many people, Please don't go",
              subtitle: `Might as well check it out`,
              image_url:
                'https://www.narcity.com/uploads/225509_16595a5286911f0089695cc9cc12c7249c4db89a.jpg_facebook.jpg',
              buttons: [
                {
                  title: 'View',
                  type: 'web_url',
                  url: 'https://www.seetorontonow.com/listings/cn-tower/',
                  messenger_extensions: true,
                  webview_height_ratio: 'tall',
                  fallback_url:
                    'https://earth.google.com/web/@43.6425662,-79.3870568,380.83523438a,739.24756514d,35y,0h,45t,0r/data=CksaSRJDCiUweDg4MmIzNGQ2OGJmMzNhOWI6MHgxNWVkZDhjNGRlMWM3NTgxGetB95s_0kVAIXFs4onF2FPAKghDTiBUb3dlchgCIAEoAg'
                }
              ]
            },
            {
              title: "Too many fake reviews, don't go there",
              subtitle: `Might as well check it out`,
              default_action: {
                type: 'web_url',
                url:
                  'https://www.narcity.com/uploads/263270_4308a16e472d5527b03392819f8802fa714c620a.png_facebook.png',
                messenger_extensions: false,
                webview_height_ratio: 'tall'
              }
            }
          ],
          buttons: [
            {
              title: 'View More',
              type: 'postback',
              payload: 'payload'
            }
          ]
        }
      };

      await bot.reply(message, { attachment: attachment });
    }
  );
};
