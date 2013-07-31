# send-film

Delivers a nightly email with a movie you can watch.

## Usage

```bash
heroku create
heroku addons:add scheduler:standard
heroku addons:add sendgrid:starter
heroku config:set TO=you@youremail.com
git push heroku master
```

Lastly, setup a recurring task each morning to send you the email. Use heroku scheduler for this. Add the job to look like this:

|Task       | Dyno Size | Frequency |
|-----------|-----------|-----------|
|node ./task.js|  1x    | Daily     |

## Dev Setup

```bash
touch .env
```

Place the following in your .env file:

```
SENDGRID_USERNAME=sendgrid_username
SENDGRID_PASSWORD=sendgrid_password
TO=your@email.com
```

Now you can run:

```bash
node ./task.js
```


