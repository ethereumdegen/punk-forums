# Starflask API Web
 
Web frontend for API Service
 

 


### TODO
-add a token-based login (like ESW) 
-allow logged-in users to generate API key 
-when a new request comes in, increment use counter on API key - limit max 

-Require 


-Certain api keys will have allowlists - can only come from certain domain 


### Development commands
```
npm install
npm run dev
```

### Packaging commands
```
npm run build
npm run server
```


## using pm2

 pm2 start pm2.config.json --env production 
pm2 monit 