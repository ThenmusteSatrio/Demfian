"use client"
import Loading from "@/components/Layout/Loading";
import Navbar from "@/components/Layout/Navbar/Navbar";
import React, { useState } from "react";
import { Suspense } from "react";
import Profile from "./page";

export default function ProfileLayout({ children }) {
  const [blur, setBlur] = useState(false);
  const togglePop = async (home) => {
    setHome(home);
    toggle ? setToggle(false) : setToggle(true);
  };
  return (
    <Suspense fallback={<Loading />}>
      <div className="bg-gradient-to-b from-[#737373] from-4% to-[#FFFFFF] to-40% w-screen h-screen">
        <div
          className={`pt-5 absolute w-full z-10 ${
            blur && "bg-black/50 z-40 h-full"
          }`}
        >
          <Navbar currentPage="Profile" blur={blur} setBlur={setBlur} />
        </div>
        <Profile togglePop={togglePop}/>
      </div>
    </Suspense>
  );
}
