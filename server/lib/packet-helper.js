



export default class PacketHelper  {


    static async storeNewBidPacket(packet,mongoInterface){

        let packetData = Object.assign({},packet)

        packetData.createdAt = Date.now()
        packetData.status = 'active'
        packetData.lastRefreshed = 0
        packetData.suspended = false

        await mongoInterface.insertOne('bidpackets',packetData)
        return packetData
    }


    static async findBidPackets(mongoInterface, query ){
        return  await mongoInterface.findAllSortedWithLimit('bidpackets',query,{},500)
    }
    static async findBidPacketBySignature(signature, mongoInterface){
        return  await mongoInterface.findOne('bidpackets',{"signature.signature":signature}, )
    }


}
