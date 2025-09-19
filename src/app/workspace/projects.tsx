import { useLoaderData, useNavigate } from "react-router";
import { Question, TDocument } from "../../services/documentApi";
import { FileText, Loader2, Plus } from "lucide-react";
import { useActiveDocument } from "../../contexts/activeDocumentContext";
import { Input } from "../../components";
import { useFetcherSumbit } from "../../hooks";
import { useEffect, useState } from "react";

export function Projects() {

  const data = useLoaderData() as { question: Question | null, documents: TDocument[] };
  const { setActiveDocument } = useActiveDocument();
  const { fetcher, busy, data: fetcherData } = useFetcherSumbit();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");

  const openFile = (fileId: string) => {
    if (!fileId) return;
    setActiveDocument(fileId);
    navigate("./editor")
  }

  useEffect(() => {
    if(fetcherData && !busy) setFileName('');
  }, [fetcherData, busy])

  if (!data.question) return (
    <div>Project Not found</div>
  )
  return (
    <div>
      <div className="text-2xl text-black"><span className="text-sm">Projects:</span> {data.question.content}</div>
      <div>
        <fetcher.Form method="POST">
          <div className="text-black flex justify-end items-center gap-3">
            { busy && <Loader2 className="animate-spin" /> }
            <input type="hidden" name="question" value={data.question.id} />
            <Input
              name="file_name"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File name"
              className="border-0 border-b max-w-50 border-gray bg-white px-0 py-2"
            />
            <button type="submit" className="cursor-pointer flex">Add <Plus /></button>
          </div>
        </fetcher.Form>
        <div className="space-y-4 p-6 max-w-sm mx-auto">
          {data.documents.map((file, index) => (
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
      </div>
    </div>
  );
}
