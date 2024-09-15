"use client";
import React, { useState } from "react";
import Lottie from "lottie-react";
import * as Monkey from "@/data/animation/monkey.json";
import Card from "@/components/card/Card";

const dataDummy = [
  {id: 1, title: 'Card 1', price: 100, image: 'https://picsum.photos/200/300'},
  {id: 2, title: 'Card 2', price: 200, image: 'https://picsum.photos/200/300'},
  {id: 3, title: 'Card 3', price: 300, image: 'https://picsum.photos/200/300'},
  {id: 4, title: 'Card 4', price: 400, image: 'https://picsum.photos/200/300'},
]

export default function home() {
  const [like, setLike] = useState<number[]>([]);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mt-20 mx-32">
        <div className="flex flex-col space-y-8 items-center justify-center">
          <img src="svg/discover.svg" alt="" />
          <p className="text-[#A29D9D] text-md">
            DEMFI is the best Platform to sell and buy NFT assets
          </p>
          <button className="w-[10rem]  h-[2.1rem] rounded-2xl bg-[#D9D9D9]">
            <p className="text-sm text-gray-900 text-center">View Collection</p>
          </button>
        </div>
        <Lottie animationData={Monkey} />
      </div>
      <div className="mx-32 mt-20">
        <div className="flex justify-between items-end">
          <img src="svg/amaze.svg" alt="" className="h-12" />
          <button className="bg-[#807CF7] w-[5rem] h-[2.1rem] rounded-md">
            <p className="text-[#FFFFFF] text-xs">See All</p>
          </button>
        </div>
        <div className="flex space-x-10 mt-10">
          {
            dataDummy.map((item) => (
              
              <Card id={item.id} title={item.title} price={item.price} image={item.image} setLike={setLike} like={like} width={"10"} height={"12"} key={item.id} heightImage={"8"}/>
            ))
          }
        </div>
      </div>
    </div>
  );
}
