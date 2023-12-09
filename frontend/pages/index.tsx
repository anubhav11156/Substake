import type { Metadata } from "next";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Substake",
  description: "Substake",
};

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <Suspense fallback={<Loading />}>
      <div
        className="h-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #ffdead 0%, #e1d77d 100%)",
        }}
      >
        <Navbar isNavLink={false} />

        <div
          className={cn(
            font.className,
            "h-full lg:h-[calc(100vh-82px)] flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full max-w-[85rem] mx-auto px-3 gap-24 lg:gap-0"
          )}
        >
          <div className="mt-16 lg:mt-0 flex flex-col justify-center items-center lg:items-start lg:justify-start relative">
            <h1 className="font-bold text-6xl text-center lg:text-start text-mainBg leading-[4.8rem] tracking-wider">
              Unlock liquidity and <br className="hidden lg:flex" /> amplify
              rewards
            </h1>

            <p className="font-medium text-center lg:text-start text-lg text-[#4a4622] leading-[4.8rem] tracking-wider">
              Start liquid staking securely across multiple chains
            </p>

            <Button
              className="rounded-xl mt-3.5 lg:mt-5 bg-[#fadfb5] hover:bg-mainBg hover:text-white text-mainBg transition-all border-2 border-mainBg text-base font-semibold h-16 w-32 z-10 bg-transparent"
              onClick={() => router.push("/application/stake")}
            >
              Launch Dapp
            </Button>
          </div>

          <div className="relative w-[462px] h-[240px] xl:w-[562px] xl:h-[289px] mb-5 md:mb-0">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 562 289"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M283.889 25.0509L378.538 80.3835C381.574 82.1584 381.549 86.5546 378.494 88.2953L283.844 142.209C282.429 143.016 280.692 143.007 279.284 142.187L186.755 88.2733C183.751 86.5229 183.726 82.1913 186.71 80.4069L279.24 25.074C280.67 24.219 282.451 24.2102 283.889 25.0509Z"
                fill="#9F903B"
              />
              <path
                d="M283.889 1.70858L378.538 57.0412C381.574 58.8161 381.549 63.2123 378.494 64.953L283.844 118.867C282.429 119.673 280.692 119.665 279.284 118.845L186.755 64.9309C183.751 63.1805 183.726 58.849 186.71 57.0646L279.24 1.73164C280.67 0.876734 282.451 0.867896 283.889 1.70858Z"
                fill="url(#paint0_radial_12_17)"
              />
              <path
                opacity="0.6"
                className="path"
                d="M257.906 111.855L151.397 183.311"
                stroke="#80732F"
                stroke-width="4"
                stroke-linecap="round"
                stroke-dasharray="6.76 6.76"
              />
              <path
                d="M103.82 169.797L198.469 225.129C201.505 226.904 201.48 231.3 198.424 233.041L103.775 286.955C102.36 287.761 100.622 287.753 99.215 286.933L6.68538 233.019C3.68126 231.269 3.65663 226.937 6.64066 225.153L99.1708 169.82C100.6 168.965 102.382 168.956 103.82 169.797Z"
                fill="#9F903B"
              />
              <path
                d="M103.82 146.454L198.469 201.787C201.505 203.562 201.48 207.958 198.424 209.699L103.775 263.613C102.36 264.419 100.622 264.41 99.215 263.59L6.68538 209.677C3.68126 207.926 3.65663 203.595 6.64066 201.81L99.1708 146.477C100.6 145.622 102.382 145.614 103.82 146.454Z"
                fill="url(#paint1_radial_12_17)"
              />{" "}
              <path
                className="path2"
                opacity="0.6"
                d="M299.407 111.855L406.867 187.775"
                stroke="#80732F"
                stroke-width="4"
                stroke-linecap="round"
                stroke-dasharray="6.76 6.76"
              />
              <path
                d="M458.18 169.797L363.531 225.129C360.495 226.904 360.52 231.3 363.576 233.041L458.225 286.955C459.64 287.761 461.378 287.753 462.785 286.933L555.315 233.019C558.319 231.268 558.343 226.937 555.359 225.153L462.829 169.82C461.4 168.965 459.618 168.956 458.18 169.797Z"
                fill="#9F903B"
              />
              <path
                d="M458.18 146.454L363.531 201.787C360.495 203.562 360.52 207.958 363.576 209.698L458.225 263.613C459.64 264.419 461.378 264.41 462.785 263.59L555.315 209.676C558.319 207.926 558.343 203.594 555.359 201.81L462.829 146.477C461.4 145.622 459.618 145.613 458.18 146.454Z"
                fill="url(#paint2_radial_12_17)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_12_17"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(282.72 60.2576) rotate(90) scale(59.912 102.651)"
                >
                  <stop offset="0.0604165" stop-color="#F7F1FE" />
                  <stop offset="1" stop-color="#EBC28E" />
                </radialGradient>
                <radialGradient
                  id="paint1_radial_12_17"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(102.651 205.003) rotate(90) scale(59.912 102.651)"
                >
                  <stop offset="0.0604165" stop-color="#F7F1FE" />
                  <stop offset="1" stop-color="#EBC28E" />
                </radialGradient>
                <radialGradient
                  id="paint2_radial_12_17"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(459.349 205.003) rotate(90) scale(59.912 102.651)"
                >
                  <stop offset="0.0604165" stop-color="#F7F1FE" />
                  <stop offset="1" stop-color="#EBC28E" />
                </radialGradient>
              </defs>
            </svg>

            <Image
              src="/scroll.svg"
              width={105}
              height={109}
              className="absolute left-8 bottom-4 xl:left-12 xl:bottom-12 animate-bounce duration-[5000ms] "
              alt="scroll"
            />

            <Image
              src="/ethereum.svg"
              width={80}
              height={80}
              className="absolute right-[2.5rem] xl:right-[3.8rem] top-[50%] animate-bounce duration-[5000ms] "
              alt="ethereum"
            />

            <Image
              src="/block.svg"
              width={107}
              height={108}
              className="absolute -top-[3.5rem] left-[39%] xl:-top-6 xl:left-[41%] animate-bounce duration-[5000ms] "
              alt="block"
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
