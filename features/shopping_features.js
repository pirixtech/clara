module.exports = function(controller) {
  /* shopping */
  controller.hears(
    'any places to go shopping',
    'message',
    async (bot, message) => {
      await bot.reply(message, 'Yorkville Mall');
    }
  );
};
