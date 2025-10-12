import { createContext, useContext } from "react";

export const ActiveDocumentContext = createContext<
{ activeDocument: string, setActiveDocument: (doc: string) => void, activeDocumentName: string, setActiveDocumentName: (name: string) => void }
>({ activeDocument: "", setActiveDocument: () => { }, activeDocumentName: "", setActiveDocumentName: () => { } });

export const useActiveDocument = () => useContext(ActiveDocumentContext);