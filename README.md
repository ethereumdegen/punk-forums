# Cryptopunk Forums 
  
Unofficial web forum for Cryptopunks by Larva Labs
 


### Dev Notes
 


-add reply feature
-add categories
-add metrics 

-if changed accts and number of punks is 0 , sign out of punk (using localstorage) 


-getting erc20 balance doesnt work
-need to wolfpack events from Payspec 


-Add custom frontend color schemes, based on punks colors. (limited) 


### Development commands
```
npm install
npm run server-dev  (in terminal 1)
npm run dev  (in terminal 2)
```

### Packaging commands
```
npm run build
npm run server
```


## using pm2

 pm2 start pm2.config.json --env production 
pm2 monit 