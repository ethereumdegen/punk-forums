
 
 import express from 'express'
 
 import cors from 'cors'


import PacketHelper from './packet-helper.js'
import { Server } from "socket.io";

import http from 'http'
import https from 'https'

export default class PacketReceiver  {

    constructor(mongoInterface){
        this.mongoInterface = mongoInterface;


        const app = express()

        //var server = http.createServer(app);

        if(process.env.NODE_ENV == 'production'){
          var server = https.createServer({
            cert: fs.readFileSync('/home/andy/deploy/cert/buythefloor.com.pem'),
            key: fs.readFileSync('/home/andy/deploy/cert/buythefloor.com.key')
          });
          console.log('--using https--')
        }else{
          var server = http.createServer(app);
        }
       
        

 
         app.use(cors());

       /*   app.all('/*', function(req, res, next) {
           
           // res.header('Access-Control-Allow-Origin', '*');
          //  res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
            next();
        }); */

        
     


        this.startSocketServer(server)
    }


    startSocketServer(server )
    {
    
    
        //THIS IS CORRECT for v3 
      let options={
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          
        }
      }
     
    
      

      //const httpServer = createServer();
      const io = new Server(server, options);
     // io.set( 'origins', '*buythefloor.com*' );

      //var io = require('socket.io')(server, options);
      var port = process.env.PORT || 8443;  //8443
      
      var mongoInterface = this.mongoInterface
    
      ///  https://socket.io/docs/rooms-and-namespaces/#
    
    
      server.listen(port, function () {
        console.log('Socket server listening at port %d', port);
      });
    
      var sockets = {};
    
    
      io.on('connection', function (socket) {
        console.log('established new socket connection');
    
    
            socket.on('ping', function (data) {
              console.log('ping', data);
    
                io.emit('pong', {
                    message:'pong'
                  });
    
    
               });
    
    
    
      
    
    
            socket.on('submitBidPacket', async function (data) {
    
                 let packet = data.packet 
    
                console.log('got Websocket data', data  )
    
          


                    var bidPacket = {
                        bidderAddress:packet.bidderAddress,
                        nftContractAddress: packet.nftContractAddress,
                        currencyTokenAddress: packet.currencyTokenAddress,
                        currencyTokenAmount: packet.currencyTokenAmount,
                        expires:packet.expires,
                        signature:packet.signature,
                        exchangeContractAddress: packet.exchangeContractAddress
                    }
                    console.log('got Websocket packet', bidPacket  )
    
                    var result = await PacketHelper.storeNewBidPacket(packet,  mongoInterface);
     
    
                 socket.emit('submittedBidPacket',  {success:true, saved:result });
    
                 socket.disconnect()
    
            }.bind(this));
    
    
    
     
    
             socket.on('bidPackets', async function (data) {
             
             
              let query = {} 
              if(data.query){
                let queryString = JSON.stringify(data.query)
                  query = JSON.parse(queryString.replace("$", " "))
  
              }
             
                var bidPackets = await PacketHelper.findBidPackets( mongoInterface, query )

              
                socket.emit('bidPackets',  bidPackets);
                socket.disconnect()
              });


              socket.on('bidPacket', async function (data) {
                        console.log('findBidPacketBySignature', data)
                var bidPackets = await PacketHelper.findBidPacketBySignature(data.signature, mongoInterface)

               
   
               socket.emit('bidPacket',  bidPackets);
               socket.disconnect()
             });
    
              
          
        socket.on('disconnect', function () {
          console.log(socket.sid, 'disconnected');
          delete sockets[socket.sid];
        });
      }.bind(this));
    
    
    
    }
    

}