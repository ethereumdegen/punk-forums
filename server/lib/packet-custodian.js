
 
  

export default class PacketCustodian  {

    constructor(web3, mongoInterface){
        this.mongoInterface = mongoInterface;
        this.web3 = web3;

        setInterval(this.updatePackets.bind(this),2000)
    }

    
    async updatePackets(){
        console.log('updating packets')



    }

}