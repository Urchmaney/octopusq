"use client"
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { NodeRepoContextProvider } from "@/contexts/node.repo.context";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <NodeRepoContextProvider>
        {children}
      </NodeRepoContextProvider>
    </NextUIProvider>
  )
}