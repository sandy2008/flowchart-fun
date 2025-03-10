import React, { useContext, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import Layout from "./Layout";
import { AppContext } from "./AppContext";
import UnmountDeclare from "./UnmountDeclare";

function ReadOnly() {
  const { graphText } = useParams<{ graphText: string }>();
  const textToParse = decodeURIComponent(graphText);
  const [hoverLineNumber, setHoverLineNumber] = useState<undefined | number>();
  const editorRef = useRef(null);
  const decorations = useRef<any[]>([]);
  const { setIsReady } = useContext(AppContext);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      if (typeof hoverLineNumber === "number") {
        //@ts-ignore
        decorations.current = editor.deltaDecorations(
          [],
          [
            {
              range: {
                startLineNumber: hoverLineNumber,
                startColumn: 1,
                endLineNumber: hoverLineNumber,
                endColumn: 1,
              },
              options: {
                isWholeLine: true,
                className: "node-hover",
              },
            },
          ]
        );
      } else {
        // @ts-ignore
        decorations.current = editor.deltaDecorations(decorations.current, []);
      }
    }
  }, [hoverLineNumber]);

  return (
    <Layout setHoverLineNumber={setHoverLineNumber} textToParse={textToParse}>
      <Editor
        defaultValue={textToParse}
        value={textToParse}
        loading={<UnmountDeclare />}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          tabSize: 2,
          insertSpaces: true,
          wordBasedSuggestions: false,
          occurrencesHighlight: false,
          renderLineHighlight: false,
          highlightActiveIndentGuide: false,
          scrollBeyondLastLine: false,
          renderIndentGuides: false,
          overviewRulerBorder: false,
          lineDecorationsWidth: "10px",
          renderValidationDecorations: "off",
          hideCursorInOverviewRuler: true,
          matchBrackets: "never",
          selectionHighlight: false,
          lineHeight: 28,
          // model: null,
          readOnly: true,
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          setIsReady();
        }}
      />
    </Layout>
  );
}

export default ReadOnly;
