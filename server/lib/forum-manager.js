 
    //const ethJsUtil = require('ethereumjs-util')
  
    import web3utils from 'web3-utils'
    
    export default class ForumManager  {
    
        constructor(   ){
           
           
        }
 

 
        /*

        fromAddress: '0x99a848f6d8bb6d6cd1a524b3c99a97e41e1e4b5a',
        punkId: '3315',
        category: 'generaldiscussion',
        title: null,
        markdownInput: '# hello',
        signedAt: '1622325071059',
        accountSignature: '0xa2b47a19906c0249f3cba98e6ebe77f920e6065a86b4e62d5b92d8f398b1d46840aabe67f65a3da108b88f8fef4bb19afac1902838a0cdf9a73cc3a0d383adf21b'


        */


        static async createNewTopic( input , mongoInterface ){ 

            let topicHash = web3utils.randomHex(16)

            //make sure signed at was recent 
     
            
            let newTopicData = {
                title: ForumManager.sanitizeInput(input.title),
               // markdownInput: ForumManager.sanitizeInput(input.markdownInput),     //sanitize
                category: input.category,
                punkId: parseInt( input.punkId ),
                fromAddress: input.fromAddress.toLowerCase(),

                topicHash: topicHash,
                createdAt: Date.now()


            }
            console.log('create new topic', newTopicData)


            let result = await mongoInterface.insertOne( 'topics', newTopicData  )
            

             
            
            return {success:true, topicHash: topicHash }


        }

        static async createNewPost( input, topicHash, mongoInterface ){

            let existingTopic = await mongoInterface.findOne('topics',{ topicHash: topicHash })
            
            if(!existingTopic || !topicHash){
                return {success: false}
            }

            let allowedToPost = await ForumManager.punkAllowedToPostToTopic( input.punkId , topicHash)

            let postHash = web3utils.randomHex(16)

            let newPostData = {                
                markdownInput: ForumManager.sanitizeInput(input.markdownInput),     //sanitize
                
                punkId: parseInt( input.punkId ),
                fromAddress: input.fromAddress.toLowerCase(),

                topicHash: topicHash,

                postHash: postHash, 
                createdAt: Date.now()
            }

            let newPost = await mongoInterface.insertOne( 'posts', newPostData  )

            return {success:true, postHash: postHash }
 

        }

        static async findTopicDataFromHash(topicHash, mongoInterface){
            let result = {}

            let page = 0

            result.topicData = await mongoInterface.findOne('topics',{ topicHash: topicHash })
            
            //sort by createdAt
            result.postsArray = await mongoInterface.findAll('posts',{ topicHash: topicHash })
            

            return result
        }


        static async findTopicsUsingFilter(filter, mongoInterface){

                
            let results= await mongoInterface.findAll('topics', filter )

            for(let result of results){

                result.metrics = {}

                result.metrics.replies = 0 

                result.metrics.views = 0
            }

            return results
        }


        ///impl
        static sanitizeInput(input){

            return input 
        }

        ///impl
        static punkAllowedToPostToTopic(punkId, topicHash){

            return true 
        }
        

         
    }