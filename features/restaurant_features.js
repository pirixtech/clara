const { BotkitConversation } = require('botkit');

module.exports = function(controller) {
  /* restarants */
  controller.hears(['Where to eat'], ['message'], async (bot, message) => {
    await bot.reply(message, 'Pai is the best Thai restaurant in Toronto!');
  });

  let DIALOG_ID = 'restaurant_guide';
  let restaurantDialog = new BotkitConversation(DIALOG_ID, controller);
  // TODO: replace with location field parsed from message
  let location = 'Toronto';
  restaurantDialog.say('Hola!');
  restaurantDialog.say('Welcome to ' + location + '!');
  controller.addDialog(restaurantDialog);

  controller.hears(["I'm hungry"], 'message', async (bot, message) => {
    await bot.beginDialog(DIALOG_ID);
  });
};
