var fs = require('fs');
var git = require('git-last-commit');
const release = '0.1.15';

module.exports = function(controller) {
  /* bot app version */
  function commit() {
    git.getLastCommit(function(err, commit) {
      // read commit object properties
      console.log(commit);
      return commit;
    });
  }

  controller.hears(
    ['Who are you', 'Tell me about yourself'],
    'message',
    async (bot, message) => {
      git.getLastCommit(function(err, commit) {
        // read commit object properties
        console.log(commit);
        return commit;
      });
      commit = '12345';
      // let commit = commit();
      let age = release + '-' + commit;

      await bot.reply(message, "I'm the " + String(age) + ' impossible girl');
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
