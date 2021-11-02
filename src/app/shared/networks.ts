import {providers, utils} from 'ethers'

export enum ChainID {
  // MATIC_MAINNET = 137, // Polygon
  MUMBAI_TESTNET = 80001, // Polygon
  // ETHEREUM_MAINNET = 1,
  // GOERLI_TESTNET = 5,
  AURORA_TESTNET = 1313161555
}

export interface Network {
  chainID: ChainID,
  name: string,
  shortName: string,
  nativeCurrency: {
    name: string,
    symbol: string;
  },
  defaultStableCoin: string,
  orderBook: string,
  maxGasPrice: number,
  rpcURLs: string[],
  explorerURLs: string[],
}

export const MumbaiNetwork: Network = {
  chainID: ChainID.MUMBAI_TESTNET,
  name: 'Mumbai (Polygon Testnet)',
  shortName: 'mumbai',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
  },
  defaultStableCoin: '0x05c87f0e8b7a794731828c5D4a5634Bb1CB7aBB2',
  orderBook: '0x0d54E3E80b78330d48B59B69AFFcc434CAF34293',
  maxGasPrice: 20,
  rpcURLs: ['https://rpc-mumbai.maticvigil.com'],
  explorerURLs: ['https://mumbai.polygonscan.com/'],
}

export const AuroraTestnetNetwork: Network = {
  chainID: ChainID.AURORA_TESTNET,
  name: 'Aurora Testnet',
  shortName: 'aurora',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
  },
  defaultStableCoin: '0xF08b55025bC17073043a66100479e673eB8d90f1',
  orderBook: '0x85c2Ed09700b345D7D06047DaeeBCb70421eC34E',
  maxGasPrice: 20,
  rpcURLs: ['https://testnet.aurora.dev'],
  explorerURLs: ['https://explorer.testnet.aurora.dev/'],
}

export const Networks: { [key in ChainID]: Network } = {
  [ChainID.MUMBAI_TESTNET]: MumbaiNetwork,
  [ChainID.AURORA_TESTNET]: AuroraTestnetNetwork,
}

const getEthersNetwork = (network: Network): providers.Network => ({
  name: network.shortName,
  chainId: network.chainID,
  _defaultProvider: (_providers: any) =>
    new providers.StaticJsonRpcProvider({
      url: network.rpcURLs[0],
    }),
})

export const EthersNetworks = Object.fromEntries(Object.entries(Networks)
  .map((entry) => [entry[0], getEthersNetwork(entry[1])]),
)

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

const getMetamaskNetwork = (network: Network): AddEthereumChainParameter => ({
  chainId: utils.hexValue(network.chainID),
  chainName: network.name,
  nativeCurrency: {
    name: network.nativeCurrency.name,
    symbol: network.nativeCurrency.symbol,
    decimals: 18,
  },
  rpcUrls: network.rpcURLs,
  blockExplorerUrls: network.explorerURLs,
})

export const MetamaskNetworks = Object.fromEntries(Object.entries(Networks)
  .map((entry) => [entry[0], getMetamaskNetwork(entry[1])]),
)
