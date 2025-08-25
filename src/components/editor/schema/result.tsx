import { createReactBlockSpec } from "@blocknote/react";

export const AbsoluteBlock = createReactBlockSpec({
  type: "absoluteBlock",
  propSchema: {},
  content: "inline"

}, {
  render: ({ contentRef }) => {
    return (
      <div
        // contentEditable={false}
        style={{
          position: "sticky",
          bottom: "0", // adjust as needed
          left: "100px", // adjust as needed
          background: "white",
          padding: "10px",
          border: "1px solid #ccc",
          zIndex: 10,
        }}
      >
        <div ref={contentRef}></div>
      </div>
    );
  },
});