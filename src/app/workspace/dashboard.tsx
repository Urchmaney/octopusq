import { BlockNoteView } from "@blocknote/mantine";
import { schema } from "../../blocknotes";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

export function Dashboard() {
  const editor = useCreateBlockNote({
    schema: schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: 'cement',
        content: "this is cement"
      },
      {
        type: "paragraph",
        content: "Click the '!' icon to change the alert type",
      },
       {
        type: 'cement',
        content: "another cement is cement"
      },
      {
        type: "paragraph",
      },
    ],
  }, []);

  return (
    <div className="bg-white h-full">
      <BlockNoteView editor={editor} />
    </div>

  );
}