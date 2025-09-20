import { useParams } from "react-router";
import { Editor } from "../../components";

export function EditorPage() {
   const { docId } = useParams();
  return (
    <div className="bg-white h-full">
      <Editor docId={docId} />
    </div>
  );
}