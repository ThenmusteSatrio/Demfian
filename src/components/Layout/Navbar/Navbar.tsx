"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";
import ModalInput from "../Modal/ModalInput";
import Cookies from "js-cookie";

export default function Navbar({
  currentPage,
  blur,
  setBlur,
}: {
  currentPage: string | null;
  blur: boolean | null;
  setBlur: any | null;
}) {
  const [sellToggle, setSellToggle] = useState(false);
  const sellTogglePop = async () => {
    sellToggle ? setSellToggle(false) : setSellToggle(true);
    blur ? setBlur(false) : setBlur(true);
  };

  const navigation = [
    { name: "Home", href: "/home", current: true },
    { name: "Marketplace", href: "/marketplace", current: false },
    { name: "FAQ", href: "/faq", current: false },
    { name: "Help Center", href: "/help-center", current: false },
  ];

  const [imageSrc, setImageSrc] = useState("");
  useEffect(() => {
    setImageSrc(Cookies.get("img") as string);
  }, []);
  return (
    <>
      {sellToggle && <ModalInput sellTogglePop={sellTogglePop} />}
      <div className="flex mx-10 items-center justify-between bg-transparent">
        <Image src={"/demfi.png"} alt="logo" width={50} height={50} />
        <div className="flex justift-center items-end space-x-7">
          {navigation.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className={`text-sm ${
                item.name == currentPage ? "text-[#4AD6C8]" : "text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex justift-center items-center space-x-5">
          <button
            className={`text-sm ${sellToggle && "text-red-500"}`}
            onClick={sellTogglePop}
          >
            Mint
          </button>
          <Link href={"/profile"}>
            {imageSrc ? (
              <div className="w-7 cursor-pointer h-7 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src={`${imageSrc ? imageSrc : "/user_default.webp"}`}
                  width={100}
                  height={100}
                  alt="Foto Profile"
                  objectFit="cover"
                  className="w-[100%] h-[100%]"
                />
              </div>
            ) : (
              <Icon
                path={mdiAccountCircle}
                size={1}
                className={`cursor-pointer ${
                  currentPage == "Profile" && "text-[#4AD6C8]"
                }`}
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
