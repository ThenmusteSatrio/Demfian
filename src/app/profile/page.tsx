"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ethers } from "ethers";
const { Contract, BrowserProvider } = ethers;
import config from "@/app/config.json";
import NFTs from "@/abi/NFTs";
import Card from "@/components/card/Card";
import useContracts from "@/hooks/useContracts";

interface NFT {
  id: number;
  uri: string;
  status: boolean;
}

export default function Profile({
  togglePop,
}: {
  togglePop: (home: any) => void;
}) {
  const { nftsContract, marketplaceContract, initialize } = useContracts();
  const [nftData, setNftData] = useState<NFT[]>([]);
  const [username, setUsername] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [like, setLike] = useState<number[]>([]);

  const [metaData, setMetaData] = useState([]);
  const [userNftsData, setUserNftsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsername(Cookies.get("username") as string);
    setImageSrc(Cookies.get("img") as string);
    if (typeof window !== "undefined" && window.ethereum) {
      const getAccount = async () => {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        const account = await (await signer).getAddress();
        if (nftsContract) {
          const dataNft = await nftsContract.getNFTsByOwner(account);
          setMetaData(dataNft[0]);
        } else {
          await initialize();
        }
      };
      getAccount();
    }
  }, [nftsContract]);
  // useEffect(() => {
  //   setUsername(Cookies.get("username") as string);
  //   setImageSrc(Cookies.get("img") as string);
  //   const initialize = async () => {
  //     const res = await fetch(
  //       `http://localhost:3000/api/register/nfts/ipfs?address=${Cookies.get(
  //         "address"
  //       )}`
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setMetaData(data.data);
  //         console.log(data.data);
  //       })
  //       .catch((e) => console.log(e));
  //     // const data = await res.json();
  //     // setMetaData(data.data);
  //   };

  //   initialize();
  // }, []);

  useEffect(() => {
    const data = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);

        const network = await provider.getNetwork();
        const chainId = network.chainId.toString() as keyof typeof config;

        const signer = await provider.getSigner();
        const nfts = new Contract(config[chainId].nfts.address, NFTs, signer);
        const finalData = await Promise.all(
          metaData.map(async (item: any) => {
            const uri = await nfts.tokenURI(item);
            const status = await nfts.getStatus(item);
            console.log("Owner Nfts: ", await nfts.ownerOf(item));
            const response = await fetch(uri, { mode: "cors" });
            const metadata = await response.json();
            const nftData = { ...metadata, tokenURI: item, status };

            return nftData;
          })
        );
        setUserNftsData(finalData);
        setLoading(false);
      }
    };

    if (metaData.length > 0) {
      data().then(() => {
        // console.log(userNftsData);
      });
    }
  }, [metaData]);

  return (
    <div className="flex flex-col w-full h-screen px-5">
      {/* // image profile & name */}
      <div className="flex justify-center w-full h-2/5 items-end">
        <div className="flex flex-col items-center">
          <div className="w-[7rem] h-[7rem] rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src={`${imageSrc ? imageSrc : "/user_default.webp"}`}
              width={100}
              height={100}
              alt="Foto Profile"
              objectFit="cover"
              className="w-[100%] h-[100%]"
            />
          </div>
          <p className="text-gray-500 font-semibold">{username}</p>
        </div>
      </div>
      <div className="w-full flex justify-start items-center">
        <button
          type="button"
          className="text-white bg-[#000000] border border-gray-300 focus:outline-none hover:bg-gray-100 hover:text-gray-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-sm text-sm px-3 py-2 me-2 mb-2"
        >
          All
        </button>
        <button
          type="button"
          className="text-[#000000] bg-[#FFFFFF] border border-[#000000] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-light rounded-sm text-sm px-5 py-2 me-2 mb-2"
        >
          Collection
        </button>
        <button
          type="button"
          className="text-[#000000] bg-[#FFFFFF] border border-[#000000] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-light rounded-sm text-sm px-5 py-2 me-2 mb-2"
        >
          Listing
        </button>
        <button
          type="button"
          className="text-[#000000] bg-[#FFFFFF] border border-[#000000] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-light rounded-sm text-sm px-5 py-2 me-2 mb-2"
        >
          Offer
        </button>
        <button
          type="button"
          className="text-[#000000] bg-[#FFFFFF] border border-[#000000] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-light rounded-sm text-sm px-5 py-2 me-2 mb-2"
        >
          Transaction
        </button>
      </div>
      <hr className="my-2 bg-[#ABABAB]" />
      <div className="flex flex-wrap space-x-2">
        {loading ? (
          <p className="text-gray-500 font-semibold">Loading...</p>
        ) : userNftsData.length > 0 ? (
          userNftsData.map((items, index) => (
            <div key={index}>
              <Card
                statusNfts={items.status}
                status="seller"
                togglePop={togglePop}
                id={index}
                tokenURI={items.tokenURI}
                title={items.title}
                price={items.price}
                image={items.image}
                setLike={setLike}
                like={like}
                key={index}
                height={"25"}
                width={"10"}
                heightImage={"8"}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 font-semibold">No data</p>
        )}
      </div>
    </div>
  );
}
