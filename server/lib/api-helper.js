 
    //const ethJsUtil = require('ethereumjs-util')
    import ethJsUtil from 'ethereumjs-util'


    import web3utils from 'web3-utils'
    import ApplicationManager from './application-manager.js'
    
    import ForumManager  from './forum-manager.js'

    import FileHelper from './file-helper.js'


    const contractData = FileHelper.readJSONFile('./src/config/contractdata.json')

    const allPunkData =  FileHelper.readJSONFile('./src/config/punkAttributes2.json')


    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, serverConfig,  wolfpackInterface, mongoInterface){
           
            let inputData = request.body 



                /*
            if(inputData.requestType == 'forum_categories'){
                let categoriesData =  [
                    'General Discussion'
                ]
                 
                
                return {success:true, input: {}, output: categoriesData  }
            } */


              
            if(inputData.requestType == 'punk'){
                let punkId = parseInt( inputData.input.punkId ) 


                let networkName = serverConfig.networkName 

                let punkContractAddress = contractData[networkName].contracts['cryptopunks'].address

                let record = await APIHelper.findERC721OwnerByTokenAndTokenId( punkContractAddress,  punkId, wolfpackInterface  )
                console.log('record',record)
                if(record){
                    return {success:true, input: {}, output: record  }
                }
                
                return {success: false  }
            } 


            if(inputData.requestType == 'create_authtoken'){

                let personalSignatureIsValid = APIHelper.validatePersonalSignature(inputData.input)
                
                if(!personalSignatureIsValid){
                    return {success:false, input: inputData.input }
                }
 
                let tokenData = {
                    publicAddress: APIHelper.sanitizeInput(inputData.input.fromAddress) ,
                    tokenHash: web3utils.randomHex(32),
                    signedAt: APIHelper.sanitizeInput( inputData.input.signedAt )

                }

                let storedToken = await mongoInterface.upsertOne( 'authtokens', {publicAddress: APIHelper.sanitizeInput(inputData.input.fromAddress)   } , tokenData)

                if(storedToken){
                    return {success: true, input: {}, output: tokenData   }
                }

                return {success:false, input: inputData.input }
            }

 
              
            if(inputData.requestType == 'create_thread'){
                
                let personalSignatureIsValid = APIHelper.validatePersonalSignature(inputData.input)
                
                if(!personalSignatureIsValid){
                    return {success:false, input: inputData.input, message: 'Invalid signature' }
                }


                let userOwnsPunk = await APIHelper.validatePunkOwnership(inputData.input.fromAddress, inputData.input.punkId, wolfpackInterface , serverConfig)

                if(!userOwnsPunk){
                    return {success:false, input: inputData.input, message: 'Not owner of punk' }
                }

 

                let newTopic = await ForumManager.createNewTopic(  inputData.input , mongoInterface )

                if(!newTopic.success){
                    return {success:false, input: inputData.input, message: newTopic.message }
                }

                let inputPostData = {
                    markdownInput: inputData.input.markdownInput,
                    punkId: parseInt( inputData.input.punkId  ),
                    fromAddress: APIHelper.sanitizeInput( inputData.input.fromAddress) 
                }

                let newPost = await ForumManager.createNewPost(  inputPostData , APIHelper.sanitizeInput( newTopic.topicHash ) , mongoInterface )

                if(!newPost.success){
                    return {success:false, input: inputData.input, message: newPost.message}
                }

                if(newTopic.success && newPost.success){
                    return {success:true, input: inputData.input, output: {topicHash: newTopic.topicHash}  }
                }
                
                return {success:false, input: inputData.input, message:'Could not create database record' }
            } 


            if(inputData.requestType == 'create_post'){

                let personalSignatureIsValid = APIHelper.validatePersonalSignature(inputData.input)
                
                if(!personalSignatureIsValid){
                    return {success:false, input: inputData.input, message: 'Invalid signature.' }
                }


                let userOwnsPunk = await APIHelper.validatePunkOwnership(inputData.input.fromAddress, inputData.input.punkId, wolfpackInterface , serverConfig)

                if(!userOwnsPunk){
                    return {success:false, input: inputData.input, message: 'Not owner of punk' }
                }


                let inputPostData = {
                    markdownInput: inputData.input.markdownInput,
                    punkId: parseInt( inputData.input.punkId  ),
                    fromAddress: APIHelper.sanitizeInput( inputData.input.fromAddress) 
                }

                let newPost = await ForumManager.createNewPost(    inputPostData , APIHelper.sanitizeInput(inputData.input.parentTopicHash), mongoInterface )

                if(!newPost.success){
                    return {success:false, input: inputData.input, message: newPost.message}
                }
                
                if( newPost.success ){
                    return {success:true, input: inputData.input, output: {postHash: newPost.postHash}  }
                }
                
                return {success:false, input: inputData.input, message:'Could not create database record' }

            }

            if(inputData.requestType == 'edit_post'){

                let personalSignatureIsValid = APIHelper.validatePersonalSignature(inputData.input)
                
                if(!personalSignatureIsValid){
                    return {success:false, input: inputData.input, message: 'Invalid signature.'  }
                }


                let userOwnsPunk = await APIHelper.validatePunkOwnership(inputData.input.fromAddress, inputData.input.punkId, wolfpackInterface , serverConfig)

                if(!userOwnsPunk){
                    return {success:false, input: inputData.input, message: 'Not owner of punk' }
                }


                let inputPostData = {
                    postHash: APIHelper.sanitizeInput( inputData.input.postHash) ,
                    markdownInput: inputData.input.markdownInput,
                    punkId: parseInt( inputData.input.punkId  ) 
                }

                let editPost = await ForumManager.editPost(    inputPostData ,  mongoInterface )

                if(!editPost.success){
                    return {success:false, input: inputData.input, message: editPost.message}
                }
                
                if( editPost.success ){
                    return {success:true, input: inputData.input, output: {postHash: editPost.postHash, markdownInput: inputData.input.markdownInput}  }
                }
                
                return {success:false, input: inputData.input, message:'Could not edit database record' }

            }

            if(inputData.requestType == 'delete_post'){

                let personalSignatureIsValid = APIHelper.validatePersonalSignature(inputData.input)
                
                if(!personalSignatureIsValid){
                    return {success:false, input: inputData.input, message: 'Invalid signature.'  }
                }


                let userOwnsPunk = await APIHelper.validatePunkOwnership(inputData.input.fromAddress, inputData.input.punkId, wolfpackInterface , serverConfig)

                if(!userOwnsPunk){
                    return {success:false, input: inputData.input, message: 'Not owner of punk' }
                }


                let inputPostData = {
                    postHash: APIHelper.sanitizeInput( inputData.input.postHash)  ,
                    punkId: parseInt( inputData.input.punkId  ) 
                }

                let deletedPost = await ForumManager.deletePost(    inputPostData ,  mongoInterface )

                if(!deletedPost.success){
                    return {success:false, input: inputData.input, message: deletedPost.message}
                }
                
                if( deletedPost.success ){
                    return {success:true, input: inputData.input, output: {postHash: deletedPost.postHash}  }
                }
                
                return {success:false, input: inputData.input, message:'Could not delete database record' }

            }


            if(inputData.requestType == 'topic'){
                let topicHash = APIHelper.sanitizeInput(inputData.input.topicHash)


                //make sure the user has permission to read this topic (later) 
                
                let topicData = await ForumManager.findTopicDataFromHash(  APIHelper.sanitizeInput(topicHash) , mongoInterface )

               
                return {success:true, input: inputData.input, output: topicData }
            }

            
            if(inputData.requestType == 'topics'){
               // let topicHash = inputData.input.topicHash

                //check filtering here - usually based on URL params

                let validatedAsRace = null 

                //check for optional validation inputs

                let validatedWithPunkRaces = [] 

                if(inputData.input.authToken){
                    console.log('validating auth token ')

                    let publicAddressFromAuthToken = await APIHelper.validateAuthToken(APIHelper.sanitizeInput(inputData.input.authToken), mongoInterface)
                
                    if(!publicAddressFromAuthToken){
                        return {success:false, input: inputData.input }
                    }


                    //get punks from address

                    let punksOwnedByAddress = await APIHelper.getPunksOwnedByAddress( publicAddressFromAuthToken, serverConfig, wolfpackInterface   )

                    console.log('punksOwnedByAddress', punksOwnedByAddress)
                    //get punk races array 

                    for(let punkId of punksOwnedByAddress){
                        let  punkRace = APIHelper.getPunkRace(  punkId )

                        if(punkRace){
                            punkRace = punkRace.toLowerCase()

                            validatedWithPunkRaces.push(punkRace)
                        }else{
                            console.log('warn: no race', punkId )
                        }
                       
                    }


                    
                }

                /*if(inputData.input.accountSignature){

                    let personalSignatureIsValid = APIHelper.validatePersonalSignature(inputData.input)
                
                    if(!personalSignatureIsValid){
                        return {success:false, input: inputData.input }
                    }
    
    
                    let userOwnsPunk = await APIHelper.validatePunkOwnership(inputData.input.fromAddress, inputData.input.punkId, wolfpackInterface , serverConfig)
    
                    if(!userOwnsPunk){
                        return {success:false, input: inputData.input, message: 'Not owner of punk' }
                    }
    

                    validatedAsRace = await APIHelper.getPunkRace( inputData.input.punkId, mongoInterface )
                }*/

 


                let filter = {}

                if(inputData.input.byPunkId){
                    filter = {punkId: parseInt( inputData.input.byPunkId  )}
                }

                if(inputData.input.category){
                    filter = {category: APIHelper.sanitizeInput(inputData.input.category)   }
                } 

                let sortBy = {lastUpdatedAt:  -1}

                //make sure the user has permission to read this topic (later)                 
                let topicsArray = await ForumManager.findTopicsUsingFilter(  filter , sortBy,  mongoInterface )

                
                topicsArray = ForumManager.filterOutByRace( validatedWithPunkRaces, topicsArray )  

               /* if(!validatedAsRace){
                    topicsArray = ForumManager.filterOutByRace( [], topicsArray )               
                }else{
                    topicsArray = ForumManager.filterOutByRace( [validatedAsRace], topicsArray ) 
                }*/
                
                return {success:true, input: inputData.input, output: topicsArray }
            }





            // ------------  Data retrieval ------------
         
            if(inputData.requestType == 'ERC721_balance_by_owner'){
 
                let inputParameters = inputData.input

                let ownerAddress = inputParameters.ownerAddress 

                let results = await APIHelper.findAllERC721ByOwner(ownerAddress, wolfpackInterface)

               
                return {success:true, input: inputParameters, output: results  }
            } 



            if(inputData.requestType == 'ERC721_balance_by_token'){
 
                let inputParameters = inputData.input

                let token = inputParameters.token 

                let results = await APIHelper.findAllERC721ByToken(token, wolfpackInterface)

                
                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'punks_balance_by_owner'){

                let inputParameters = inputData.input

                let networkName = serverConfig.networkName 

                let punkContractAddress = contractData[networkName].contracts['cryptopunks'].address

 
                let ownerAddress = APIHelper.sanitizeInput( inputParameters.ownerAddress ) 

                let results = await APIHelper.findAllERC721ByTokenAndOwner(punkContractAddress, ownerAddress, wolfpackInterface)

                
                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC721_balance_by_owner_and_token'){
 
                let inputParameters = inputData.input

                let token = inputParameters.token 
                let ownerAddress = APIHelper.sanitizeInput( inputParameters.ownerAddress )

                let results = await APIHelper.findAllERC721ByTokenAndOwner(token, ownerAddress, wolfpackInterface)

                
                return {success:true, input: inputParameters, output: results  }
            }


             

            if(inputData.requestType == 'ERC20_balance_by_owner'){
 
                let inputParameters = inputData.input

                let account = APIHelper.sanitizeInput( inputParameters.account )
                

                let results = await APIHelper.findERC20BalanceByAccount(account,  wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

           /* if(inputData.requestType == 'ERC20_balance_by_token'){
 
                let inputParameters = inputData.input
 
                let results = await APIHelper.findERC20BalanceByToken(inputParameters.token  ,  wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_from'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByFrom(inputParameters.from , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_to'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByTo(inputParameters.to , wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC20_transferred_from_to'){
 
                let inputParameters = inputData.input 

                let results = await APIHelper.findERC20TransferredByFromTo(inputParameters.from, inputParameters.to, wolfpackInterface)

                await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }*/


 

            return {success:false}
        }


        /*
        fromAddress: '0x99a848f6d8bb6d6cd1a524b3c99a97e41e1e4b5a',
        punkId: '3315', 
        signedAt: '1622323329977',
        accountSignature: '0xa7cc18dd4d0b4193016814072157165dd236f64eadb913ca43162b26e9e6221076031be48f5cbc5fb0180293c06712e760f04a990357768afec012d29d56d1f31b

        */
        static validatePersonalSignature(input){

               

            let challenge = 'Signing for Etherpunks at '.concat(input.signedAt)

            var recoveredAddress =  APIHelper.ethJsUtilecRecover(challenge, input.accountSignature)

             recoveredAddress = web3utils.toChecksumAddress( recoveredAddress )
              

             if(recoveredAddress != web3utils.toChecksumAddress(input.fromAddress)){
                console.log('mismatch address')
                 return false 
             }

             const ONE_DAY = 1000 * 60 * 60 * 24

             if(parseInt(input.signedAt) < Date.now() - ONE_DAY ){
                  
                return false 
            }

            return true 
        }

        static async validatePunkOwnership(accountAddress, punkId, wolfpackInterface, serverConfig){
            
            accountAddress = APIHelper.sanitizeInput(accountAddress)
            
            /*let networkName = serverConfig.networkName 

            let punkContractAddress = contractData[networkName].contracts['cryptopunks'].address

            let allPunksData = await APIHelper.findAllERC721ByTokenAndOwner( punkContractAddress,accountAddress, wolfpackInterface)

            let allPunksList = allPunksData[0]*/



            let allPunksList = await APIHelper.getPunksOwnedByAddress(accountAddress, serverConfig, wolfpackInterface)  

 

            let ownsPunk = false
            
            console.log('.check punk1', accountAddress, allPunksList)

            for(let id of allPunksList ){
                console.log('.check punk', punkId , id)
                if(!isNaN(punkId) && parseInt(punkId) == parseInt(id)){
                    ownsPunk = true 
                }
            }

            return ownsPunk
        }


        static async validateAuthToken(tokenHash, mongoInterface){

            let matchingRecord = await mongoInterface.findOne('authtokens', {tokenHash: tokenHash}  )

            if(matchingRecord){

                return matchingRecord.publicAddress
            }

            return null 
        }

        static ethJsUtilecRecover(msg,signature)
        {
      
      
      
          console.log('ecrecover ', msg, signature)
            var res = ethJsUtil.fromRpcSig(signature)
      
            const msgHash = ethJsUtil.hashPersonalMessage(Buffer.from( msg ) );
      
      
            var pubKey = ethJsUtil.ecrecover( ethJsUtil.toBuffer(msgHash) , res.v, res.r, res.s);
            const addrBuf = ethJsUtil.pubToAddress(pubKey);
            const recoveredSignatureSigner    = ethJsUtil.bufferToHex(addrBuf);
            console.log('rec:', recoveredSignatureSigner)
      
      
          return recoveredSignatureSigner;
      
         }



        static async findAllERC721ByOwner(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc721_balances',{accountAddress: publicAddress })
        }



        static async findAllERC721ByToken(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc721_balances',{contractAddress: publicAddress })
        }


        static async findAllERC721ByTokenAndOwner(contractAddress,ownerAddress, mongoInterface){
            ownerAddress = web3utils.toChecksumAddress(ownerAddress)
            contractAddress = web3utils.toChecksumAddress(contractAddress)
           
            return await mongoInterface.findAll('erc721_balances',{contractAddress:contractAddress, accountAddress: ownerAddress })
        }

        static async findERC721OwnerByTokenAndTokenId(contractAddress,tokenId, mongoInterface){
             
            contractAddress = web3utils.toChecksumAddress(contractAddress)

             
           
            return await mongoInterface.findAll('erc721_balances',{ contractAddress:contractAddress, tokenIds:  tokenId   })
        }



        static async findBurnedERC20ByFrom(publicAddress,mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)
            return await mongoInterface.findAll('erc20_burned',{from: publicAddress })
        }

        static async findBurnedERC20ByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_burned',{token: tokenAddress })
        }

         
        static async findERC20BalanceByAccount(accountAddress, mongoInterface){
            accountAddress = web3utils.toChecksumAddress(accountAddress) 
            return await mongoInterface.findAll('erc20_balances',{accountAddress: accountAddress  })
        }

        static async findERC20BalanceByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_balances',{contractAddress: tokenAddress })
        }


        //IMPLEMENT THESE 

     /*   static async findERC20TransferredByToken(tokenAddress,mongoInterface){
            tokenAddress = web3utils.toChecksumAddress(tokenAddress)
            return await mongoInterface.findAll('erc20_transferred',{token: tokenAddress })
        }*/

        static async findERC20TransferredByFrom(from,mongoInterface){
            from = web3utils.toChecksumAddress(from)
            return await mongoInterface.findAll('erc20_transferred',{from: from })
        }

        static async findERC20TransferredByTo(to,mongoInterface){
            to = web3utils.toChecksumAddress(to)
            return await mongoInterface.findAll('erc20_transferred',{to: to })
        }

        static async findERC20TransferredByFromTo(from,to,mongoInterface){
            from = web3utils.toChecksumAddress(from)
            to = web3utils.toChecksumAddress(to)
            return await mongoInterface.findAll('erc20_transferred',{from: from, to:to })
        }

        static sanitizeInput(input){
            return input.replace('$','').replace('.','')
        }
         

        static  getPunkRace(punkId){
           
            let matchingPunk = allPunkData[parseInt(punkId)]
            if(matchingPunk){
                return matchingPunk.Type
            }
            return null 
        }

        static async getPunksOwnedByAddress( accountAddress, serverConfig, wolfpackInterface  ){

            let networkName = serverConfig.networkName 

            console.log('network name', networkName)

            let punkContractAddress = contractData[networkName].contracts['cryptopunks'].address

            let allPunksData = await APIHelper.findAllERC721ByTokenAndOwner( punkContractAddress,accountAddress, wolfpackInterface)

            if(allPunksData[0]){
                return allPunksData[0].tokenIds
            }
             
            return [ ] 

        }

    }