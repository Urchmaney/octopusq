import { BlockNoteEditor, filterSuggestionItems, InlineContentSchema, StyleSchema } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController } from "@blocknote/react";
import { schema } from "./schema";
import { insertCementItem } from "./commands";
import { useEffect, useMemo, useState } from "react";
import { firebaseDocumentAPI, TDocument } from "../../services/documentApi";
import { DocumentEditor } from "./documentEditor";
import { Card, CardContent, CardHeader, CardTitle } from "../card/Card";
import { CircleChevronLeft, CircleChevronRight, Loader2 } from "lucide-react";
import "@blocknote/mantine/style.css";
import { useActiveDocument } from "../../contexts/activeDocumentContext";


const getCustomSlashMenuItems = (
  editor: BlockNoteEditor<typeof schema.blockSchema, InlineContentSchema, StyleSchema>,
  documentId: string
): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertCementItem(editor, documentId),
  ];

export function Editor() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [document, setDocument] = useState<TDocument | null>(null);

  const { activeDocument: documentId } = useActiveDocument();

  const docEditor = useMemo(() => {
    return new DocumentEditor([], "")
  }, [])


  useEffect(() => {
    firebaseDocumentAPI.getDocument(documentId).then(x => {
      if (!x) return;
      setDocument(x);
    })
  }, [documentId]);

  useEffect(() => {
    if (document) docEditor.changeDocument(document)
  }, [document])

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
  return (
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

      { !isDrawerOpen && 
        <div
          className="absolute top-0 right-0 text-black"
          onClick={() => setDrawerOpen(true)}
        ><CircleChevronLeft /></div>
      }
      {<div className={`w-1/2 top-0 right-0 border-2 border-amber-500 absolute h-full bg-white z-50 p-6 transform transition-transform duration-300 ease-in-out
        ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>

        <div className="flex justify-end">
          <button onClick={() => setDrawerOpen(false)}><CircleChevronRight className="text-black" /></button>
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
  );
}