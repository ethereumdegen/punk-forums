

import { io } from "socket.io-client";


export default class BidPacketHelper {


    static async sendBidPacket(serverURL, packetData)
  {
 

      return new Promise(async resolve => {

         

        const socket = io( serverURL );

         
        socket.on("submittedBidPacket",(data) => {
          console.log('got back',data)
          resolve(data)
        });

        socket.emit("submitBidPacket", {packet: packetData} );

       

      })


  }


  static async getBidPackets( serverURL , query )
  {
 

      return new Promise(async resolve => {

         

        const socket = io( serverURL );

        socket.on("bidPackets",(data) => {
            console.log('got back',data)
            resolve(data)
          });
        
        socket.emit("bidPackets", {query:query} ); 
        

       

      })


  }


  static async findBidPacket( signature, serverURL )
  {
        
      return new Promise(async resolve => {

         

        const socket = io( serverURL );

        socket.on("bidPacket",(data) => {
            console.log('got back',data)
            resolve(data)
          });
        
        socket.emit("bidPacket", {signature: signature} ); 
        

       

      })


  }





}