"use client"
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { NodeRepoContextProvider } from "@/contexts/node.repo.context";
import { ServicesRepoContextProvider } from "@/contexts/services.repo.context";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <ServicesRepoContextProvider>
        <NodeRepoContextProvider>
          {children}
        </NodeRepoContextProvider>
      </ServicesRepoContextProvider>
    </NextUIProvider>
  )
}