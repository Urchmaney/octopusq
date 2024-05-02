import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";

export default function Editor({ holder }: { holder: string }) {
  //add a reference to editor
  const ref = useRef<EditorJS>();

  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        autofocus: true,
        placeholder: "Write Here"
      });
      ref.current = editor;
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);


  return <div id={holder} className="min-w-[900px] w-full" />;
};