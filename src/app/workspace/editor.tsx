import { Editor } from "../../components";
import { ActiveDocumentProvider } from "../../contexts/activeDocumentContext";

export function EditorPage() {
  return (
    <ActiveDocumentProvider defaultDocument="j3EWkSF9id8APitwH9Hi">
      <div className="bg-white h-full">
        <Editor />
      </div>
    </ActiveDocumentProvider>
  );
}