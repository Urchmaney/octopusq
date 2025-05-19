import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { Alert } from "./alert";

export const schema = BlockNoteSchema.create({
    blockSpecs: {
      // Adds all default blocks.
      ...defaultBlockSpecs,
      // Adds the Alert block.
      alert: Alert,
    },
  });