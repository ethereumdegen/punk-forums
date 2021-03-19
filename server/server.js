


import MongoInterface from './lib/mongo-interface.js'

 import PacketReceiver from './lib/packet-receiver.js'


  async function start(){
    let mongoInterface = new MongoInterface( 'bidthefloor' ) 


    let packetReceiver = new PacketReceiver(mongoInterface)
     
    
    

}

 
 start()