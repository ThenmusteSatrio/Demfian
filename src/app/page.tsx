"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Vortex } from "@/components/ui/Vortex";
import { MultiStepLoader as Loader } from "@/components/ui/MultiLoader";
import Icon from "@mdi/react";
import { mdiCloseBoxOutline } from "@mdi/js";
import { useRouter } from "next/navigation";
import Metamask from "@/components/svg/Metamask";
import { getAddress } from "@/hooks/getAccount";
import Lottie from "lottie-react";
import { Form } from "@/components/auth/Form";
import * as NFT from "@/data/animation/nft.json";
import Cookies from "js-cookie";
// const World = dynamic(
//   () => import("@/components/ui/globe").then((m) => m.World),
//   {
//     ssr: false,
//   }
// );

export default function Home() {
  const [loading, setLoading] = useState(false);
  const loadingStates = [
    {
      text: "Enter the main dashboard page",
    },
    {
      text: "read some posts or news",
    },
    {
      text: "help the community in validating the truth of news/posts",
    },
    {
      text: "give a tip to the creator of the news/post",
    },
    {
      text: "Earn your own income by becoming part of DCNP",
    },
    {
      text: "Become a trusted news creator and get tips in the form of your favorite cryptocurrency",
    },
    {
      text: "or apply to be our official validator to earn some cryptocurrencies as tips",
    },
    {
      text: "Welcome to DCNP and Enjoy it!",
    },
  ];

  const [loop, setLoop] = useState(true);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loop) {
      setLoadingIndicator(true);
      try {
        router.push("/dashboard");
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        setLoadingIndicator(false);
        setLoading(false);
      }
    }
  }, [loop]);

  const [error, setError] = useState("");
  const [isSetProfile, setProfile] = useState(false);
  const [metamaskAddress, setMetamaskAddress] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [enter, setEnter] = useState(false);

  // useEffect(() => {
  //   if (Cookies.get("img") && Cookies.get("username") && Cookies.get("address")) {
  //     router.push("/home");
  //   }
  // },[])
  const handleMetamaskLogin = async (e: any) => {
    e.preventDefault();
    try {
      const address = await getAddress();
      if (address) {
        setMetamaskAddress(address);
        console.log(address);
        const res = await fetch("/api/auth", {
          method: "POST",
          body: JSON.stringify({ address }),
        });
        console.log(res);
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          Cookies.set("img", data.imageUrl, { expires: 1 });
          Cookies.set("username", data.username, { expires: 1 });
          Cookies.set("address", data.userAddress, { expires: 1 });
          router.push("/home");
        } else {
          setProfile(true);
        }
        setTimeout(() => {
          const element = document.getElementById("register");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }, 1000);
        setTimeout(() => {
          const element = document.getElementById("splash");
          if (element) {
            element.classList.add("hidden");
          }
        }, 2000);
      }
    } catch (error) {
      setError("Something went wrong or your wallet is not connected");
    }
  };

  const setAccount = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("metamaskAddress", metamaskAddress);
    if (image) {
      formData.append(
        "image",
        image instanceof Blob ? image : new Blob([image])
      );
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      if (res.status == 200) {
        const data = await res.json();
        Cookies.set("img", data.imageUrl, { expires: 1 });
        Cookies.set("username", data.username, { expires: 1 });
        Cookies.set("address", data.userAddress, { expires: 1 });
        router.push("/home");
        console.log("Upload successful:", data);
      } else {
        router.refresh();
        console.error("Upload failed:", res.statusText);
      }
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  useEffect(() => {
    if (enter) {
      setAccount();
    }
  }, [enter]);

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-row items-center justify-center py-20 h-screen md:h-auto dark:bg-black bg-white relative w-full overflow-x-hidden overflow-y-hidden"
        id="splash"
      >
        {loadingIndicator && (
          <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center inset-0 backdrop-blur-2xl">
            <div className="loader bw">
              <div className="flow-cross" />
            </div>
          </div>
        )}
        <Loader
          loadingStates={loadingStates}
          loading={loading}
          duration={2000}
          loop={loop}
          setLoop={setLoop}
        />
        {loading && (
          <button
            className="fixed top-4 right-4 text-black dark:text-white z-[120]"
            onClick={() => {
              setLoading(false);
              router.refresh();
            }}
          >
            <Icon
              path={mdiCloseBoxOutline}
              className="h-10 w-10"
              color={"#39C3EF"}
            />
          </button>
        )}
        <div className="absolute top-5 right-5 z-10 flex space-x-4">
          {/* <button
            onClick={handleMetamaskLogin}
            type="button"
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
          >
            <Metamask />
            Sign in with Metamask
          </button> */}
        </div>
        <div className="absolute w-screen overflow-hidden px-4">
          <Vortex />
        </div>
        <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="div"
          >
            <div className="flex justify-center items-center">
              <Lottie animationData={NFT} className="w-1/3 " />
            </div>
            <h2 className="text-center text-xl md:text-4xl font-bold text-black dark:text-white">
              Welcome to DEMFI
            </h2>
            <p className="text-center text-base md:text-md font-normal text-neutral-700 dark:text-gray-300 max-w-md mt-2 mx-auto">
              Explore, Buy, and Sell Digital Art and Photography on Our
              Decentralized Marketplace
            </p>
            <div className="flex justify-center items-center mt-10">
              <button
                onClick={handleMetamaskLogin}
                type="button"
                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
              >
                <Metamask />
                Sign in with Metamask
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      {isSetProfile && (
        <Form
          setImage={setImage}
          setUsername={setUsername}
          setEnter={setEnter}
        />
      )}
    </div>
  );
}
