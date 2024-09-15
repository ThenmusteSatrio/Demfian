"use client";
import { ethers } from 'ethers';
import '../types/global.d.ts';
const {BrowserProvider} = ethers;


const getProvider = () => {
  if (typeof window != 'undefined' && window.ethereum) {
    return new BrowserProvider(window.ethereum);
  }
  return null;
}

export const getSigner = async () => {
  const provider = getProvider();
  await provider?.send("eth_requestAccounts", []);
  return provider?.getSigner();
};

export const getAddress = async () => {
  const signer = await getSigner();
  return await signer?.getAddress();
};
