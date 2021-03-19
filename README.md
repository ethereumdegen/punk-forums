# BUY THE FLOOR 
 


Dev and building requires node 10 (fix later) 

Server requires node 14 


--  Need to hide expired and burned bids !!!   (need to check for burned bids on server side, use alchemy )
--  if a bid has hash that is  burned, it will have its status marked as 'burned'

- if a bid had its liquidity or approval removed it will have its status 'disabled' 


- build subgraphs for wrapped mooncats and wrapped punks that give orig ids and wrap ids  !!! Per owner .


### TODO
1) Build the NEW BID page 
-done

2) Build the PROFILE page 

-user sees their mooncats and wrapped punks 
-User can click on one (/nfts/_contractaddress/_tokenid)

3) Build the SHOW page

-user sees a rendering of the NFT and all bids that apply to that token 
-user can click a button to call the WEB3 method which will sell their NFT to the floor 




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
