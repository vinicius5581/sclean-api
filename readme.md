## Setup

Replace {{key}} with respective value. For example: 

MONGODB_URI={{mongoUrl}} 

should become something like 

MONGODB_URI=mongodb://localhost:27017/tutorial_dev

```
MONGODB_URI={{mongoUrl}}
SECRET={{randomString}}
PORT=3000
GOOGLE_CLIENT_ID={{client id from google dev console google + api}}
GOOGLE_CLIENT_SECRET={{client secret from google dev console google + api}}
SESSION_SECRET={{randomString}}
```

## run project

```
npm run dev
```