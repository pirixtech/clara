require('cross-fetch/polyfill');
const ApolloBoost = require('apollo-boost');
const ApolloClient = ApolloBoost.default;
const gql = ApolloBoost.gql;

const DIALOG_ID = 'restaurant_guide';
var RESTAURANT_HEAVEN = 'Pai';

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
    search(term: "burrito", location: "san francisco") {
      total
      business {
        name
      }
    }
  }
`;

async function constructGraphqlQuery(location, foodType) {
  query = gql`{
    search(term: "${foodType}", location: "${location}", limit: 5) {
      total
      business {
        name
      }
    }
  }`;
  console.log('query is ' + query);
  return query;
}

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
async function getRestaurants(myQuery) {
  console.log('Scanning foodies heaven, standing by ...');
  console.log(`query sent in is ${myQuery}`);
  heaven = await client
    .query({
      query: myQuery
    })
    .then(result => {
      console.log(result);
      businessNames = [];
      businesses = result.data.search.business;
      debug_obj = JSON.stringify(businesses);
      console.log(`businesses = ${debug_obj}`);
      businesses.forEach(element => {
        businessNames.push(element.name);
        name = JSON.stringify(element.name);
        console.log(`business name is ${name}`);
      });

      console.log(`businessNames = ${businessNames}`);
      return businessNames;
    })
    .catch(error => {
      console.log(`ERROR: ${error}`);
    });

  return heaven;
}

module.exports = function(controller) {
  function recommendRestaurantDialog() {
    const restaurantDialog = new BotkitConversation(DIALOG_ID, controller);

    restaurantDialog.ask(
      'Where are you now?',
      async response => {
        console.log(`you said you are at ${response}`);
      },
      'location'
    );

    restaurantDialog.ask(
      'What type of food are you craving?',
      async response => {
        console.log(`you said you want to devour ${response}`);
      },
      'foodType'
    );

    restaurantDialog.say(
      'Scanning restaurants within 5 miles of your location...'
    );
    // TODO: add more dialogue flow

    restaurantDialog.after(async (results, bot) => {
      // get restaurant from Yelp
      query = await constructGraphqlQuery(results.location, results.foodType);
      restaurants = await getRestaurants(query);
      await bot.say(
        `${restaurants} are highly recommended near ${results.location}!`
      );
    });

    return restaurantDialog;
  }

  // TODO: replace with location field parsed from message
  // let location = 'Toronto';
  controller.addDialog(recommendRestaurantDialog());

  controller.hears(["I'm hungry"], 'message', async (bot, message) => {
    await bot.beginDialog(DIALOG_ID);
  });
};
