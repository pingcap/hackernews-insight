import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

export interface AceEditorComponentProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function AceEditorComponent(props: AceEditorComponentProps) {
  const { value, onChange } = props;

  return (
    <AceEditor
      mode="mysql"
      theme="github"
      name="ace-editor"
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={value}
      onChange={onChange}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}
