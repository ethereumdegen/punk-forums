

import { io } from "socket.io-client";


export default class BidPacketHelper {


    static async sendBidPacket(serverURL, packetData)
  {
 

      return new Promise(async resolve => {

         

        const socket = io( serverURL );

        
        socket.emit("bidPacket", {packet: packetData} );


        socket.on("bidPacket",(data) => {
          console.log('got back',data)
          resolve(data)
        });

       

      })


  }




}