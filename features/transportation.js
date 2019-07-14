const { BotkitConversation } = require('botkit');

var destination = 'Toronto, Ontario, Canada';
var BASE_GOOGLE_MAP_URL = 'https://www.google.com/maps/search/?api=1';

module.exports = function(controller) {
  /* transportations */
  // TODO: integrate with Google Map to determine best route and provide fixed option of transportation
  controller.hears(['How to get there'], ['message'], async (bot, message) => {
    await bot.reply(
      message,
      'Feature is under development, coming up soon ...'
    );
  });

  /* Get user current location information */
  // TODO: figure out permission issue and get user consent to share location
  controller.on('message,direct_message', (bot, message) => {
    if (message.attachments && message.attachments[0].type === 'location') {
      let latitude = message.attachments[0].payload.coordinates.lat;
      let longitude = message.attachments[0].payload.coordinates.long;
      bot.reply(message, `You are at ${latitude} / ${longitude} !`);
    } else {
      bot.reply(
        message,
        `No location information found. Use default location ${destination}`
      );
    }
  });

  controller.hears(
    [new RegExp(/How to get to (.*)?/i)],
    'message',
    async (bot, message) => {
      destination = message.matches[1].replace('?', '');
      var attachment = {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Route',
              image_url:
                'https://previews.123rf.com/images/theerakit/theerakit1809/theerakit180900047/109504430-location-pin-icon-on-white-background-location-pin-point-flat-style-yellow-location-pin-symbol-yello.jpg',
              subtitle: `How to sling shot to ${destination}`,
              buttons: [
                {
                  type: 'postback',
                  title: 'Public Transit',
                  payload: 'public transit'
                },
                {
                  type: 'postback',
                  title: 'Walk',
                  payload: 'walk'
                },
                {
                  type: 'postback',
                  title: 'Rental',
                  payload: 'rental'
                }
              ]
            }
          ]
        }
      };

      await bot.reply(message, { attachment: attachment });
    }
  );

  /* Get directions via Google Map */
  controller.on('facebook_postback', async (bot, message) => {
    let origin = 'Toronto, ON, Canada';
    let encodedOrigin = encodeURIComponent(origin);
    let encodedDestination = encodeURIComponent(destination);

    console.log(`Message structure: ${Object.keys(message)}`);
    console.log(`Postback structure: ${Object.keys(message.postback)}`);
    let travelMode = encodeURIComponent(message.postback.payload);

    // let travelMode = 'walking';
    let googlMapDirectionUrl = `${BASE_GOOGLE_MAP_URL}&origin=${encodedOrigin}&destination=${encodedDestination}&travelmode=${travelMode}`;
    await bot.reply(
      message,
      `To get to ${destination}, follow the direction: ${googlMapDirectionUrl}`
    );
  });

  /* Get destination via Google Map */
  controller.hears(
    [new RegExp(/Where is (.*)?/i)],
    'message',
    async (bot, message) => {
      destination = message.matches[1].replace('?', '');
      let query = encodeURIComponent(destination);
      let googlMapDirectionUrl = `${BASE_GOOGLE_MAP_URL}&query=${query}`;
      await bot.reply(
        message,
        `Location ${destination}: ${googlMapDirectionUrl}`
      );
    }
  );
};
