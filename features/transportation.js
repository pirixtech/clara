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
              title: 'Chocolate Cookie',
              image_url: 'http://cookies.com/cookie.png',
              subtitle: 'A delicious chocolate cookie',
              buttons: [
                {
                  type: 'postback',
                  title: 'Eat Cookie',
                  payload: 'chocolate'
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
