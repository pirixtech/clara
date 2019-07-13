module.exports = function(controller) {
  /* experience */
  controller.hears(
    "I'm looking for something fun!",
    'message',
    async (bot, message) => {
      await bot.reply(message, 'Edge Walk in CN Tower!');
    }
  );
};
