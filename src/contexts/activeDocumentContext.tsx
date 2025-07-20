import { createContext, useContext, useState } from "react";

const ActiveDocumentContext = createContext<{ activeDocument: string, setActiveDocument: (doc: string) => void }>({ activeDocument: "", setActiveDocument: () => { } });

export function ActiveDocumentProvider({ children, defaultDocument }: React.PropsWithChildren<{defaultDocument?: string}>) {
  const [activeDocument, setActiveDocument] = useState<string>(defaultDocument || "");
  return <ActiveDocumentContext.Provider value={{ activeDocument, setActiveDocument }}>
    {children}
  </ActiveDocumentContext.Provider>
}


export const useActiveDocument = () => useContext(ActiveDocumentContext);