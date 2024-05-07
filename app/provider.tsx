"use client"
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ServicesRepoContextProvider } from "@/contexts/services.repo.context";
import { AppDataContextProvider } from "@/contexts/data.context";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <ServicesRepoContextProvider>
        <AppDataContextProvider>
          {children}
        </AppDataContextProvider>
      </ServicesRepoContextProvider>
    </NextUIProvider>
  )
}