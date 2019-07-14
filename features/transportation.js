const { BotkitConversation } = require('botkit');

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
    ['How to get to Bay street'],
    'message',
    async (bot, message) => {
      var attachment = {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Route',
              image_url:
                'https://previews.123rf.com/images/theerakit/theerakit1809/theerakit180900047/109504430-location-pin-icon-on-white-background-location-pin-point-flat-style-yellow-location-pin-symbol-yello.jpg',
              subtitle: 'How to sling shot there',
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
};
