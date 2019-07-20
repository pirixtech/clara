# Clara

[![Dependencies](https://api.dependabot.com/badges/status?host=github&repo=pirixtech/clara)](https://app.dependabot.com/accounts/pirixtech/repos/196296923)

This is a Botkit starter kit for facebook, created with the [Yeoman generator](https://github.com/howdyai/botkit/tree/master/packages/generator-botkit#readme)

[Botkit Docs](https://botkit.ai/docs/v4)

This bot is powered by [a folder full of modules](https://botkit.ai/docs/v4/core.html#organize-your-bot-code).
Edit the samples, and add your own in the [features/](features/) folder.

## Get Started

```bash
# get secret
git secret reveal
```

```bash
# install prerequsites and launch app
npm install
npm start
```

for local development

```bash
ngrok http 3000

# note down ngrok tunnel url
# create facebook app follow https://medium.com/@pranavbhatia_26901/building-a-facebook-bot-using-botkit-ai-on-node-js-bd6146df401a
# verify webhook
for `callback url`: ngrok url (DO NOT add `/facebook/receive` at the end! it doesn\'t work)
for `verify token`: put `FACEBOOK_VERIFY_TOKEN` from `.env` file
```

for online app hosting in Heroku

```bash
heroku create <app_name>
heroku git:remote --app <app_name>
git push heroku master
# create facebook app follow https://medium.com/@pranavbhatia_26901/building-a-facebook-bot-using-botkit-ai-on-node-js-bd6146df401a
# verify webhook
for `callback url`: heroku url (DO NOT add `/facebook/receive` at the end! it doesn\'t work)
for `verify token`: put `FACEBOOK_VERIFY_TOKEN` from `.env` file
```
