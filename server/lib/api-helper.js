 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import FileHelper from './file-helper.js'

    import web3utils from 'web3-utils'
    
 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, mongoInterface){
            console.log('got api request', request.params , request.body    )

            let inputData = request.body 

            if(inputData.requestType == 'all_ERC721'){

                let publicAddress = inputData.publicAddress 


                let results = await APIHelper.findAllERC721ByOwner(publicAddress, mongoInterface)


                return {publicAddress: publicAddress, results: results  }
            }

            return 'This is the API'
        }

        static async findAllERC721ByOwner(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc721_balances',{accountAddress: publicAddress })
        }
    
         
    }