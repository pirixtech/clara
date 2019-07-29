const { BotkitConversation } = require('botkit');

const GET_STARTED_DIALOG_ID = 'get_started_dialog';

module.exports = function(controller) {
  function getStartedDialog() {
    const onboarding = new BotkitConversation(
      GET_STARTED_DIALOG_ID,
      controller
    );

    onboarding.ask(
      'What is your name?',
      async answer => {
        // do nothing.
      },
      'name'
    );

    // collect a value with conditional actions
    onboarding.ask(
      'Do you like tacos?',
      [
        {
          pattern: 'yes',
          handler: async function(answer, convo, bot) {
            await convo.gotoThread('likes_tacos');
          }
        },
        {
          pattern: 'no',
          handler: async function(answer, convo, bot) {
            await convo.gotoThread('hates_life');
          }
        }
      ],
      { key: 'tacos' }
    );

    // define a 'likes_tacos' thread
    onboarding.addMessage('HOORAY TACOS', 'likes_tacos');

    // define a 'hates_life' thread
    onboarding.addMessage('TOO BAD!', 'hates_life');

    // handle the end of the conversation
    onboarding.after(async (results, bot) => {
      const name = results.name;
    });

    return onboarding;
  }

  // add the conversation to the dialogset
  controller.addDialog(getStartedDialog());

  controller.hears(['get started'], ['message'], async (bot, message) => {
    bot.beginDialog(GET_STARTED_DIALOG_ID);
  });
};
