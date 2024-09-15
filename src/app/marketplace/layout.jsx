"use client";
import Loading from "@/components/Layout/Loading";
import Navbar from "@/components/Layout/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import ModalBuy from "./components/modalbuy";
import Marketplace from "./page";

export default function MarketLayout({ children }) {
  const [toggle, setToggle] = useState(null);
  const [listingId, setListingId] = useState("");
  const [blur, setBlur] = useState(false);
  const [price, setPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const togglePop = async (_listingId, tokenId, price) => {
    setListingId(_listingId);
    setSelectedProduct(tokenId)
    setPrice(price);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div className="">
      <Suspense fallback={<Loading />}>
        {toggle && (
          <div className="w-screen h-screen fixed bg-black/50 z-50">
            <ModalBuy togglePop={togglePop} listingId={listingId} price={price} selectedProduct={selectedProduct}/>
          </div>
        )}
        <div className={`pt-5 absolute w-full ${blur && "bg-black/50 z-40 h-full"}`}>
          <Navbar currentPage="Marketplace" blur={blur} setBlur={setBlur} />
        </div>
        <Marketplace togglePop={togglePop} />
      </Suspense>
    </div>
  );
}
