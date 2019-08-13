require('cross-fetch/polyfill');
const ApolloBoost = require('apollo-boost');
const ApolloClient = ApolloBoost.default;
const gql = ApolloBoost.gql;

const DIALOG_ID = 'restaurant_guide';

require('dotenv').config();

const { BotkitConversation } = require('botkit');
const YELP_GRAPHQL_URL = 'https://api.yelp.com/v3/graphql';
const key = process.env.YELP_API_KEY;
// console.log(`key is ${key}`);
const client = new ApolloClient({
  uri: YELP_GRAPHQL_URL,
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${key}`
      }
    });
  }
});
// Integrate with Yelp GraphQL (Fusion API as a fallback solution)

const GET_RESTAURANTS = gql`
  {
    business(id: "garaje-san-francisco") {
      name
      id
      is_claimed
      is_closed
      url
      phone
      display_phone
      review_count
      rating
    }
  }
`;

const GET_RESTAURANTS_TEST = gql`
  {
    business(id: "garaje-san-francisco") {
      name
    }
  }
`;

/* recommend restaurants based on profile
 * @param {string} profile - profile of the person looking for ideas
 */
function recommend() {
  console.log(
    'This is the recommendation engine, it is still under active developement, please check back later'
  );
}

/**
 * retrieve a list of restaurants from Yelp located close to the person's current location
 */
var getRestaurants = function() {
  console.log('Scanning foodies heaven, standing by ...');
  client
    .query({
      query: GET_RESTAURANTS_TEST
    })
    .then(console.log);
  // .then(payload => {
  //   console.log(payload);
  // })
  // .then(payload => {
  //   return Promise.resolve(payload);
  // });
};

module.exports = function(controller) {
  function recommendRestaurantDialog(location) {
    const restaurantDialog = new BotkitConversation(DIALOG_ID, controller);

    restaurantDialog.say(`Scanning restaurants within 5 miles of ${location}`);
    // TODO: add more dialogue flow

    // handle the end of the conversation
    restaurantDialog.after(async (results, bot) => {
      // get restaurant from Yelp
      // restaurant = getRestaurants().then;
      await bot.say(`${getRestaurants()} is highly recommended!`);
    });

    return restaurantDialog;
  }

  // TODO: replace with location field parsed from message
  let location = 'Toronto';
  controller.addDialog(recommendRestaurantDialog(location));

  controller.hears(["I'm hungry"], 'message', async (bot, message) => {
    console.log(`Message structure keys: ${Object.keys(message)}`);
    console.log(`Message structure values: ${Object.values(message)}`);
    // incoming message
    console.log(
      `ingested raw message keys: ${Object.keys(message.incoming_message)}`
    );
    console.log(
      `ingested raw message values: ${Object.values(message.incoming_message)}`
    );
    // conversation
    console.log(
      `ingested raw message conversation keys: ${Object.keys(
        message.incoming_message.conversation
      )}`
    );
    console.log(
      `ingested raw message conversation values: ${Object.values(
        message.incoming_message.conversation
      )}`
    );
    // channelData
    console.log(
      `ingested raw message channelData keys: ${Object.keys(
        message.incoming_message.channelData
      )}`
    );
    console.log(
      `ingested raw message channelData values: ${Object.values(
        message.incoming_message.channelData
      )}`
    );
    // from
    console.log(
      `ingested raw message from keys: ${Object.keys(
        message.incoming_message.from
      )}`
    );
    console.log(
      `ingested raw message from values: ${Object.values(
        message.incoming_message.from
      )}`
    );
    // recipient
    console.log(
      `ingested raw message recipient keys: ${Object.keys(
        message.incoming_message.recipient
      )}`
    );
    console.log(
      `ingested raw message recipient values: ${Object.values(
        message.incoming_message.recipient
      )}`
    );

    console.log(
      `ingested raw message channelData sender keys: ${Object.keys(
        message.incoming_message.channelData.sender
      )}`
    );
    console.log(
      `ingested raw message channelData recipient keys: ${Object.keys(
        message.incoming_message.channelData.recipient
      )}`
    );

    console.log(
      `ingested raw message channelData message keys: ${Object.keys(
        message.incoming_message.channelData.message
      )}`
    );
    console.log(
      `ingested raw message channelData message values: ${Object.values(
        message.incoming_message.channelData.message
      )}`
    );

    await bot.beginDialog(DIALOG_ID);
  });
};
