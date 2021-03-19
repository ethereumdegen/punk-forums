# BUY THE FLOOR 
 


Dev and building requires node 10 (fix later) 

Server requires node 14 


--  Need to hide expired and burned bids !!!   (need to check for burned bids on server side, use alchemy )
--  if a bid has hash that is  burned, it will have its status marked as 'burned'

- if a bid had its liquidity or approval removed it will have its status 'disabled' 


IMPROVE LATER: 
- build subgraphs for wrapped mooncats and wrapped punks that give orig ids and wrap ids  !!! Per owner .


### TODO
1) Build the NEW BID page 
-done

2) Finish data querying using alchemy on server  to mark bids 

2.5)   Limit users to only having 10 bids,  min amt for bid 



3) build subgraphs to be able to show users items on website 

4) make it easier to wrap things - wrapping on the site 





 


## Kovan
 



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
