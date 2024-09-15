"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiStarOutline, mdiShareVariantOutline, mdiDownload } from "@mdi/js";
import Card from "@/components/card/Card";
import useContracts from "@/hooks/useContracts";
import { ethers } from "ethers";

export default function Marketplace({
  togglePop,
}: {
  togglePop: (listingId: any, tokenId: any, price: any) => void;
}) {
  const [like, setLike] = useState<number[]>([]);
  // const dataDummy = [
  //   {
  //     id: 1,
  //     title: "Card 1",
  //     price: 100,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 2,
  //     title: "Card 2",
  //     price: 200,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 3,
  //     title: "Card 3",
  //     price: 300,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 4,
  //     title: "Card 4",
  //     price: 400,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 5,
  //     title: "Card 1",
  //     price: 100,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 6,
  //     title: "Card 2",
  //     price: 200,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 7,
  //     title: "Card 3",
  //     price: 300,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 9,
  //     title: "Card 1",
  //     price: 100,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 10,
  //     title: "Card 2",
  //     price: 200,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 11,
  //     title: "Card 3",
  //     price: 300,
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: 12,
  //     title: "Card 4",
  //     price: 400,
  //     image: "https://picsum.photos/200/300",
  //   },
  // ];
  const { nftsContract, marketplaceContract, initialize } = useContracts();
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    setListings([]);
    const fetchListings = async () => {
      if (marketplaceContract) {
        try {
          const allListings = await marketplaceContract.getAllListings();
          const parsedListings = allListings.map((listing: any[]) => ({
            seller: listing[0],
            buyer: listing[1],
            tokenId: listing[2].toString(),
            price: ethers.formatEther(listing[3].toString()),
            sold: listing[4],
            listingId: listing[5],
          }));
          setListings(parsedListings);
        } catch (error) {
          console.error("Error fetching listings:", error);
        }
      } else {
        await initialize();
      }
    };

    fetchListings();
  }, [marketplaceContract]);

  const [account, setAccount] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const getAccount = async () => {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        const account = await (await signer).getAddress();
        setAccount(account);
      };
      getAccount();
    }
  }, []);

  const [finalData, setFinalData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (nftsContract) {
        try {
          listings.forEach(async (listing: any) => {
            setFinalData([]);
            const allNFTsLink = await nftsContract.tokenURI(listing.tokenId);
            const owner = await nftsContract.ownerOf(listing.tokenId);
            const allNFTs = await fetch(allNFTsLink);
            const json = await allNFTs.json();
            const partData = {
              ...json,
              tokenId: listing.tokenId,
              listingId: listing.listingId,
              owner: owner,
            };
            
            setFinalData([]);
            setFinalData((prevData: any) => [...prevData, partData]);
            console.log(partData);

            // setFinalData((prevData: any) => [...prevData, allNFTs]);
          });
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      } else {
        await initialize();
      }
    };

    fetchData();
  }, [listings]);

  return (
    <>
      <div className="w-full h-full]">
        <div className="flex flex-col items-start h-screen w-full bg-[#FFFFFF]">
          <div className="h-full w-full">
            <img
              src="img/superhero.jpg"
              alt=""
              className="z-10 h-[10rem] w-full"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="h-full w-full flex flex-col justify-start items-end pr-14 mt-7 bg-[#FFFFFF]">
            <div className="rounded-lg bg-gradient-to-r from-[#182659] from-1% via-[#061225] via-10% to-[#18140C] to-40% w-[74%] h-[8rem] flex justify-between">
              <div className="flex flex-col justify-center items-start space-y-2 ml-10">
                <img src="svg/sell.svg" alt="" />
                <img
                  src="svg/sellandarrow.svg"
                  alt=""
                  className="cursor-pointer"
                />
              </div>
              <Image
                width={500}
                height={200}
                style={{ objectFit: "cover" }}
                src="/img/fantasy.jpg"
                alt=""
                className="rounded-lg h-[8rem]"
              />
            </div>
            <div className="mt-7 flex justify-between  w-[74%]">
              <form className="">
                <select
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-600 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option defaultValue={""}>Price Filter</option>
                  <option value="">low to high</option>
                  <option value="">high to low</option>
                </select>
              </form>
              <form className="flex items-center">
                <label htmlFor="voice-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 21 21"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="voice-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
                    placeholder="Search Mockups, Logos, Design Templates..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-4 h-4 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  Search
                </button>
              </form>
            </div>
            <div className="w-[75%] mt-7 h-full  overflow-y-scroll">
              <div className="grid grid-cols-4 gap-4 w-full h-full pl-[1%]">
                {finalData.map((item, index) => (
                  <div key={index}>
                    <Card
                    status="buyer"
                    listingId = {item.listingId}
                      owner={item.owner}
                      account={account}
                      tokenURI={item.tokenId}
                      togglePop={togglePop}
                      id={item.id}
                      title={item.title}
                      price={item.price}
                      image={item.image}
                      setLike={setLike}
                      like={like}
                      key={item.id}
                      height={"25"}
                      width={"12.5"}
                      heightImage={"8"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* long card */}
          <div className="w-[18rem] bg-[#FFFFFF] h-[85%] fixed z-10 mt-[7rem] ml-10 rounded-lg drop-shadow-lg">
            {/* middle section */}
            <div className="w-[18rem] -mt-10 mt flex flex-col justify-center items-center ">
              {/* Image Rounded */}
              <div className="h-[6.2rem] w-[6.2rem] rounded-full overflow-hidden flex justify-center items-center border-gray-900 border bg-[#FFFFFF]">
                <div className="h-[6rem] w-[6rem] rounded-full overflow-hidden">
                  <Image
                    src="/img/superhero.jpg"
                    alt=""
                    width={100}
                    height={100}
                    objectFit={"cover"}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h3 className="font-light mt-2 text-md text-gray-900">
                Devils Advocat
              </h3>
              <p className="text-xs text-gray-900 mt-1">
                by <b>Adrian</b>
              </p>
              <div className="flex space-x-1 mt-2">
                <div className="w-6 h-6 border-[#A0A0A0] border rounded-full flex justify-center items-center">
                  <Icon path={mdiStarOutline} size={0.7} color={"#A0A0A0"} />
                </div>
                <div className="w-6 h-6 border-[#A0A0A0] border rounded-full flex justify-center items-center">
                  <Icon
                    path={mdiShareVariantOutline}
                    size={0.7}
                    color={"#A0A0A0"}
                  />
                </div>
              </div>
              {/* button download */}
              <button className="flex items-center justify-end mt-5 bg-[#2977EC] w-[8rem] h-[2.1rem] rounded-md space-x-1">
                <p className="text-[#FFFFFF] text-xs">Download</p>
                <div className="w-10 h-full bg-[#2367CD] flex justify-center items-center rounded-md">
                  <Icon path={mdiDownload} size={1} />
                </div>
              </button>
            </div>
            <div className="flex flex-col justify-start mx-5 mt-14">
              <h2 className="text-sm text-gray-900 font-semibold">About</h2>
              <div>
                <p className="text-justify text-gray-500 mt-1 text-xs leading-3">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet
                  maiores, fugit incidunt cumque consequatur vitae sit, pariatur
                  assumenda vero temporibus saepe modi perferendis voluptatem
                  nisi vel consectetur, quasi reiciendis debitis accusamus?
                  Placeat voluptate modi assumenda! Labore tempora recusandae,
                  commodi ut accusamus laborum eaque architecto velit neque
                  animi cumque quisquam saepe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
