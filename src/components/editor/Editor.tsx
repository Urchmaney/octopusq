import { BlockNoteEditor, filterSuggestionItems, InlineContentSchema, StyleSchema } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController } from "@blocknote/react";
import { insertCementItem, schema } from "../../blocknotes";
import { useEffect, useMemo, useState } from "react";
import { firebaseDocumentAPI, TDocument } from "../../services/documentApi";
import { DocumentEditor } from "../../editor";
import { Card, CardContent, CardHeader, CardTitle } from "../card/Card";
import { Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  // const [docEditor, setDocEditor] = useState<DocumentEditor | null>(null);
  const [document, setDocument] = useState<TDocument | null>(null);


  const { activeDocument: documentId } = useActiveDocument();
  const docEditor = useMemo(() => {
    return new DocumentEditor([], "")
  }, [document])

  useEffect(() => {
    firebaseDocumentAPI.getDocument(documentId).then(x => {
      if (!x) return;
      setDocument(x);   
    })
  }, [documentId]);

  useEffect(() => {
    if (document) docEditor.changeDocument(document)
  }, [document])

  if(loading) {
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
    <div className="bg-white h-full">
      {docEditor?.blocknoteEditor && <BlockNoteView editor={docEditor.blocknoteEditor}>
        <SuggestionMenuController
          triggerCharacter={"/"}
          // Replaces the default Slash Menu items with our custom ones.
          getItems={async (query) =>
            filterSuggestionItems(getCustomSlashMenuItems(docEditor.blocknoteEditor as any, documentId), query)
          }
        />
      </BlockNoteView>}
    </div>
  );
}