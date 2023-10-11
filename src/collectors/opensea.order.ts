import { ItemListedEvent, ItemListedEventPayload, OpenSeaStreamClient } from '@opensea/stream-js'
import { OpenSeaSDK } from 'opensea-js'
import { Socket } from 'zeromq'

import { Collector } from '../lib/types/collectors'
import logger from '../lib/logger'
import errors from '../lib/errors'

export type OpenseaOrder = {
    type: 'OpenseaOrder'
    listing: ItemListedEventPayload
}

export type OpenseaOrderCollectorProps = {
    openseaClient: OpenSeaSDK
    openseaStreamClient: OpenSeaStreamClient
}

export type OpenseaOrderCollector = (params: OpenseaOrderCollectorProps) => OpenseaOrder

export const useOpenseaOrder: Collector<OpenseaOrderCollector> = ({
    openseaStreamClient,
}) => {
    const getEventStream = async (publisher: Socket) => {
        openseaStreamClient.onItemListed('*', (event: ItemListedEvent) => {
            try {
                const order = {
                    type: 'OpenseaOrder',
                    listing: event.payload,
                }

                publisher.send(['OpenseaOrder', JSON.stringify(order)])

                logger.success(errors.Collector.OpenseaOrder.SuccessPublishingOrder(order))
            } catch (err) {
                logger.error(errors.Collector.OpenseaOrder.FailedPublishingOrder(err))
            }
        })
    }

    return { getEventStream }
}
