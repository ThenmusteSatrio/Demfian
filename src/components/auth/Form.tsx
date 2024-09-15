"use client";
import React, { useRef, useState } from "react";
import { BackgroundBeams } from "../ui/BeamsBackground";
import { useTransition, animated } from "@react-spring/web";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Form({
  setImage,
  setUsername,
  setEnter
}: {
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setEnter: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const username = useRef<HTMLInputElement>(null);
  const [lastUsername, setLastUsername] = useState("");
  const [lastImage, setLastImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("/user_default.webp");
  const [headerText, setHeaderText] = useState(`Make Something Amazing`);
  const [text, setText] = useState(
    `Welcome to DEMFI, the cutting-edge marketplace designed to revolutionize the way you buy and sell NFTs. In the ever-expanding world of digital assets, DEMFI stands out by offering a seamless and secure platform for NFT enthusiasts and creators alike.`
  );

  const headers = ["Make Something Amazing"];
  const texts = [
    `Welcome to DEMFI, the cutting-edge marketplace designed to revolutionize the way you buy and sell NFTs. In the ever-expanding world of digital assets, DEMFI stands out by offering a seamless and secure platform for NFT enthusiasts and creators alike`,
    "One More Step to Join Our Community",
  ];

  const headerTransitions = useTransition(headerText, {
    from: { opacity: 0, transform: "scale(0.8)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.8)" },
    reset: true,
    config: { duration: 500 },
  });
  const transitions = useTransition(text, {
    from: { opacity: 0, transform: "skewX(45deg)" },
    enter: { opacity: 1, transform: "skewX(0deg)" },
    leave: { opacity: 0, transform: "skewX(-45deg)" },
    reset: true,
    config: { duration: 500 },
  });

  const router = useRouter();
  const handleClick = () => {
    if (text === texts[1]) {
      setImage(lastImage);
      setUsername(lastUsername);
      setEnter(true);
    }
    if (username !== null) {
      setLastUsername(username.current?.value as string);
      setText((prevText) => (prevText === texts[0] ? texts[1] : texts[1]));
      if (headerText === headers[0]) {
        setHeaderText(`Hi ${username.current?.value}, Welcome to DEMFI`);
      }
    }
  };

  const handleBack = () => {
    if (text === texts[1]) {
      setText(texts[0]);
      setHeaderText(headers[0]);
    }
  };

  const handleFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setLastImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      
      reader.readAsDataURL(file);
      document.getElementById("upload_input")?.classList.add("hidden");
    }
  };
  return (
    <>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Staatliches&display=swap');
      </style>
      <div
        className="h-[40rem] w-full h-screen rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased"
        id="register"
      >
        <div className="max-w-2xl mx-auto p-4">
          {headerTransitions((style, item) => (
            <animated.div
              style={style}
              className="relative z-10 text-lg md:text-6xl font-montserrat bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold"
            >
              {item}
            </animated.div>
          ))}
          {transitions((style, item) => (
            <animated.div
              style={style}
              className={`text-neutral-500 max-w-lg mx-auto my-2 ${
                text === texts[1] ? "text-md" : "text-sm"
              } text-center relative z-10`}
            >
              {item}
            </animated.div>
          ))}

          {text === texts[1] ? (
            <div className="flex flex-col items-center justify-center mt-5 space-y-2">
              <div className="w-[7rem] h-[7rem] rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src={previewImage}
                  width={100}
                  height={100}
                  alt="Foto Profile"
                  objectFit="cover"
                  className="w-[100%] h-[100%]"
                />
              </div>

              <label
                className="block mb-2 mt-2 text-xs font-medium text-gray-300"
                htmlFor="multiple_files"
              >
                Upload profile picture
              </label>

              <div
                className="flex items-center justify-center w-full"
                id="upload_input"
              >
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col z-10 items-center justify-center w-full h-32 border-2 border-gray-800 cursor-pointer border-dashed rounded-lg cursor-pointer  hover:bg-white dark:hover:border-gray-500 hover:text-black"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileImage}
                  />
                </label>
              </div>
            </div>
          ) : (
            <>
              <input
                type="text"
                ref={username}
                placeholder="hi, how can we call your name"
                className="rounded-lg border border-[9#89898] focus:ring-2 focus:ring-teal-500  w-full relative z-10 mt-4 px-4  py-2 bg-neutral-950 placeholder:text-neutral-700"
                required
              />
            </>
          )}
        </div>
        <div
          className={`max-w-2xl w-full flex ${
            previewImage != "/user_default.webp"
              ? "justify-center"
              : "justify-end"
          } space-x-4 ${text === texts[0] && "justify-end lg:mr-7"}`}
        >
          {text === texts[1] && (
            <button
              style={{ backgroundColor: "black" }}
              onClick={handleBack}
              className={`px-10 py-1 rounded-sm text-white font-bold transition text-sm relative z-10 mt-5 duration-200 hover:bg-white hover:text-[#136AA9] border-2 border-transparent hover:border-[#136AA9]`}
            >
              Back
            </button>
          )}
          <button
            onClick={handleClick}
            className={`px-10 py-2 rounded-sm text-white font-bold transition text-sm bg-[#136AA9] relative z-10 mt-5 duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-[#136AA9]`}
          >
            {text === texts[1] ? "Enter" : "Next"}
          </button>
        </div>
        <BackgroundBeams />
      </div>
    </>
  );
}
