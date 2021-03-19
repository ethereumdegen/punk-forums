# BUY THE FLOOR 
 


Dev and building requires node 10 (fix later) 

Server requires node 14 


-- use sockets to post bids 



### TODO
1) Build the NEW BID page 

-user picks their token currency from dropdown   (approval bar appears below )
-picks the NFT type they want from dropdown  (the address will appear below) 

-Specifies how much they are willing to pay 
-Specifies how many blocks it expires in 

-Clicks a button which does the personalsign,   an output is shown with their signature 

- This signature is posted to MONGO 


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
