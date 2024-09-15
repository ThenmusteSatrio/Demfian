import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiCloseBoxOutline } from "@mdi/js";
import useContracts from "@/hooks/useContracts";
import { ethers } from "ethers";

export default function ModalBuy({
  togglePop,
  selectedProduct,
  listingId,
  price,
}: {
  togglePop: any;
  selectedProduct: any;
  listingId: any;
  price: any;
}) {
  const { nftsContract, marketplaceContract, initialize } = useContracts();
  const [productDetail, setProductDetail] = useState({} as any);

  useEffect(() => {
    const fetchData = async () => {
      if (nftsContract) {
        try {
          const nftLinkDetail = await nftsContract.tokenURI(selectedProduct);
          const detailNFTs = await fetch(nftLinkDetail);
          const json = await detailNFTs.json();
          setProductDetail(json);
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        await initialize();
      }
    };

    fetchData();
  }, [nftsContract]);

  const buyProduct = async () => {
    if (marketplaceContract) {
      try {
        const tx = await marketplaceContract.buyNFT(listingId, {
          value: ethers.parseEther(price),
        });
        await tx.wait();
        togglePop();
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      await initialize();
      buyProduct();
      console.log("Error: Gagal Menginisialisasi");
    }
  };
  return (
    <div className="homes overflow-hidden z-50">
      <div className="home__details overflow-hidden rounded-lg grid grid-cols-2 px-2 py-2">
        <div className="home__image overflow-hidden">
          <img
            src={productDetail.image}
            alt="Home"
            className="rounded-md w-full h-full"
          />
        </div>
        <div className="home__overview self-center">
          <h1 className="text-gray-900 font-bold mt-2 mb-1">
            {productDetail.title}
          </h1>
          <h2 className="text-gray-600 text-sm">{productDetail.price} ETH</h2>
          <div>
            <button
              onClick={() => buyProduct()}
              className="home__buy bg-[#2852CF] font-light"

              // disabled={hasBought}
            >
              Buy
            </button>

            <button className="home__contact text-sm">Contact Agent</button>
          </div>

          <hr className="bg-[#B6B6B6]" />
          <h2 className="text-[#000000] font-light">Overview</h2>
          <p className="text-gray-600 font-light text-sm">
            {productDetail.description}
          </p>
          <hr className="bg-[#B6B6B6]" />
          <h2 className="text-gray-600 text-sm">Facts and Features</h2>
          <ul className="text-gray-900 text-sm mt-2 space-y-1">
            <li>
              <strong>Chain</strong> : {productDetail.chain}
            </li>
            <li>
              <strong>Artist</strong> : {productDetail.artist}
            </li>
            <li>
              <strong>Created At</strong> : {productDetail.created_at}
            </li>
            {/* {home.attributes.map((attributes, index) => (
                <li key={index}>
                  <strong>{attributes.trait_type}</strong> : {attributes.value}
                </li>
              ))} */}
          </ul>
        </div>
      </div>
      <button onClick={togglePop} className="home__close">
        {/* <img src={close} alt="Close" /> */}
        <Icon path={mdiCloseBoxOutline} size={1} />
      </button>
    </div>
  );
}
