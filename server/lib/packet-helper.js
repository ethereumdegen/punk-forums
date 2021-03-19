



export default class PacketHelper  {


    static async storeNewBidPacket(packet,mongoInterface){

        let packetData = Object.assign({},packet)

        packetData.createdAt = Date.now()


        await mongoInterface.insertOne('bidpackets',packetData)
        return packetData
    }


    static async getBidPackets(mongoInterface){
        return  await mongoInterface.findAllSortedWithLimit('bidpackets',{},{},500)
    }
    static async findBidPacketBySignature(signature, mongoInterface){
        return  await mongoInterface.findOne('bidpackets',{"signature.signature":signature}, )
    }


}
