 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import FileHelper from './file-helper.js'
    
 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, mongoInterface){
            console.log('got api request', request.params , request.body    )

            let inputData = request.body 

            if(inputData.requestType == 'all_ERC721'){

                let publicAddress = inputData.publicAddress 


                return {publicAddress: publicAddress, result: []  }
            }

            return 'This is the API'
        }
    
         
    }