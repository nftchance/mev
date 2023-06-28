import { ethers } from "ethers";

import { Hook } from "../types";

const ENCODED_FUNCTION = "getCanClaims";

const TOTAL_TOKENS = 10_000;
const TOKENS_PER_BATCH = 500;
const BATCHES = TOTAL_TOKENS / TOKENS_PER_BATCH;

const TOKEN_IDS_BY_BATCH = Array.from({ length: BATCHES }, (_, i) => {
    const start = i * TOKENS_PER_BATCH;

    return Array.from({ length: TOKENS_PER_BATCH }, (_, i) => start + i);
});

const useAzukiClaimableElementals: Hook<{
    provider: ethers.WebSocketProvider;
    azuki: ethers.Contract;
    multicall: ethers.Contract;
}, {
    tokenIds: number[],
}> = ({ enabled = false, on = "block", onSuccess, onError, config }) => {

    let tokenIds: number[] = [];

    const call = async () => {
        try {
            const azukiAddress = await config.azuki.getAddress();

            const transactions = TOKEN_IDS_BY_BATCH.map((tokenIds) => {
                return config.azuki.interface.encodeFunctionData(ENCODED_FUNCTION, [tokenIds]);
            });

            config.provider.on(on, async (blockNumber) => {
                transactions.forEach((transaction, batchIndex) => {
                    config.multicall.aggregate3.staticCall([{
                        target: azukiAddress,
                        allowFailure: false,
                        callData: transaction
                    }]).then((returnData) => {
                        const decoded = config.azuki.interface.decodeFunctionResult(ENCODED_FUNCTION, returnData[0][1])

                        const canClaimTokenIds = decoded[0].map((canClaim: boolean, index: number) => {
                            return canClaim ? TOKEN_IDS_BY_BATCH[batchIndex][index] : null;
                        }).filter((canClaim: boolean | null) => canClaim !== null);

                        tokenIds.push(...canClaimTokenIds);
                    })
                })

                onSuccess?.({ blockNumber, tokenIds });

                tokenIds = [];
            });
        } catch (error) {
            onError?.(error);
        }
    }

    if (enabled) {
        call();
    }

    return { tokenIds, call }
}

export default useAzukiClaimableElementals;