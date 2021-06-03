 
    //const ethJsUtil = require('ethereumjs-util')
  
    import web3utils from 'web3-utils'

    import FileHelper from './file-helper.js'

    import APIHelper from './api-helper.js'

    const CategoryDataRaw = FileHelper.readJSONFile('./src/config/topicCategories.json')

    var categoryData = {} 

    for(let cat of CategoryDataRaw){
        categoryData[cat.name.replace(/\s/g,'').toLowerCase()] = cat 
    }
    
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

            let allowedToPost = await ForumManager.punkAllowedToPostToCategory( parseInt(input.punkId) , ForumManager.sanitizeInput( input.category ) , mongoInterface)
            
            if(!allowedToPost){
                return {success:false, message: "Insufficient permissions." }
            }
     
            
            let newTopicData = {
                title: ForumManager.sanitizeInput(input.title) ,
              
                category: ForumManager.sanitizeInput( input.category ) ,
                punkId: parseInt( input.punkId ),
                fromAddress: ForumManager.sanitizeInput( input.fromAddress.toLowerCase() ) ,

                topicHash: topicHash,
                createdAt: Date.now(),
                lastUpdatedAt: Date.now(),
                metrics:{
                    views:0,
                    replies:0
                }


            }
            console.log('create new topic', newTopicData)


            let result = await mongoInterface.insertOne( 'topics', newTopicData  )
            

             
            
            return {success:true, topicHash: topicHash }


        }

        static async createNewPost( inputPostData, topicHash, mongoInterface ){

            let existingTopic = await mongoInterface.findOne('topics',{ topicHash: topicHash })
            
            if(!existingTopic || !topicHash){
                return {success: false}
            }

            let allowedToPost = await ForumManager.punkAllowedToPostToCategory( parseInt(inputPostData.punkId) , existingTopic.category, mongoInterface)
            
            if(!allowedToPost){
                return {success:false, message: "Insufficient permissions." }
            }

            let postHash = web3utils.randomHex(16)

            let newPostData = {                
                markdownInput: ForumManager.sanitizeMarkdownInput(inputPostData.markdownInput),     //sanitize
                
                punkId: parseInt( inputPostData.punkId ),
                fromAddress: inputPostData.fromAddress.toLowerCase(),

                topicHash: topicHash,

                postHash: postHash, 
                createdAt: Date.now()
            }

            let newPost = await mongoInterface.insertOne( 'posts', newPostData  )

            let updated = await mongoInterface.updateCustomAndFindOne( 'topics', {topicHash: topicHash}, { $set:{ lastUpdatedAt: Date.now()}, $inc:{ 'metrics.replies':  1} }  )

            return {success:true, postHash: postHash }
 

        }


        static async editPost( inputPostData,   mongoInterface ){

            let postHash = inputPostData.postHash 

            let existingPost = await mongoInterface.findOne('posts',{ postHash: postHash })

            let existingTopic = await mongoInterface.findOne('topics',{ topicHash: existingPost.topicHash })
            
            if(!existingTopic || !existingPost || !postHash){
                return {success: false}
            }

            if(parseInt(existingPost.punkId) != parseInt( inputPostData.punkId )){
                return {success: false, message: 'You are not the owner of this post'}
            }
            

            let editPostData = {                
                markdownInput: ForumManager.sanitizeMarkdownInput(inputPostData.markdownInput),     //sanitize
                
                punkId: parseInt( inputPostData.punkId ),
                //fromAddress: inputPostData.fromAddress.toLowerCase(),

                postHash: postHash 
            }

           
            let updatedPost = await mongoInterface.updateCustomAndFindOne( 'posts', {postHash: postHash}, { $set:{ markdownInput:  editPostData.markdownInput,   lastUpdatedAt: Date.now()}, $inc:{ 'metrics.replies':  1} }  )
           
          
            return {success:true, postHash: postHash }
 

        }


        static async deletePost( inputPostData,   mongoInterface ){

            let postHash = inputPostData.postHash 

            let existingPost = await mongoInterface.findOne('posts',{ postHash: postHash })

            let existingTopic = await mongoInterface.findOne('topics',{ topicHash: existingPost.topicHash })
            
            if(!existingTopic || !existingPost || !postHash){
                return {success: false}
            } 
            
            if(parseInt(existingPost.punkId) != parseInt( inputPostData.punkId )){
                return {success: false, message: 'You are not the owner of this post'}
            }

            let editPostData = {                 
                punkId: parseInt( inputPostData.punkId ),
                //fromAddress: inputPostData.fromAddress.toLowerCase(),  
                postHash: postHash 
            }

            //let newPost = await mongoInterface.insertOne( 'posts', newPostData  )

            let updatedPost = await mongoInterface.deleteOne( 'posts', {postHash: postHash}   )
           
            let updatedTopic = await mongoInterface.updateCustomAndFindOne( 'topics', {topicHash: existingTopic.topicHash}, { $set:{  lastUpdatedAt: Date.now()}, $inc:{ 'metrics.replies':  -1} }  )
            

            ForumManager.cleanUpTopicIfEmpty( existingTopic.topicHash, mongoInterface )

            return {success:true, postHash: postHash }
 

        }

        static async cleanUpTopicIfEmpty(topicHash, mongoInterface){
            let existingTopic = await mongoInterface.findOne('topics',{ topicHash: topicHash })
            
            if(existingTopic && existingTopic.metrics.replies <= 0){
                await mongoInterface.deleteOne('topics',{ topicHash: topicHash })
            }
        }

        static async findTopicDataFromHash(topicHash, mongoInterface){
            let result = {}

            let page = 0

            topicHash = ForumManager.sanitizeInput(topicHash)

            result.topicData = await mongoInterface.findOne('topics',{ topicHash: topicHash })
            
            //sort by createdAt
            result.postsArray = await mongoInterface.findAll('posts',{ topicHash: topicHash })
            
            await mongoInterface.updateCustomAndFindOne('topics',{ topicHash: topicHash }, {$inc: {'metrics.views': 1} })

            return result
        }


        static async findTopicsUsingFilter(filter, sortBy, mongoInterface){

                
            let results= await mongoInterface.findAllSortedWithLimit('topics', filter , sortBy, 150)
            
           

            return results
        }

        static filterOutByRace( racesIncluded , topicsArray  ){

            let results = []

            for(let topic of topicsArray){
                let category = topic.category.replace(/\s/g,'').toLowerCase()

                let matchingCategory = categoryData[category]

                console.log('mathcing cat', matchingCategory, category)

                if(matchingCategory){

                    //filter for specific races 
                    if(matchingCategory.onlyAllow && matchingCategory.onlyAllow!='any' && !racesIncluded.includes( matchingCategory.onlyAllow )){
                        continue 
                    } 

                    //filter for 'any'
                    if(matchingCategory.onlyAllow && racesIncluded.length == 0 ){
                        continue 
                    } 
                     

                    results.push(topic)
                }
            }

            return results
        }


        static sanitizeInput(input){
            return input.replace('$','').replace('.','')
        }

       
        static sanitizeMarkdownInput(input){

            return escape(input)
        }

         
        static async punkAllowedToPostToCategory(punkId, category, mongoInterface){
            
             

            let matchingCategory = categoryData[category.replace(/\s/g,'').toLowerCase()]

            console.log('matching cat',  matchingCategory )

            if(!matchingCategory)return false 
            let onlyAllow = matchingCategory.onlyAllow

           


            
                        

            //find the type of the punk 
            let race = await APIHelper.getPunkRace(punkId, mongoInterface)

            if(!race){
                return false 
            }

            if(onlyAllow && onlyAllow != 'any' && race.toLowerCase() != onlyAllow.toLowerCase())  return false


            return true 
        }

      
         
    }