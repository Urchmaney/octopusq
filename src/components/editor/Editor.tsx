import { BlockNoteEditor, filterSuggestionItems, InlineContentSchema, StyleSchema } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController } from "@blocknote/react";
import { insertCementItem, schema } from "../../blocknotes";
import { useEffect, useState } from "react";
import { firebaseDocumentAPI, TDocument } from "../../services/documentApi";
import { DocumentEditor } from "../../editor";
import { Card, CardContent, CardHeader, CardTitle } from "../card/Card";
import { Loader2 } from "lucide-react";
import "@blocknote/mantine/style.css";

const getCustomSlashMenuItems = (
  editor: BlockNoteEditor<typeof schema.blockSchema, InlineContentSchema, StyleSchema>,
): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertCementItem(editor),
  ];


export function Editor({ documentId }:{ documentId: string }) {
  const [loading, setLoading] = useState(false);
  const [docEditor, setDocEditor] = useState<DocumentEditor | null>(null);
  const [_, setDocument] = useState<TDocument | null>(null);

  useEffect(() => {
    setLoading(true)
    firebaseDocumentAPI.getDocument(documentId).then(x => {
      setDocument(x);
      let initialContent = JSON.parse(x?.content || "[]");
      if (!Array.isArray(initialContent) || initialContent.length === 0) initialContent = [{ type: "paragraph", content: '' }];
      setDocEditor(new DocumentEditor(initialContent, x?.id || ""));
      setLoading(false);
    })
  }, [documentId]);

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
            filterSuggestionItems(getCustomSlashMenuItems(docEditor.blocknoteEditor as any), query)
          }
        />
      </BlockNoteView>}
    </div>

  );
}