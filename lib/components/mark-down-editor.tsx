import MDEditor from "@uiw/react-md-editor"

export const  MarkDownEditor = ({ value, changeCb, editMode }: { value: string, changeCb: (val: string | undefined) => void,  editMode: boolean }) => {
  return (
    <div>
      { editMode ? 
      
      <MDEditor
      value={value}
      onChange={changeCb}
      style={{ whiteSpace: 'pre-wrap', height: "100vh", padding: "20px", minHeight: "100vh" }}
    /> : <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap', height: "100vh", padding: "20px" }} /> }
      {/* */}
      
    </div>
  )
}   