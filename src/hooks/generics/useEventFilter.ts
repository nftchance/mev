import { EventFilter, EventLog, WebSocketProvider } from "ethers";

import { Hook } from "../../types";

const useEventFilter: Hook<{
    provider: WebSocketProvider;
    filter: EventFilter
}, {
    events: EventLog[],
}> = ({ enabled, onSuccess, onError, config }) => {
    const events: EventLog[] = [];

    const call = () => {
        try {
            config.provider.on(config.filter, (event) => {
                events.push(event);

                onSuccess?.({ event });
            });
        } catch (error) {
            onError?.(error);
        }
    }

    if (enabled) {
        call();
    }

    return { events, call }
}

export { useEventFilter };