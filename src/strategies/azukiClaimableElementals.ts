import { id, Contract, WebSocketProvider } from "ethers";

import { onError } from "../callbacks";

import { useEventFilter } from "../hooks/generics";
import useAzukiClaimableElementals from "../hooks/useAzukiClaimableElementals";

const MULTICALL_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";
const MULTICALL_ABI = [
    "function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)",
]

const AZUKI_ADDRESS = "0x3af2a97414d1101e2107a70e7f33955da1346305";
const AZUKI_ABI = [
    "function getCanClaims(uint256[] calldata azukiIds) external view returns (bool[] memory)",
]

export const azukiClaimableElementals = async () => {
    const provider = new WebSocketProvider(
        "wss://eth-mainnet.g.alchemy.com/v2/CLG_LCiDZkHaMGRaLQc_yhbhbSiv6NEL"
    );

    const azuki = new Contract(AZUKI_ADDRESS, AZUKI_ABI, provider);
    const multicall = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);

    const onClaimsEnabled = ({ events }: any) => {
        const { tokenIds } = useAzukiClaimableElementals({
            enabled: events && events.length > 0,
            onError,
            onSuccess: ({ blockNumber, tokenIds }) => {
                console.log(`Block ${blockNumber} - ${tokenIds.length} claimable tokens`);
            },
            config: {
                provider,
                azuki,
                multicall,
            }
        });

        tokenIds;

        // TODO: Determine if any of the token ids are available to purchase on a secondary market.
    }

    useEventFilter({
        enabled: true,
        onSuccess: onClaimsEnabled,
        onError,
        config: {
            provider,
            filter: {
                address: AZUKI_ADDRESS,
                topics: [
                    id("ClaimedBean(uint256 sourceAzukiId, uint256 beanId)"),
                ],
            }
        }
    });
}