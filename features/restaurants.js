require('cross-fetch/polyfill');
const ApolloBoost = require('apollo-boost');
const ApolloClient = ApolloBoost.default;
const gql = ApolloBoost.gql;

require('dotenv').config();

const { BotkitConversation } = require('botkit');
const YELP_GRAPHQL_URL = 'https://api.yelp.com/v3/graphql';
const key = process.env.YELP_API_KEY;
console.log(`key is ${key}`);
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

const GET_RESTAURANT = gql`
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
      photos
    }
  }
`;

const GET_RESTAURANT_TEST = gql`
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
  console.log(
    'This is the recommendation engine, it is still under active developement, please check back later'
  );
  client
    .query({
      query: GET_RESTAURANT_TEST
    })
    .then(console.log);
};

module.exports = function(controller) {
  /* restarants */
  controller.hears(['Where to eat'], ['message'], async (bot, message) => {
    getRestaurants();
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
