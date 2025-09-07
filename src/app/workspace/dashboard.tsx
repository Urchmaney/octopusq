import { FileText } from "lucide-react";

export function Dashboard() {
  const files: Array<Record<string, string>> = [
    { name: "report.pdf", path: "/documents/work/report.pdf" },
    { name: "photo.png", path: "/images/vacation/photo.png" },
    { name: "notes.txt", path: "/documents/personal/notes.txt" },
  ]

  return (
    <div className="space-y-4 p-6 max-w-sm mx-auto">
      {files.map((file, index) => (
        <div
          key={index}
          className="p-4 border rounded-2xl shadow-sm bg-white flex items-center justify-between relative group"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-gray-500" />
            <span className="font-medium text-gray-800">{file.name}</span>
          </div>


          <div className="absolute right-0 mt-2 hidden group-hover:block z-10">
            <div className="px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg whitespace-nowrap">
              {file.path}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
