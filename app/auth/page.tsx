import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function Auth() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh gap-4">
      <div>
        <Image
          src="/images/x.svg"
          width={50}
          height={50}
          alt="x Icon"
        />
      </div>
      <div>
        <Button>Login With Twitter</Button>
      </div>

    </div>
  )
}