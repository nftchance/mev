import axios from 'axios'

import { AddressLike } from 'ethers'

type Etherscan = (props: { address: AddressLike }) => Promise<{
    abi: string
    name: string
    source: string
}>

export const useEtherscan: Etherscan = async ({ address }) => {
    const etherscanApiKey = 'TZIQBTY59K1JUJUH22DKBUF9KDK65N57DN'

    const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apiKey=${etherscanApiKey}`

    const response = await axios.get(url)

    const {
        ABI: abi,
        ContractName: name,
        SourceCode: source,
    } = response.data.result[0]

    return { abi, name, source }
}
