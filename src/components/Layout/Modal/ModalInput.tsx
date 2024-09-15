import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiCloseBoxOutline } from "@mdi/js";
import Lottie from "lottie-react";
import * as Crypto from "@/data/animation/crypto.json";
import Cookies from "js-cookie";

import useContracts from "@/hooks/useContracts";
import { ethers } from "ethers";
export default function ModalInput({
  sellTogglePop,
}: {
  sellTogglePop: () => void;
}) {
  const { nftsContract, marketplaceContract } = useContracts();
  // const [menuInspector, setMenuInspector] = useState(false);
  // const [menuLender, setMenuLender] = useState(false);

  const [address, setAddress] = useState<string>("");
  const [image, setImage] = useState<File>();

  useEffect(() => {
    setAddress(Cookies.get("address") as string);
  }, []);

  const handleFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const upload = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", e.target.name.value);
    formData.append("price", e.target.price.value);
    formData.append("chain", e.target.chain.value);
    formData.append("artist", e.target.artist.value);
    formData.append("created_at", e.target.created_at.value);
    if (image) {
      formData.append(
        "image",
        image instanceof Blob ? image : new Blob([image])
      );
    }
    formData.append("description", e.target.description.value);
    formData.append("metamaskAddress", address);

    const res = await fetch("/api/register/nfts/ipfs", {
      method: "POST",
      body: formData,
    });

    const metadata = await res.json();

    handleMint(metadata.metadata);
  };

  const handleMint = async (metadata: any) => {
    if (nftsContract) {
      try {
        console.log(metadata)
        const tx = await nftsContract.mint(metadata, {
          nonce: 1,
        });
        await tx.wait();
        const tokenId = await nftsContract.totalSupply();
        console.log("Minted token ID:", tokenId.toString());
        if (tx) {
          sellTogglePop();
        }
        console.log("Minting successful!");
      } catch (error) {
        console.error("Minting failed:", error);
      }
    }
  };




  return (
    <div
      className="absolute h-screen w-full z-50 grid place-items-center"
      id="modalbuy"
    >
      <div className="w-[32%] h-[82%] bg-[#FFFFFF] rounded-md  shadow-2xl overflow-y-scroll">
        <form className="flex flex-col px-4 py-6" onSubmit={upload}>
          <div className="flex justify-between">
            <img src="svg/inputnfts.svg" alt="" className="w-2/4" />
            <div onClick={sellTogglePop}>
              <Icon
                path={mdiCloseBoxOutline}
                size={1}
                className="text-gray-400 cursor-pointer font-light"
              />
            </div>
          </div>
          {/* // name */}
          <div className="flex w-[100%] items-center">
            <div className="w-full">
              <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium text-gray-800 font-light"
              >
                Name
              </label>
              <input
                name="name"
                type="text"
                id="name"
                className=" border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-[100%] px-2.5 py-1"
                placeholder="Ex: monkey adidas "
                required
              />
            </div>
            <Lottie animationData={Crypto} className="w-[30%]" />
          </div>
          {/* // artist & chain */}
          <div className="flex w-[100%] space-x-3">
            <div className="w-full">
              <label
                htmlFor="artist"
                className="block mb-1 text-sm font-medium text-gray-800 font-light"
              >
                Artist
              </label>
              <input
                name="artist"
                type="text"
                id="artist"
                className=" border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-[100%] px-2.5 py-1"
                placeholder="Ex: Jonathan Davis "
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="Chain"
                className="block mb-1 text-sm font-medium text-gray-800 font-light"
              >
                Chain
              </label>
              <input
                name="chain"
                type="text"
                id="Chain"
                className=" border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-[100%] px-2.5 py-1"
                placeholder="Ex: Avalanche "
                required
              />
            </div>
          </div>
          {/* //  price & created at*/}
          <div className="flex w-[100%] space-x-3 mt-2">
            <div className="w-full">
              <label
                htmlFor="price"
                className="block mb-1 text-sm font-medium text-gray-800 font-light"
              >
                Price
              </label>
              <input
                type="text"
                name="price"
                id="price"
                className=" border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-[100%] px-2.5 py-1"
                placeholder="Ex: 0.5 ETH "
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="created_at"
                className="block mb-1 text-sm font-medium text-gray-800 font-light"
              >
                Created At
              </label>
              <input
                type="text"
                name="created_at"
                id="created_at"
                className=" border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-[100%] px-2.5 py-1"
                placeholder="Ex: Avalanche "
                required
              />
            </div>
          </div>
          {/* //inspector & lender */}
          {/* <div className="flex w-[100%] space-x-3 mt-2">
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-800 font-light">
                Inspector
              </label>
              <button
                onClick={() => setMenuInspector(!menuInspector)}
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
                className="flex justify-end items-center text-gray-900 font-medium rounded-sm text-sm px-2.5 py-2 text-center inline-flex items-center border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-[100%]"
                type="button"
              >
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <div
                id="dropdown"
                className={`z-10 ${
                  menuInspector ? "" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-[100%]`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:hover:text-white"
                    >
                      Joe Doe
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Brad Delson
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-800 font-light">
                Lender
              </label>
              <button
                onClick={() => setMenuLender(!menuLender)}
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
                className="flex justify-end items-center text-gray-900 font-medium rounded-sm text-sm px-2.5 py-2 text-center inline-flex items-center border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-[100%]"
                type="button"
              >
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <div
                id="dropdown"
                className={`z-10 ${
                  menuLender ? "" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-[100%]`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Joe Doe
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-900"
                    >
                      Brad Delson
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
          <div className="w-[100%] mt-2">
            <label
              className="block mb-2 text-sm font-medium text-gray-800 font-light"
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              onChange={handleFileImage}
              name="file"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer focus:outline-none"
              id="file_input"
              type="file"
            />
          </div>
          {/* // decription */}
          <div className="w-[100%] mt-2">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-800 font-light"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900  rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 'New Realities' is an expansive 300 piece exploration of the emerging era where AI empowers us to shape our world according to our imaginations, dreams, and desires."
            ></textarea>
          </div>
          {/* // button */}
          <div className="w-[100%] mt-3">
            <button
              type="submit"
              className="text-white bg-[#1077D1] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-1 text-center me-2 mb-2 w-[100%]"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
