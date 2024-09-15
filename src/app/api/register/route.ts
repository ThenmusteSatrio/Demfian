import { ethers } from 'ethers';
const { JsonRpcProvider, Contract } = ethers;
import configJSON from "@/app/config.json";
import Account from "@/abi/Account";
import { NextRequest, NextResponse } from 'next/server';
import { randFloat } from 'three/src/math/MathUtils.js';

export const runtime = "experimental-edge"
const PINATA_API_KEY = process.env.PINATA_API_KEY!;
export async function POST(req: Request) {
    try {
        const formsData = await req.formData();
        const firstUsername = formsData.get('username');
        const username = firstUsername + randFloat(1, 5).toString();
        const metamaskAddress = formsData.get('metamaskAddress') as string;
        const image = formsData.get('image') as File;
        
        const formData = new FormData();
        formData.append("file", image);
        const pinataMetadata = JSON.stringify({
            name: username,
        });
        formData.append("pinataMetadata", pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 1,
        });
        formData.append("pinataOptions", pinataOptions);
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PINATA_API_KEY}`,
            },
            body: formData,
        });

        const responseBody = await res.text();
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}, ${responseBody}`);
        }
        const result = JSON.parse(responseBody);
        const provider = new JsonRpcProvider("http://127.0.0.1:8545");
        const network = await provider.getNetwork();
        const chainId = network.chainId.toString() as keyof typeof configJSON;
        const signer = await provider.getSigner(metamaskAddress);
        const account = new Contract(
            configJSON[ chainId ].account.address,
            Account,
            signer
        );

        const tx = await account.register(firstUsername, `https://yellow-legislative-moth-153.mypinata.cloud/ipfs/${result.IpfsHash}`);
        const detail = await account.getUserDetails(metamaskAddress);
        const [ userAddress, usernames, imageUrl ] = detail;
        if (!tx || !detail) {
            return new Response("Unauthorized", { status: 401 });
        }
        return NextResponse.json({ userAddress, "username": usernames, imageUrl }, { status: 200 });

    } catch (error) {
        console.error('Error uploading to Pinata:', error);
        throw new Error('Error uploading to Pinata');
    } finally {
    }
}