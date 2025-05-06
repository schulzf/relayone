import {SignIn} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gray-100 flex-col justify-center items-center p-8">
        <div className="max-w-md text-white space-y-8">
          <div className="flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={180}
              height={180}
              className="mb-6"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-center text-black">
            Hello World
          </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-8 bg-white">
        <div className="md:hidden flex justify-center mb-8">
          <Image src="/images/logo.png" alt="Logo" width={120} height={120} />
        </div>

        <div className="flex justify-center">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
