



export default class PacketHelper  {


    static async storeNewBidPacket(packet,mongoInterface){

        let packetData = Object.assign({},packet)

        packetData.createdAt = Date.now()


        await mongoInterface.insertOne('bidpackets',packetData)
        return packetData
    }


    static async getBidPackets(mongoInterface){
        await mongoInterface.findAllSortedWithLimit('bidpackets',{},{},500)
    }



}
