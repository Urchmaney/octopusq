import { BlockNoteEditor } from "@blocknote/core";
import { createCementKey } from "../schema/cement";
import { Link } from "lucide-react";

export const insertCementItem =
  (editor: BlockNoteEditor,
    documentId: string
  ) => ({
    title: "Cement",
    onItemClick: () => {
      return editor.transact((tr) => {
        tr.setMeta(createCementKey, documentId);
      })
    },
    group: "Question",
    key: "cement_01",
    aliases: [],
    icon: <Link size={18} />,
    subtext: "Insert a block with for cement.",
  });