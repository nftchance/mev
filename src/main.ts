import config from "./config";

import { onStrategySuccess } from "./callbacks";

const main = () => {
    Object.keys(config).forEach((strategyName) => {
        const strategy = config[strategyName];

        if (!strategy.enabled) return;

        console.log(`Running ${strategyName}...`);

        strategy.call({ onSuccess: onStrategySuccess });
    });
}

main();