"use client"
import React, { useState } from "react";
import Home from "../page";
import Navbar from "@/components/Layout/Navbar/Navbar";
import { Suspense } from "react";
import Loading from "@/components/Layout/Loading";

function HomeLayout({ children }) {
  const [blur, setBlur] = useState(false);
  return (
    <div className="bg-gradient-to-tr from-gradient-start from-60% to-gradient-end to-100% h-screen">
      <Suspense fallback={<Loading />}>
      <div className={`pt-5 ${blur && "bg-black/50 z-40 h-full"}`}>
        <Navbar currentPage="Home" blur setBlur={setBlur} />
        {children}
      </div>
      </Suspense>
    </div>
  );
}

export default HomeLayout;
