var fs = require('fs');

module.exports = function(controller) {
  /* bot app version */
  controller.hears(
    ['Who are you', 'Tell me about yourself'],
    'message',
    async (bot, message) => {
      let incarnation = '0.1.0';
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
};
