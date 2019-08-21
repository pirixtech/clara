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

  controller.hears(['Gateway'], ['message'], async (bot, message) => {
    bot.beginDialog(GET_STARTED_DIALOG_ID);
  });

  controller.hears(
    [/^Help$/, 'Get Started'],
    'direct_message,direct_mention,message',
    async function(bot, message) {
      let restaurants = 'restarant experience';
      let shopping = 'shopping experience';
      let transportations = 'go to where you want to go';
      let locations = 'places of interest experience';
      let secrets = 'unique secret experience, unlock me';

      quickReply = {
        text: `Use your imagination, you can go to all the time and spaces, what would you do?`,
        quick_replies: [
          {
            content_type: 'text',
            title: `I'm Hungry!`,
            payload: 'Foodie'
          },
          {
            content_type: 'text',
            title: `How do I get to ... ?`,
            payload: 'Transportation'
          },
          {
            content_type: 'text',
            title: `Experience`,
            payload: 'Adventure'
          },
          {
            content_type: 'text',
            title: `I'm feeling lucky`,
            payload: 'Feeling Lucky'
          },
          {
            content_type: 'text',
            title: `Surprise me`,
            payload: 'Surprise me'
          }
        ]
      };

      await bot.reply(message, quickReply);
    }
  );
};
