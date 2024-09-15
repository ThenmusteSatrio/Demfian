import { ethers } from 'ethers';
const { JsonRpcProvider, Contract, BrowserProvider, } = ethers;
import config from "@/app/config.json";
import NFTs from "@/abi/NFTs";
import { randFloat } from 'three/src/math/MathUtils.js';
import { NextRequest } from 'next/server';
const PINATA_API_KEY = process.env.PINATA_API_KEY!;

export async function POST(req: Request) {
    const formsData = await req.formData();
    const title = formsData.get('title') as string;
    const price = formsData.get('price') as string;
    const chain = formsData.get('chain') as string;
    const artist = formsData.get('artist') as string;
    const created_at = formsData.get('created_at') as string;
    const description = formsData.get('description') as string;
    const metamaskAddress = formsData.get('metamaskAddress') as string;
    const image = formsData.get('image') as File;

    const imageData = new FormData();
    imageData.append("file", image);
    const pinataMetadata = JSON.stringify({
        name: title + randFloat(1, 5).toString(),
    });
    imageData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 1,
    });
    imageData.append("pinataOptions", pinataOptions);
    let imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PINATA_API_KEY}`,
        },
        body: imageData,
    });

    const ipfs = JSON.parse(await imageRes.text());

    const pinataContent = {
        title: title,
        chain: chain,
        price: price,
        artist: artist,
        description: description,
        image: `https://yellow-legislative-moth-153.mypinata.cloud/ipfs/${ipfs.IpfsHash}`,
        created_at: created_at
    };
    const fileName = title + randFloat(1, 5).toString();

    const formData = JSON.stringify({
        pinataContent: pinataContent,
        pinataMetadata: {
            name: `${fileName}.json`
        }
    });
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PINATA_API_KEY}`,
        },
        body: formData,
    });

    const ipfsHash = JSON.parse(await res.text());
    const metadata = `https://yellow-legislative-moth-153.mypinata.cloud/ipfs/${ipfsHash.IpfsHash}`;


    if (!imageRes) {
        return new Response(JSON.stringify({ success: false, message: 'Something went wrong' }), {
            status: 500,
        });
    }

    return new Response(JSON.stringify({ success: true, message: 'NFT created', metadata }), {
        status: 200,
    });
}

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const address = url.searchParams.get('address');
    const provider = new JsonRpcProvider("http://127.0.0.1:8545");
    const network = await provider.getNetwork();
    const chainId = network.chainId.toString() as keyof typeof config;
    const signer = await provider.getSigner();
    const nfts = new Contract(
        config[ chainId ].nfts.address,
        NFTs,
        signer
    );

    const res = await nfts.tokensOfOwner(address);
    const data = res.map((id: BigInt) => id.toString());


    if (!res) {
        return new Response(JSON.stringify({ success: false, message: 'Something went wrong' }), {
            status: 500,
        });
    }

    return new Response(JSON.stringify({ success: true, message: 'NFT created', data: data }), {
        status: 200,
    });
}