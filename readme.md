## /.env file

Replace {{key}} with respective value. For example:

`MONGODB_URI={{mongoUrl}}` will become something like `MONGODB_URI=mongodb://localhost:27017/tutorial_dev`

```
MONGODB_URI={{mongoUrl}}
SECRET={{randomString}}
PORT=3000
GOOGLE_CLIENT_ID={{client id from google dev console google + api}}
GOOGLE_CLIENT_SECRET={{client secret from google dev console google + api}}
SESSION_SECRET={{randomString}}
```

## generate keys

`node generateKeypair.js`

## run project

`npm i` && `npm run dev`

## JWT AUTH

http://localhost:3000/auth/jwt/register
http://localhost:3000/auth/jwt/login

## GOOGLE AUTH

http://localhost:3000/auth/google/

## FACEBOOK AUTH

http://localhost:3000/auth/facebook

## LOCAL AUTH
