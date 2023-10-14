import axios from 'axios'

export const useEtherscan = async (
	url: (address: string) => string,
	address: `0x${string}`
) => {
	const response = await axios.get(url(address))

	const {
		ABI: abi,
		ContractName: name,
		SourceCode: source
	} = response.data.result[0]

	return { abi, name, source }
}
