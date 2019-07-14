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
};
