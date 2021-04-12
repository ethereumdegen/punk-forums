

const EventEmitter = require('events');
class AccessPlugEmitter extends EventEmitter {}

const accessPlugEmitter = new AccessPlugEmitter();


import FrontendHelper from './frontend-helper.js'

export default class AccessPlug {

    async connect(web3Plug){
        console.log('connecting ')

        let publicAddress = web3Plug.getActiveAccountAddress()

        let challenge = await FrontendHelper.requestAccessChallenge( publicAddress )
        console.log('challenge ',challenge)
    }


    getPlugEventEmitter(){
        return accessPlugEmitter
      }

}