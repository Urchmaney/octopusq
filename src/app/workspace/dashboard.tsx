import { FileText } from "lucide-react";
import { useActiveDocument } from "../../contexts/activeDocumentContext";
import { useLoaderData, useNavigate } from "react-router";
import { TDocument } from "../../services/documentApi";
import { useEffect, useState } from "react";
import { Input } from "../../components/input/Input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/dialog/Dialog";
import { useFetcherSumbit, useWorkspaceContext } from "../../hooks";

export function Dashboard() {
  const data = useLoaderData() as { favorites: TDocument[] };

  const { favorites: files } = data;

  const { setActiveDocument, setActiveDocumentName } = useActiveDocument();
  const { setActiveWorkspace } = useWorkspaceContext()
  const navigate = useNavigate();
  const { activeWorkspace, allWorkspaces: workspaces } = useWorkspaceContext()

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(activeWorkspace);
  const [newWorkspaceQuestion, setNewWorkspaceQuestion] = useState("");

  const { fetcher, errors, busy, data: newData } = useFetcherSumbit();


  const openFile = (fileId: string, fileName: string) => {
    if (!fileId) return;
    setActiveDocument(fileId);
    setActiveDocumentName(fileName);
    navigate(`../editor/${fileId}`)
  }

  const openCreateModal = () => {
    setShowCreateModal(true);
  }

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFileName("");
    setNewWorkspaceQuestion("");
  }

  useEffect(() => {
    if (newData && !busy) {
      setShowCreateModal(false);
      setFileName("");
      setNewWorkspaceQuestion("");
      setActiveWorkspace(newData.workspaceId);
      openFile(newData.document.id, newData.document.name);
    }
  }, [newData, busy]);


  if (files === null) return (
    <p>Loading</p>
  )

  // Zero state when there are no favorite files
  if (files.length === 0) {
    return (
      <div className="flex justify-center h-full w-full bg-[#F0F4F8] items-center flex-col p-6 mx-auto space-y-6">
        <img src="/breqq.svg" alt="empty" className="mx-auto w-36 opacity-70" />
        <h2 className="text-2xl font-semibold text-black">No files yet</h2>
        <p className="text-sm text-gray-500">Create your first file to get started.</p>
        <div className="max-w-xs mx-auto">
          <button onClick={openCreateModal} className="inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-16 px-4 w-64 bg-[#1a4b53] py-6 text-white hover:bg-[#15393f]">
            Create file
          </button>
        </div>

        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-white border-gray-200 max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Create file</DialogTitle>
              <DialogDescription className="text-gray-600">
                Add a new File
              </DialogDescription>
            </DialogHeader>

            {
              errors && errors.length > 0 && (
                <ul className="mt-3 list-disc px-2">
                  {
                    errors?.map((x, i) => (
                      <li key={`create_file_error_${i}`} className="text-red-500 text-sm">{x}</li>
                    ))
                  }
                </ul>
              )
            }
            <fetcher.Form className="space-y-4" action="/dashboard" method="post">
              <div className="flex flex-col justify-start text-black">
                <label className="text-sm text-gray-600">File name</label>
                <Input value={fileName} name="file_name" onChange={(e) => setFileName(e.target.value)} placeholder="Document Name" required />
              </div>

              <div className="block">
                <label className="text-sm text-gray-600 mb-2">Workspace</label>
                <Select name="workspace_id" value={selectedWorkspace} onValueChange={(value) => setSelectedWorkspace(value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    {workspaces.map((w) => (
                      <SelectItem className="hover:bg-gray" key={w.id} value={w.id}>{w.content}</SelectItem>
                    ))}
                    <SelectItem value="__create_new__">Create new workspace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedWorkspace === "__create_new__" && (
                <label className="block">
                  <div className="text-sm text-gray-600">Workspace question</div>
                  <Input name="workspace_name" className="text-black" value={newWorkspaceQuestion} onChange={(e) => setNewWorkspaceQuestion(e.target.value)} placeholder="Describe the workspace question" />
                </label>
              )}

              <div className="flex items-center gap-3">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer">{busy ? 'Creating' : 'Create'}</button>
                <button type="button" onClick={closeCreateModal} className="px-4 py-2 bg-gray-500 rounded-md cursor-pointer">Cancel</button>
              </div>
            </fetcher.Form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6 max-w-sm mx-auto">
      {files.map((file, index) => (
        <div
          key={index}
          className="p-4 border rounded-2xl shadow-sm bg-white flex items-center justify-between relative group cursor-pointer"
          onClick={() => openFile(file.id, file.name)}
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
