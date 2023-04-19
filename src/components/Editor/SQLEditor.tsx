import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';

export interface AceEditorComponentProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function AceEditorComponent(props: AceEditorComponentProps) {
  const { value, onChange } = props;

  return (
    <AceEditor
      mode="mysql"
      theme="xcode"
      name="ace-editor"
      fontSize={14}
      showPrintMargin={true}
      showGutter={false}
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
      // onLoad={(editorInstance) => {
      //   editorInstance.container.style.resize = 'both';
      //   // mouseup = css resize end
      //   document.addEventListener('mouseup', (e) => editorInstance.resize());
      // }}
      height="100%"
      width="100%"
    />
  );
}
