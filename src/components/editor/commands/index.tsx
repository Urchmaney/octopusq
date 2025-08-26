import { BlockNoteEditor, InlineContentSchema, StyleSchema } from "@blocknote/core";
import { schema } from "../schema";
import { createCementKey } from "../schema/cement";
import { Link } from "lucide-react";

export const insertCementItem =
  (editor: BlockNoteEditor<typeof schema.blockSchema, InlineContentSchema, StyleSchema>,
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