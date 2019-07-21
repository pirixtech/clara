/* check the flight status and check in */
const { BotkitConversation } = require('botkit');

module.exports = function(controller) {
  /* restarants */
  controller.hears(
    [new RegExp(/When is my flight (.*)?/i)],
    ['message'],
    async (bot, message) => {
      await bot.reply(message, 'Checking flight status now..');
    }
  );
};
