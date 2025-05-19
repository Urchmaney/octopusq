import { defaultProps, createBlockSpecFromStronglyTypedTiptapNode, fileBlockConfig } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Node, NodeConfig } from "@tiptap/core";


export const Alert = createReactBlockSpec(
  {
    type: 'cement',
    propSchema: {
      name: {
        default: []
      }

    },
    content: "none"
  },
  {
    render: (props) => {

    }
  }
)

fileBlockConfig

export const Cement = createBlockSpecFromStronglyTypedTiptapNode(
  new Node(),
  {

  }
)