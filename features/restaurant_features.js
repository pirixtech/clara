module.exports = function(controller) {
  /* restarants */
  controller.hears(['where to eat'], ['message'], async (bot, message) => {
    await bot.reply(message, 'Pai is the best Thai restaurant in Toronto!');
  });
};
