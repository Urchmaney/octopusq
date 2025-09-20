import { FileText } from "lucide-react";
import { useActiveDocument } from "../../contexts/activeDocumentContext";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { firebaseDocumentAPI, TDocument } from "../../services/documentApi";

export function Dashboard() {
  const [files, setFiles] = useState<TDocument[] | null>(null);

  useEffect(() => {
    firebaseDocumentAPI.getFavoriteDocs().then(x => {
      setFiles(x);
    })
  }, [])

  const { setActiveDocument } = useActiveDocument();
  const navigate = useNavigate();

  const openFile = (fileId: string) => {
    if(!fileId) return;
    setActiveDocument(fileId);
    navigate("../editor")
  }

  if(files === null) return (
    <p>Loading</p>
  )

  return (
    <div className="space-y-4 p-6 max-w-sm mx-auto">
      {files.map((file, index) => (
        <div
          key={index}
          className="p-4 border rounded-2xl shadow-sm bg-white flex items-center justify-between relative group cursor-pointer"
          onClick={() => openFile(file.id)}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-gray-500" />
            <span className="font-medium text-gray-800">{file.name}</span>
          </div>


          <div className="absolute right-0 mt-2 hidden group-hover:block z-10">
            <div className="px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg whitespace-nowrap">
              {file.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
