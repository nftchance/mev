import { EventEmitter } from "stream";
import {
    ItemListedEvent,
    ItemListedEventPayload,
    OpenSeaStreamClient,
} from "@opensea/stream-js";
import { OpenSeaSDK } from "opensea-js";

import { Collector } from "../collector";

import errors from "../../lib/errors";

const key = "OpenseaListing" as const;

export class OpenseaListingCollector extends Collector<
    typeof key,
    {
        listing: ItemListedEventPayload;
    }
> {
    constructor(
        public readonly openseaClient: OpenSeaSDK,
        public readonly openseaStreamClient: OpenSeaStreamClient,
    ) {
        super(key, errors.Collector.OpenseaListing);
    }

    getCollectionStream = async (stream: EventEmitter) => {
        this.openseaStreamClient.onItemListed("*", (event: ItemListedEvent) => {
            this.emit(stream, {
                listing: event.payload,
            });
        });
    };
}
