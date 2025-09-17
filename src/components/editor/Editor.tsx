import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController } from "@blocknote/react";
import { insertCementItem } from "./commands";
import { useEffect, useMemo, useState } from "react";
import { DocumentEditor } from "./documentEditor";
import { Card, CardContent, CardHeader, CardTitle } from "../card/Card";
import { CircleChevronLeft, CircleChevronRight, Loader2, Star } from "lucide-react";
import "@blocknote/mantine/style.css";
import { useActiveDocument } from "../../contexts/activeDocumentContext";
import Path from "../path/Path";
import { TDocument } from "../../services/documentApi";


const getCustomSlashMenuItems = (
  editor: BlockNoteEditor,
  documentId: string
): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertCementItem(editor, documentId),
  ];

export function Editor() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const { activeDocument: documentId } = useActiveDocument();
  const [path, setPath] = useState<Array<string>>([]);
  const [isFavorite, setIsFavorite] = useState<boolean | undefined>(undefined);

  const docEditor = useMemo(() => {
    return new DocumentEditor([], "", "")
  }, [])

  useEffect(() => {
    if (documentId) {
      docEditor.changeDocument(documentId);
      if (!docEditor.document) return;
      (docEditor.document as Promise<TDocument>).then(x => {
        setPath(x.parentQuestionIds);
        return docEditor.isDocumentInFavorite(x.id);
      }).then(x => setIsFavorite(x));
    }
  }, [documentId])

  if (!docEditor.blocknoteEditor) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Loading Editor</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading content...</span>
        </CardContent>
      </Card>
    );
  }

  const getQuestionName = async (id: string) => {
    return docEditor.getQuestionName(id);
  }

  const openQuestionDocument = async(questionId: string) => {
    const questionDocId = await docEditor.getQuestionActiveDocumentId(questionId);
    if (!questionDocId) return;
    docEditor.changeDocument(questionDocId);
  }

  const addDocumentToFavorite = async () => {
    setIsFavorite(await docEditor.documentApi.addDocToFavorite(documentId))
  }

  return (
    <div>
      <div className="flex justify-end">
        <Star className="text-black cursor-pointer" fill={isFavorite === undefined ? "none" : isFavorite ? "yellow" : "gray"} onClick={addDocumentToFavorite} />
      </div>
      <Path compact eventIds={path} getEventName={getQuestionName} onClickEvent={openQuestionDocument} />
      <div className="bg-white h-full relative overflow-x-hidden">
        {docEditor.blocknoteEditor && <BlockNoteView editor={docEditor.blocknoteEditor} slashMenu={false}>
          <SuggestionMenuController
            triggerCharacter={"/"}
            // Replaces the default Slash Menu items with our custom ones.
            getItems={async (query) => {
              return filterSuggestionItems(getCustomSlashMenuItems(docEditor.blocknoteEditor as any, documentId), query);
            }
            }
          />
        </BlockNoteView>}

        {!isDrawerOpen &&
          <div
            className="absolute top-0 right-0 text-black"
            onClick={() => setDrawerOpen(true)}
          ><CircleChevronLeft className="cursor-pointer" /></div>
        }
        {<div className={`w-1/2 top-0 right-0 border-2 border-amber-500 absolute h-full bg-white z-10 p-6 transform transition-transform duration-300 ease-in-out
        ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>

          <div className="flex justify-end">
            <button onClick={() => setDrawerOpen(false)}><CircleChevronRight className="text-black cursor-pointer" /></button>
          </div>
          <div>

          </div>
          {docEditor.resultEditor && <BlockNoteView editor={docEditor.resultEditor} slashMenu={false}>
            <SuggestionMenuController
              triggerCharacter={"/"}
              // Replaces the default Slash Menu items with our custom ones.
              getItems={async (query) => {
                return filterSuggestionItems(getCustomSlashMenuItems(docEditor.resultEditor as any, documentId), query);
              }
              }
            />
          </BlockNoteView>}
        </div>
        }
      </div>
    </div>
  );
}
