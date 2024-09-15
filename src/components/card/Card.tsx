import React, { useCallback, useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiHeartOutline, mdiHeart } from "@mdi/js";
import { BrowserProvider, Contract, ethers } from "ethers";
import config from "@/app/config.json";
import Marketplace from "@/abi/Marketplace";
import NFTs from "@/abi/NFTs";
import Swal from "sweetalert2";

import useContracts from "@/hooks/useContracts";

interface CardProps {
  title: string;
  price: number;
  id: number;
  image: string;
  setLike: React.Dispatch<React.SetStateAction<number[]>>;
  like: number[];
  width: string;
  height: string;
  heightImage: string;
  togglePop: (listingId: any, tokenId: any, price: any) => void;
  status?: string;
  tokenURI?: string;
  tokenListings?: string;
  statusNfts?: boolean;
  account?: string;
  owner?: string;
  listingId?: any;
}

export default function Card({
  title,
  price,
  id,
  image,
  setLike,
  like,
  height,
  width,
  heightImage,
  togglePop,
  status,
  tokenURI,
  statusNfts,
  account,
  owner,
  listingId,
}: CardProps) {
  const { nftsContract, marketplaceContract, initialize } = useContracts();
  // const [listings, setListings] = useState<any[]>([]);

  // useEffect(() => {
  //   const fetchListings = async () => {
  //     if (marketplaceContract) {
  //       try {
  //         const allListings = await marketplaceContract.getAllListings();
  //         const parsedListings = allListings.map((listing: any[]) => ({
  //           seller: listing[0],
  //           buyer: listing[1],
  //           price: listing[2].toString(),
  //           tokenId: listing[3].toString(),
  //           sold: listing[4],
  //         }));
  //         setListings(parsedListings);
  //       } catch (error) {
  //         console.error("Error fetching listings:", error);
  //       }
  //     }else{
  //       await initialize();
  //     }
  //   };

  //   fetchListings();
  // }, [marketplaceContract]);

  const handleClick = (newNumber: number) => {
    setLike((prevLikes) => {
      if (prevLikes.includes(newNumber)) {
        return prevLikes.filter((like) => like !== newNumber);
      } else {
        return [...prevLikes, newNumber];
      }
    });
  };

  const tokens = (n: number) => {
    return ethers.parseUnits(n.toString(), "ether");
  };

  const sellTriger = async (tokenURI: string, price: number) => {
    if (!marketplaceContract) return;
    if (nftsContract) {
      try {
        await nftsContract.approve(marketplaceContract, tokenURI);
        const tx = await marketplaceContract.listNFT(
          nftsContract,
          tokenURI,
          ethers.parseEther(price.toString()),
          {
            gasLimit: 1000000,
          }
        );
        await tx.wait();
        console.log("Listed NFT:", tx.hash);
        console.log("Listed NFT:", tx);
        // alert("NFT listed for sale!");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your NFT has been listed",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error(error);
        // alert("Error listing NFT");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to list NFT!",
        });
      }
    }
  };

  return (
    <>
      <div
        className={`flex flex-col w-[${width}rem] h-[${height}rem] bg-[#FFFFFF] rounded-lg drop-shadow-lg`}
      >
        <div className={`h-[${heightImage}rem] w-full`}>
          <div
            className={`w-[${width}rem] absolute flex justify-end py-2 px-2`}
          >
            <button onClick={() => handleClick(id)}>
              <Icon
                path={like.includes(id) ? mdiHeart : mdiHeartOutline}
                className={`${
                  like.includes(id) ? "text-red-500" : "text-gray-300"
                }`}
                size={1}
              />
            </button>
          </div>
          <img src={image} alt="" className="rounded-lg w-full h-full" />
        </div>
        <div className="flex flex-col px-3 py-2 space-y-3 h-full">
          <div className="flex justify-between">
            <p className="text-gray-900 text-xs font-semibold">{title}</p>
            <div className="flex space-x-1 items-center">
              <img src="svg/eth.svg" alt="" className="h-3" />
              <p className="text-gray-700 text-xs font-light">{price}</p>
            </div>
          </div>
          <div className="flex justify-between items-end">
            {status === "seller" ? (
              statusNfts ? (
                <button
                  className="border-red-500/50 border-[1px] w-full h-5 rounded-sm cursor-not-allowed"
                  onClick={() => {}}
                >
                  <p className="text-[7px] text-red-500/50 font-light">
                    Waiting For Buyer & Let's Confirmation
                  </p>
                </button>
              ) : (
                <button
                  className="border-red-500 border-[1px] w-10 h-5 rounded-sm"
                  onClick={() => sellTriger(tokenURI as string, price)}
                >
                  <p className="text-[7px] text-red-500 font-light">Sell</p>
                </button>
              )
            ) : account == owner && status === "buyer" ? (
              <button
                className="border-green-500/50 border-[1px] w-full h-5 rounded-sm cursor-not-allowed"
                onClick={() => {}}
              >
                <p className="text-[7px] text-green-500/50 font-light">
                  Waiting For Buyer & Let's Confirmation
                </p>
              </button>
            ) : (
              <>
                <p className="text-gray-800 text-sm">Fixed Price</p>
                <button
                  className="border-[#807CF7] border-[1px] w-10 h-5 rounded-sm"
                  onClick={() => togglePop(listingId, tokenURI, price)}
                >
                  <p className="text-[7px] text-[#807CF7] font-light">
                    Buy Now
                  </p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
