const { BotkitConversation } = require('botkit');

var destination = 'Toronto, Ontario, Canada';

module.exports = function(controller) {
  /* transportations */
  // TODO: integrate with Google Map to determine best route and provide fixed option of transportation
  controller.hears(['How to get there'], ['message'], async (bot, message) => {
    await bot.reply(
      message,
      'Feature is under development, coming up soon ...'
    );
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

  controller.on('message', (bot, message) => {
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

  controller.on('facebook_postback', async (bot, message) => {
    let query = encodeURIComponent(destination);
    let googlMapDirectionUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    await bot.reply(
      message,
      `To get to ${destination}: ${googlMapDirectionUrl}`
    );
  });
};
