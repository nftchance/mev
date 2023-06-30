import { AddressLike } from 'ethers'

const etherscanApiKey = ''

type TuseEtherscan = (props: {
    address: AddressLike
}) => {
    getAbi: () => Promise<string>
    getContractName: () => Promise<string>
}

export const useEtherscan: TuseEtherscan = ({ address }) => {
    const getAbi = async () => {
        const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apiKey=${etherscanApiKey}`

        return fetch(url)
            .then((res) => res.json())
            .then((res) => {
                return res.result
            })
    }

    const getContractName = async () => {
        const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apiKey=${etherscanApiKey}`

        return fetch(url)
            .then((res) => res.json())
            .then((res) => {
                return res.result[0].ContractName
            })
    }

    return { getAbi, getContractName }
}
