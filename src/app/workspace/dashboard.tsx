import { BlockNoteView } from "@blocknote/mantine";
import { schema } from "../../blocknotes";
import "@blocknote/mantine/style.css";
import { useWorkspaceContext } from "../../hooks";
import { useCreateBlockNote } from "@blocknote/react";


export function Dashboard() {
  const { activeWorkspace } = useWorkspaceContext();
  const editor = useCreateBlockNote({
    schema: schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "alert",
        content: "This is an example alert",
      },
      {
        type: "paragraph",
        content: "Click the '!' icon to change the alert type",
      },
      {
        type: "paragraph",
      },
    ],
  });
  return (
    <div className="bg-white h-full">
      <BlockNoteView editor={editor} />
    </div>

  );
}