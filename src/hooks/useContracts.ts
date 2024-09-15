import { useCallback, useEffect, useState } from 'react';
import { BrowserProvider, Contract, ethers } from 'ethers';
import config from '@/app/config.json';
import Account from '@/abi/Account';
import NFTs from '@/abi/NFTs';
import Marketplace from '@/abi/Marketplace';


export default function useContracts() {
    const [ accountContract, setAccountContract ] = useState<ethers.Contract | null>(null);
    const [ nftsContract, setNFTsContract ] = useState<ethers.Contract | null>(null);
    const [ marketplaceContract, setMarketplaceContract ] = useState<ethers.Contract | null>(null);

    const initialize = async () => {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const chainId = network.chainId.toString() as keyof typeof config;

        const accountAddress = config[ chainId ].account.address;
        const nftsAddress = config[ chainId ].nfts.address;
        const marketplaceAddress = config[ chainId ].marketplace.address;

        setAccountContract(new ethers.Contract(accountAddress, Account, signer));
        setNFTsContract(new ethers.Contract(nftsAddress, NFTs, signer));
        setMarketplaceContract(new ethers.Contract(marketplaceAddress, Marketplace, signer));
    };
    useEffect(() => {
        initialize();
    }, []);

    // const getAllListings = async () => {
    //     if (marketplaceContract) {
    //         try {
    //             const listings = await marketplaceContract.getAllListings();
    //             return listings;
    //         } catch (error) {
    //             console.error("Error fetching listings:", error);
    //             return [];
    //         }
    //     }
    //     return [];
    // };

    return { accountContract, nftsContract, marketplaceContract, initialize};
}
