var fs = require('fs');
// var git = require('git-last-commit');
var git = require('git-rev-sync');

const release = '0.2.1';

module.exports = function(controller) {
  /* bot app version */
  async function commit() {
    return new Promise((resolve, reject) => {
      git.getLastCommit((err, commit) => {
        if (err) return reject(err);
        // read commit object properties
        console.log(commit);
        return resolve(commit);
      });
    });
  }

  controller.hears(
    ['Who are you', 'Tell me about yourself'],
    'message',
    async (bot, message) => {
      // console.log(git.short());

      // git.getLastCommit(function(err, commit) {
      //   // read commit object properties
      //   console.log('------- commit is: ' + commit);
      //   return commit;
      // });
      // commit = '12345';
      // let commit = await commit();
      let age = release;

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
};
