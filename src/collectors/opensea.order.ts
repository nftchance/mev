import { ItemListedEvent, ItemListedEventPayload, OpenSeaStreamClient } from '@opensea/stream-js'
import { OpenSeaSDK } from 'opensea-js'
import { EventEmitter } from 'stream'

import { Collector } from '../lib/types/collectors'
import logger from '../lib/logger'
import errors from '../lib/errors'

export type OpenseaOrder = {
    type: 'OpenseaOrder'
    listing: ItemListedEventPayload
}

export type OpenseaOrderCollectorProps = {
    openseaClient: OpenSeaSDK // ! This client is used a layer up to build and sign orders.
    openseaStreamClient: OpenSeaStreamClient
}

export type OpenseaOrderCollector = (params: OpenseaOrderCollectorProps) => OpenseaOrder

export const useOpenseaOrder: Collector<OpenseaOrderCollector> = ({
    openseaStreamClient,
}) => {
    const key = 'OpenseaOrder'

    const getEventStream = async (publisher: EventEmitter) => {
        openseaStreamClient.onItemListed('*', (event: ItemListedEvent) => {
            try {
                const order = {
                    type: key,
                    listing: event.payload,
                }

                publisher.emit('Collection', [key, order])

                logger.success(errors.Collector.OpenseaOrder.SuccessPublishingOrder(order))
            } catch (err) {
                logger.error(errors.Collector.OpenseaOrder.FailedPublishingOrder(err))
            }
        })
    }

    return { key, getEventStream }
}
