"use client";
import { decodeHtmlWithHe } from "@/lib/sanititzeHtml";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import type SunEditorCore from "suneditor/src/lib/core";
import { Style } from "./style";

interface SunEditorOptions {
  buttonList?: string[][];
  showPathLabel?: boolean;
  minHeight?: string;
  defaultStyle?: string;
  placeholder?: string;
  [key: string]: any;
}

interface RichTextEditorProps {
  id?: string;
  value?: string;
  label?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: string;
  fontSize?: string;
  customOptions?: Partial<SunEditorOptions>;
  errorMsg?: string;
}

export const RichTextInput: React.FC<RichTextEditorProps> = ({
  id,
  label,
  value = "",
  onChange,
  placeholder = "Type here...",
  height = "300px",
  fontSize = "14px",
  customOptions = {},
  errorMsg,
}) => {
  const editorRef = useRef<SunEditorCore | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const decodedValue = useMemo(() => {
    return value ? decodeHtmlWithHe(value) : "";
  }, [value]);

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editorRef.current = sunEditor;
    setIsEditorReady(true);

    if (placeholder) {
      sunEditor.setOptions({ placeholder });
    }
  };
  // Handle external value changes (like when editing existing blog)
  useEffect(() => {
    if (isEditorReady && editorRef.current && !hasInitialized && decodedValue) {
      // Only set content once during initialization
      editorRef.current.setContents(decodedValue);
      setHasInitialized(true);
    }
  }, [isEditorReady, decodedValue, hasInitialized]);
  // Reset initialization flag when value is cleared externally
  useEffect(() => {
    if (!value) {
      setHasInitialized(false);
    }
  }, [value]);

  const defaultOptions: SunEditorOptions = {
    buttonList: [
      ["fontSize"],
      ["bold", "italic", "underline", "strike"],
      ["fontColor", "hiliteColor"],
      ["list", "align"],
      ["link", "image"],
    ],
    showPathLabel: false,
    minHeight: height,
    defaultStyle: `font-family: 'Inter', 'system-ui', sans-serif; font-size: ${fontSize};`,
    placeholder,
  };

  const editorOptions: SunEditorOptions = {
    ...defaultOptions,
    ...customOptions,
  };

  const handleChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const onOpenFullScreen = () => {
    setIsFullScreen(true);
  };
  const onCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      <Style />
      {isFullScreen ? (
        <></>
      ) : (
        // <Modal
        //   isOpen={isFullScreen}
        //   onClose={onCloseFullScreen}
        //   className="fixed inset-0 z-100 bg-white flex flex-col p-2"
        // >
        //   <ModalHeader
        //     title="Rich Text Full Screen"
        //     variant="with-title"
        //     onClose={onCloseFullScreen}
        //   />

        //   <div className="flex-1 max-h-screen overflow-y-auto">
        //     <SunEditor
        //       key="fullscreen-editor"
        //       getSunEditorInstance={getSunEditorInstance}
        //       setOptions={{ ...editorOptions, height: "100%" }}
        //       setContents={decodedValue}
        //       onChange={handleChange}
        //       placeholder={placeholder}
        //     />
        //   </div>
        // </Modal>
        <div className="sun-editor-container">
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}

          <div className="my-2" />

          <SunEditor
            key="normal-editor"
            getSunEditorInstance={getSunEditorInstance}
            setOptions={editorOptions}
            onChange={handleChange}
            setContents={decodedValue}
            placeholder={placeholder}
          />

          <div className="flex justify-end my-2">
            {/* <Button variant="secondary" onClick={onOpenFullScreen}>
              Full Screen
            </Button> */}
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        </div>
      )}
    </>
  );
};
