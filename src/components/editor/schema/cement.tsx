import { removeAndInsertBlocks, createBlockSpecFromStronglyTypedTiptapNode, defaultProps, getBlockInfo, getBlockInfoFromSelection, getNearestBlockPos, nodeToBlock, updateBlockCommand } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { MdAdd, MdArrowDropDown, MdCancel, MdFilePresent } from "react-icons/md";
import { Question, TDocument } from "../../../services/documentApi";
import { Input, SecondaryButton } from "../../../components";
import { FormEventHandler, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useActiveDocument } from "../../../contexts/activeDocumentContext";
import { DocumentEditor } from "../documentEditor";

// import "./styles.css";

export const createCementKey = new PluginKey("createCementKey");


export const cementSpec = (docEditor: DocumentEditor) => createReactBlockSpec(
  {
    type: "cement",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      question: {
        default: "",
      },

      questionId: {
        default: ""
      },
      show: {
        default: false
      },
      documentId: {
        default: "",
      }
    },
    content: "none",
    isSelectable: false
  },
  {
    render: (props) => {
      const [fwdDocs, setFwdDocs] = useState<TDocument[]>([]);
      const [fetchedDocs, setFetchedDocs] = useState(false);
      const [creatingDoc, setCreatingDoc] = useState(false);
      const [question, setQuestion] = useState<Question | null>(null);

      useEffect(() => {
        const fetchQuestionAndAnswer = async () => {
          const question = await docEditor.documentApi.getQuestion(props.block.props.questionId);
          setQuestion(question);
          if (!question?.activeFwdDocumentId) return;
          const activeDoc = await docEditor.documentApi.getDocument(question.activeFwdDocumentId);

          if (!activeDoc?.resultId) return;
          const resultContent = (await docEditor.documentApi.getDocumentResult(activeDoc.resultId))?.content || "[]";
          const resultBlocks = props.editor.insertBlocks(docEditor.convertBlocksToNonEditableVersion(JSON.parse(resultContent)) as any, props.block.id, 'after');
          docEditor.addExcludedBlocksId(...resultBlocks.map(x => x.id))
        }
        fetchQuestionAndAnswer()
      }, [])

      const { setActiveDocument: setActiveDocumentId } = useActiveDocument();
      const toggleCement = () => {
        const show = props.block.props.show;
        props.editor.updateBlock(props.block.id, { props: { show: !show } } as any);
      }

      const fetchFwdDocs = async () => {
        if (fetchedDocs) return;
        const docs = await docEditor.documentApi.getQuestionDocuments(props.block.props.questionId);
        setFwdDocs(docs);
        setFetchedDocs(true);
      };

      const openDocument = (documentId: string) => {
        const document = fwdDocs.find(x => x.id === documentId);
        if (!document) return;

        setActiveDocumentId(document.id);
      }

      const activateDocument = async (documentId: string) => {
        const document = fwdDocs.find(x => x.id === documentId);
        if (!document) return;

        await docEditor.documentApi.setQuestionActiveDocument(props.block.props.questionId, document)
      }

      const createNewFwdDoc: FormEventHandler<HTMLFormElement> = async (event) => {
        try {
          event.preventDefault();
          setCreatingDoc(true);
          const form = event.target as HTMLFormElement;
          const formData = new FormData(form);
          const doc = await docEditor.documentApi.createNewDoc(formData.get("docName")?.toString() || "Untitled", props.block.props.questionId);
          setFwdDocs([doc, ...fwdDocs]);
          form.reset();
        } catch (err) {
          throw err
        } finally {
          setCreatingDoc(false);
        }
      }
      return (
        <div className={"cement relative py-2"}>
          <div>
            {
              props.block.props.show ?
                <div className="flex items-center gap-2 z-20">
                  <Menu withinPortal={false} onOpen={fetchFwdDocs}>
                    <Menu.Target>
                      <div className={"border border-gray-400 inline-block px-4 text-[13px] rounded-b-2xl rounded-t-md cursor-pointer"} contentEditable={false}>
                        <p className="flex items-center gap-5">{props.block.props.question} <MdArrowDropDown className="text-lg" /></p>
                      </div>
                    </Menu.Target>
                    <Menu.Dropdown className="w-full">
                      <Menu.Label className="">
                        <form className="flex justify-center items-center gap-1" onSubmit={createNewFwdDoc}>
                          <Input name="docName" placeholder="Document Name" className="py-4 h-8 focus-visible:ring-offset-0 focus-visible:ring-0"></Input><SecondaryButton className="w-5 h-4 py-4">
                            {creatingDoc ? <Loader2 /> : <MdAdd />}
                          </SecondaryButton>
                        </form>
                      </Menu.Label>
                      <Menu.Divider />
                      {
                        fetchedDocs ? fwdDocs.map((doc) => (
                          <Menu.Item
                            key={doc.id}
                            component="div"
                            leftSection={<MdFilePresent />}
                            closeMenuOnClick={false}
                          >
                            <div className="flex justify-between">
                              <div className="flex gap-1 items-center">
                                {doc.name}
                              </div>

                              <div className="flex gap-2">
                                {
                                  question?.activeFwdDocumentId !== doc.id &&
                                  <Link to="" onClick={() => activateDocument(doc.id)} className="cursor-pointer text-green-300">Activate</Link>
                                }

                                <Link to="" onClick={() => openDocument(doc.id)} className="cursor-pointer">Open</Link>
                              </div>
                            </div>
                          </Menu.Item>
                        )
                        ) :
                          <div className="flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          </div>
                      }
                    </Menu.Dropdown>
                  </Menu>

                  <MdCancel className="cursor-pointer" onClick={toggleCement} />
                </div>
                : <button className="cursor-pointer" onClick={toggleCement}>show</button>
            }
          </div>
          {/* 
          <div>
            <div className={"inline-content"} ref={props.contentRef} />
          </div> */}

        </div >
      );
    },
  },
);


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    cementRules: {
      /**
       * Toggle a cement
       * @example editor.commands.toggleCement()
       */
      toggleCement: () => ReturnType
    }
  }
}

export const cementPlugin = new Plugin({
  state: {
    init() { return true },
    apply(tr, value) {
      if (tr.getMeta(cementPlugin)) {
        return !value;
      }
      return value
    }
  }
})

const specklePlugin: (docEditor: DocumentEditor) => Plugin<DecorationSet> = (docEditor: DocumentEditor) => {
  const plugin: Plugin<DecorationSet> = new Plugin({
    state: {
      init(_, { doc }) {
        return DecorationSet.create(doc, []);
      },
      apply(tr, value, __, newState) {
        let documentId: string;
        if (!(documentId = tr.getMeta(createCementKey))) return value;

        if (documentId === "end") return DecorationSet.create(newState.doc, []);


        return DecorationSet.create(newState.doc, [
          Decoration.widget(tr.selection.anchor, (view, getPos) => {
            const div = document.createElement("div");
            const form = document.createElement("form");

            const input = document.createElement("input");
            const documentInput = document.createElement("input");
            const button = document.createElement("button");
            div.appendChild(documentInput);
            div.appendChild(input)
            div.appendChild(button);
            form.appendChild(div);
            documentInput.setAttribute('type', 'hidden');
            documentInput.value = documentId;
            button.textContent = "submit"
            button.type = "submit";
            input.name = "questionInput"
            input.type = "text";
            input.placeholder = "question";
            input.className = "question-input";
            input.style.padding = "4px";
            input.style.margin = "0 4px";
            input.style.border = "1px solid #ccc";
            input.style.borderRadius = "4px";

            form.addEventListener("submit", (event: SubmitEvent) => {
              event.preventDefault();
              button.textContent = "submitting..."
              docEditor.documentApi.addQuestion(documentInput.value, {
                content: input.value,
                activeFwdDocumentId: "",
                documentId: documentInput.value
              }).then(x => {
                if (!x) return;

                const blockInfo = getBlockInfo(getNearestBlockPos(view.state.doc, getPos()!));

                const block = nodeToBlock(blockInfo.bnBlock.node, view.state.doc.type.schema);
                tr.setMeta(createCementKey, "end");
                removeAndInsertBlocks(tr, [block.id], [
                  {
                    type: "cement",
                    props: {
                      "questionId": x.id,
                      "show": true,
                      "question": x.content
                    } as any
                  }
                ]);
                view.dispatch(tr)
              }).catch((err: any) => console.log("error creating question", err))
            })
            return form;
          },
            {
              side: 0,
              stopEvent(_) {
                return true;
              },
            })
        ])

      }
    },
    props: {
      decorations(state) { return plugin.getState(state) }
    }
  })

  return plugin;
}



export const CementRulesSpec = (docEditor: DocumentEditor) => createBlockSpecFromStronglyTypedTiptapNode(
  Node.create({
    name: "cementRules",
    content: "",
    addCommands() {
      return {
        toggleCement: () => ({ editor }) => {
          const blockInfo = getBlockInfoFromSelection(editor.state);
          if (
            !blockInfo.isBlockContainer ||
            blockInfo.blockContent.node.type.spec.content !== "inline*"
            || blockInfo.blockNoteType !== "cement"
          ) {
            return true;
          }
          const attrs = blockInfo.blockContent.node.attrs;

          return this.editor.commands.command(
            updateBlockCommand(blockInfo.bnBlock.beforePos, {
              props: {
                show: !attrs.show
              } as any
            }),
          );
        }
      }
    },
    addKeyboardShortcuts() {
      return {
        'Ctrl-y': () => {
          try {
            return this.editor.commands.toggleCement();
          } catch (_) {
            return true
          }
        },
      }
    },
    addProseMirrorPlugins() {
      return [cementPlugin, specklePlugin(docEditor)]
    }
  }),
  {}
)
