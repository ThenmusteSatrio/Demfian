import { ethers } from 'ethers';
const { JsonRpcProvider, Contract } = ethers;
import config from "@/app/config.json";
import Account from "@/abi/Account";
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const { address } = await req.json();
    const provider = new JsonRpcProvider("http://127.0.0.1:8545");
    const network = await provider.getNetwork();
    const chainId = network.chainId.toString() as keyof typeof config;
    const account = new Contract(
        config[ chainId ].account.address,
        Account,
        provider
    );
    const result = await account.isRegistered(address);
    if (result == false) {
        return new Response("Unauthorized", { status: 401 });
    }
    const detail = await account.getUserDetails(address);
    const [ userAddress, username, imageUrl ] = detail;
    if (!username) {
        return new Response("Unauthorized", { status: 401 });
    }
    return NextResponse.json({ userAddress, username, imageUrl }, { status: 200 });
}