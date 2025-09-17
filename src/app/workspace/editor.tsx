import { Editor } from "../../components";
import { ActiveDocumentProvider } from "../../contexts/activeDocumentContext";

export function EditorPage() {
  return (
   
      <div className="bg-white h-full">
        <Editor />
      </div>
 
  );
}