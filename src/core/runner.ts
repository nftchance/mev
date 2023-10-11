import { useEngine } from './engine'
import { OpenSeaStreamClient } from '@opensea/stream-js'
import { Wallet } from 'ethers'
import { ethers } from 'ethers'
import { Chain, OpenSeaSDK } from 'opensea-js'

import yaml from 'js-yaml'
import zmq from 'zeromq'

const env = yaml.load(
    require('fs').readFileSync('./env.yaml', 'utf8'),
) as Record<string, Record<string, string>>

export const runner = async () => {
    if (!env.rpcUrls.default) {
        throw new Error('No RPC URL provided.')
    }

    const provider = new ethers.providers.WebSocketProvider(
        `wss://eth-mainnet.g.alchemy.com/v2/${env.rpcUrls.alchemy}`,
    )

    if (!env.default.privateKey) {
        throw new Error('No private key provided.')
    }

    const client = new Wallet(env.privateKeys.default, provider)

    if (!env.opensea.default) {
        throw new Error('No Opensea API key provided.')
    }

    const openseaStreamClient = new OpenSeaStreamClient({
        token: env.opensea.default,
    })

    const openseaSDK = new OpenSeaSDK(provider, {
        chain: Chain.Mainnet,
        apiKey: env.opensea.default,
    })

    // TODO: Handle this
    client
    openseaStreamClient
    openseaSDK

    // Setup sockets used to transmit data.
    const publisher = zmq.socket('pub')
    const receiver = zmq.socket('sub')

    const socketURL = 'tcp://localhost:3000'
    publisher.bindSync(socketURL)
    receiver.bindSync(socketURL)

    // Initialize the engine.
    const engine = useEngine({
        publisher,
        receiver,
    })

    console.log("✔︎ Generated engine.")

    // engine

    // Setup block collector
    // Setup opensea order collector
    // Setup strategies

    // TODO: Setup flashbots executor
}