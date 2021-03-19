

import { io } from "socket.io-client";


export default class BidPacketHelper {


    static async sendBidPacket(serverURL, packetData)
  {
 

      return new Promise(async resolve => {

         

        const socket = io( serverURL );

        
        


        socket.on("submitBidPacket",(data) => {
          console.log('got back',data)
          resolve(data)
        });

        socket.emit("submittedBidPacket", {packet: packetData} );

       

      })


  }


  static async getBidPackets( serverURL )
  {
 

      return new Promise(async resolve => {

         

        const socket = io( serverURL );

        socket.on("bidPackets",(data) => {
            console.log('got back',data)
            resolve(data)
          });
        
        socket.emit("bidPackets", { } ); 
        

       

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