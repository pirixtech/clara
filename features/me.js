var fs = require('fs');

module.exports = function(controller) {
  /* bot app version */
  controller.hears(
    ['Who are you', 'Tell me about yourself'],
    'message',
    async (bot, message) => {
      let incarnation = '0.1.8';
      // let incarnation = version();
      await bot.reply(
        message,
        "I'm the " + String(incarnation) + ' impossible girl'
      );
    }
  );

  function version() {
    const rev = fs.readFileSync('../git/HEAD').toString();
    if (rev.indexOf(':') === -1) {
      return rev;
    } else {
      return fs.readFileSync('..git/' + rev.substring(5)).toString();
    }
  }

  controller.hears(
    [/^Help$/],
    'direct_message,direct_mention,message',
    async function(bot, message) {
      let restaurants = 'restarant experience';
      let shopping = 'shopping experience';
      let transportations = 'go to where you want to go';
      let locations = 'places of interest experience';
      let secrets = 'unique secret experience, unlock me';
      let text =
        'Here are my skills:' +
        '\n' +
        restaurants +
        '\n' +
        shopping +
        '\n' +
        transportations +
        '\n' +
        locations +
        '\n' +
        secrets;

      await bot.reply(message, text);
    }
  );
};
