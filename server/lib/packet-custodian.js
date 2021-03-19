
 
  /*

    Packet status:
    active - normal, works
    suspended - invalid token balance or approval (recoverable)
    expired - expired
    burned - sig has burned 


  */

import Web3Helper from './web3-helper.js'
import BidPacketUtils from '../../src/js/bidpacket-utils.js'

import FileHelper from './file-helper.js'

const BTFContractABI = FileHelper.readJSONFile('./src/contracts/BuyTheFloorABI.json')
const ERC20ContractABI = FileHelper.readJSONFile('./src/contracts/ERC20ABI.json')

export default class PacketCustodian  {

    constructor(web3, mongoInterface){
        this.mongoInterface = mongoInterface;
        this.web3 = web3;

        this.init() 

       
    }

    async init(){
        this.chainId = await Web3Helper.getNetworkId(this.web3);
        this.blockNumber = await Web3Helper.getBlockNumber(this.web3);
        setInterval(this.updatePackets.bind(this),1000)

        setInterval(this.updateNetData.bind(this),9000)
    }

    async updateNetData( ){
        this.blockNumber = await Web3Helper.getBlockNumber(this.web3);

    }
    
    async updatePackets( ){
        console.log('updating packets')


        let timeNow = Date.now()

        

        let allActivePackets =   await this.mongoInterface.findAll('bidpackets', {status:'active'})

        const RefreshWaitTime = (1 + allActivePackets.length)*1000;  //change this to 60 

        console.log('RefreshWaitTime',RefreshWaitTime)

        let activePackets = await this.mongoInterface.findAll('bidpackets', {status:'active', lastRefreshed: { $lt: (timeNow - RefreshWaitTime  ) }   } )

        let suspendedPackets =  await this.mongoInterface.findAll('bidpackets', {status:'suspended', lastRefreshed: { $lt: (timeNow - RefreshWaitTime  ) }   }  )


        let activeSuspendedPackets =  activePackets.concat( suspendedPackets )

        if(activeSuspendedPackets && activeSuspendedPackets.length > 0){
            let nextPacket = activeSuspendedPackets[0]

            this.refreshPacket(nextPacket)
        }
        


    }

    async refreshPacket(   packet ){
        let packetId = packet._id

        console.log('refresh packet', packetId)

        let newStatus = 'active'

        let web3 = this.web3 

        //this.web3 

        let chainId = this.chainId 
        let blockNumber = this.blockNumber
        

        let contractData = Web3Helper.getContractDataForNetwork(chainId)

        // ------ Check the hash for burned ----
        let BTFContractAddress = contractData['buythefloor'].address;

        let typedData = BidPacketUtils.getBidTypedDataFromParams(chainId, BTFContractAddress,packet.bidderAddress, packet.nftContractAddress, packet.currencyTokenAddress, packet.currencyTokenAmount, packet.expires   )
        let packetHash = BidPacketUtils.getBidTypedDataHash( typedData, typedData.types  )
        
        console.log('packetHash', packetHash)

        let BTFContract = Web3Helper.getCustomContract( BTFContractABI, BTFContractAddress , web3 )

        let signatureStatus = await BTFContract.methods.burnedSignatures( packetHash ).call()

        console.log('signatureStatus', signatureStatus)

        if(  signatureStatus != 0  ){
            newStatus = 'burned'
        }
        // ------

        // ------ Check buyers approvals and balance ----   

        let bidCurrencyAmountRaw = packet.currencyTokenAmount
        let buyerAddress = packet.bidderAddress 

        let currencyTokenContract = Web3Helper.getCustomContract( ERC20ContractABI, packet.currencyTokenAddress  , web3 )

        let bidderBalance = await currencyTokenContract.methods.balanceOf(buyerAddress)
        let bidderApproval = await currencyTokenContract.methods.allowance(buyerAddress,BTFContractAddress)

        if(bidderBalance < bidCurrencyAmountRaw){
            newStatus = 'suspended'
        }

        if(bidderApproval < bidCurrencyAmountRaw){
            newStatus = 'suspended'
        } 

        // ------


        // ------ Check expiration ----   

        if( packet.expires != 0 && packet.expires < this.blockNumber ){
            newStatus = 'expired'
        }

        // ------


        let updates = {
            $set: {  status:newStatus, lastRefreshed: Date.now()  } 
        }

        await this.mongoInterface.updateCustomAndFindOne('bidpackets', { _id: packetId }, updates   )

    }

}