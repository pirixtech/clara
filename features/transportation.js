const { BotkitConversation } = require('botkit');

var destination = 'Toronto, Ontario, Canada';
var BASE_GOOGLE_SEARCH_URL = 'https://www.google.com/maps/search/?api=1';
var BASE_GOOGLE_DIR_URL = 'https://www.google.com/maps/dir/?api=1';
const TRANSPORTATION_DIALOG_ID = 'transportation_dialog';

module.exports = function(controller) {
  function getDirection(origin, destination, travelMode) {
    let encodedOrigin = encodeURIComponent(origin);
    let encodedDestination = encodeURIComponent(destination);
    // let travelMode = encodeURIComponent(message.postback.payload);

    let googlMapDirectionUrl = `${BASE_GOOGLE_DIR_URL}&origin=${encodedOrigin}&destination=${encodedDestination}&travelmode=${travelMode}`;
    console.log(`Direction URL: ${googlMapDirectionUrl}`);
    return googlMapDirectionUrl;
  }

  function transportationDialog(bot, message) {
    const destination = new BotkitConversation(
      TRANSPORTATION_DIALOG_ID,
      controller
    );

    destination.ask(
      'Where are you now?',
      async response => {
        console.log(`you said you are at ${response}`);
      },
      'location'
    );

    destination.ask(
      'Where do you want to go?',
      async response => {
        console.log(`you said you want to go to ${response}`);
      },
      'destination'
    );

    destination.ask(
      'How are you planning to go?',
      async response => {
        console.log(`you said you want to go by ${response}`);
      },
      'travelMode'
    );

    // handle the end of the conversation
    destination.after(async (results, bot) => {
      const origin = results.location;
      const destination = results.destination;
      const travelMode = results.travelMode;
      directionUrl = getDirection(origin, destination, travelMode);
      await bot.say(
        `To get to ${destination}, follow the direction: ${directionUrl}`
      );
    });

    return destination;
  }

  // add the conversation to the dialogset
  controller.addDialog(transportationDialog());

  // launch the dialog in response to a message or event
  controller.hears(['summon', 'wake up'], ['message'], async (bot, message) => {
    await bot.reply(
      message,
      `I heard you summoned me, what do you want to do? magic word: ${
        message.text
      }`
    );

    bot.beginDialog(TRANSPORTATION_DIALOG_ID);

    // separate out into a dialog function
    // await testDialog(bot, message);
    // bot.startConversationWithUser(message, function(err, convo) {
    //   if (!err) {
    //     convo.say('I do not know your intention yet!');
    //     convo.ask(
    //       'What do you want to do?',
    //       function(response, convo) {
    //         convo.ask('You want me to call you `' + response.text + '`?', [
    //           {
    //             pattern: 'yes',
    //             callback: function(response, convo) {
    //               // since no further messages are queued after this,
    //               // the conversation will end naturally with status == 'completed'
    //               convo.next();
    //             }
    //           },
    //           {
    //             pattern: 'no',
    //             callback: function(response, convo) {
    //               // stop the conversation. this will cause it to end with status == 'stopped'
    //               convo.stop();
    //             }
    //           },
    //           {
    //             default: true,
    //             callback: function(response, convo) {
    //               convo.repeat();
    //               convo.next();
    //             }
    //           }
    //         ]);
    //         convo.next();
    //       },
    //       { key: 'location' }
    //     ); // store the results in a field called nickname
    //     convo.on('end', function(convo) {
    //       if (convo.status == 'completed') {
    //         bot.reply(message, 'OK! I will update my dossier...');
    //         // controller.storage.users.get(message.user, function (err, user) {
    //         //   if (!user) {
    //         //     user = {
    //         //       id: message.user,
    //         //     };
    //         //   }
    //         //   user.name = convo.extractResponse('nickname');
    //         //   controller.storage.users.save(user, function (err, id) {
    //         //     bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
    //         //   });
    //         // });
    //       }
    //     });
    //   }
    // });
  });

  /* transportations */
  // TODO: integrate with Google Map to determine best route and provide fixed option of transportation
  controller.hears(['How to get there'], ['message'], async (bot, message) => {
    await bot.reply(
      message,
      'Feature is under development, coming up soon ...'
    );
  });

  /* Get user current location information */
  // TODO: figure out permission issue and get user consent to share location
  controller.on('message,direct_message', (bot, message) => {
    if (message.attachments && message.attachments[0].type === 'location') {
      let latitude = message.attachments[0].payload.coordinates.lat;
      let longitude = message.attachments[0].payload.coordinates.long;
      bot.reply(message, `You are at ${latitude} / ${longitude} !`);
    } else {
      bot.reply(
        message,
        `No location information found. Use default location ${destination}`
      );
    }
  });

  controller.hears(
    [new RegExp(/How to get to (.*)?/i)],
    'message',
    async (bot, message) => {
      destination = message.matches[1].replace('?', '');
      var attachment = {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Route',
              subtitle: `How to sling shot to ${destination}`,
              image_url:
                'https://previews.123rf.com/images/theerakit/theerakit1809/theerakit180900047/109504430-location-pin-icon-on-white-background-location-pin-point-flat-style-yellow-location-pin-symbol-yello.jpg',
              buttons: [
                {
                  type: 'postback',
                  title: 'Public Transit',
                  payload: 'transit'
                },
                {
                  type: 'postback',
                  title: 'Drive',
                  payload: 'driving'
                },
                {
                  type: 'postback',
                  title: 'Walk',
                  payload: 'walking'
                }
              ]
            }
          ]
        }
      };

      await bot.reply(message, { attachment: attachment });
    }
  );

  /* Get directions via Google Map */
  controller.on('facebook_postback', async (bot, message) => {
    let origin = 'Toronto,ON';
    let encodedOrigin = encodeURIComponent(origin);
    let encodedDestination = encodeURIComponent(destination);

    console.log(`Message structure: ${Object.keys(message)}`);
    console.log(`Postback structure: ${Object.keys(message.postback)}`);
    let travelMode = encodeURIComponent(message.postback.payload);

    let googlMapDirectionUrl = `${BASE_GOOGLE_DIR_URL}&origin=${encodedOrigin}&destination=${encodedDestination}&travelmode=${travelMode}`;
    await bot.reply(
      message,
      `To get to ${destination}, follow the direction: ${googlMapDirectionUrl}`
    );
  });

  /* Get destination via Google Map */
  controller.hears(
    [new RegExp(/Where is (.*)?/i)],
    'message',
    async (bot, message) => {
      destination = message.matches[1].replace('?', '');
      let query = encodeURIComponent(destination);
      let googlMapDirectionUrl = `${BASE_GOOGLE_SEARCH_URL}&query=${query}`;
      await bot.reply(
        message,
        `Location ${destination}: ${googlMapDirectionUrl}`
      );
    }
  );
};
