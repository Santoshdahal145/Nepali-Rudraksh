import React from "react";

export const Style = () => {
  return (
    <style jsx global>{`
      .sun-editor {
        border: 1px solid #d1d5db !important;
        border-radius: 0.375rem !important;
      }

      .sun-editor:focus-within {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
      }

      .sun-editor .se-wrapper {
        border-radius: 0.375rem !important;
      }

      .sun-editor .se-toolbar {
        border-bottom: 1px solid #e5e7eb !important;
        background-color: #f9fafb !important;
      }
      .sun-editor .se-dialog .se-dialog-inner .se-dialog-content {
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        box-shadow: 0 3px 9px rgba(0, 0, 0, 0.2);
        color: #111827;
      }
      .sun-editor .se-resizing-bar {
        display: none !important;
      }

      html.dark .sun-editor {
        border-color: #4b5563 !important;
        background-color: #1f2937 !important;
        color: #f3f4f6 !important;
      }
      html.dark .sun-editor button:hover {
        background-color: #1f2937 !important;
        color: #f3f4f6 !important;
      }

      html.dark .sun-editor .se-wrapper,
      html.dark .sun-editor-editable {
        background-color: #1f2937 !important;
        color: #f3f4f6 !important;
      }

      html.dark .sun-editor .se-toolbar {
        background-color: #374151 !important;
        border-bottom: 1px solid #4b5563 !important;
      }

      html.dark .sun-editor button {
        color: #f3f4f6 !important;
      }
      html.dark .sun-editor .se-dialog .se-dialog-inner .se-dialog-content {
        background-color: #1f2937; /* dark gray */
        border: 1px solid #374151;
        box-shadow: 0 3px 9px rgba(0, 0, 0, 0.8);
        color: #f9fafb; /* light text */
      }
      html.dark .sun-editor input,
      html.dark .sun-editor textarea {
        background-color: #374151;
        color: #f9fafb;
        border-color: #4b5563;
      }
      html.dark .sun-editor .se-dialog button,
      html.dark .sun-editor .se-dialog input,
      html.dark .sun-editor .se-dialog label {
        color: #f9fafb;
        background-color: transparent; /* dark background */
      }
      html.dark .sun-editor .se-list-layer {
        background-color: #1f2937 !important; /* dark gray background */
        border-color: #374151 !important; /* darker border */
        color: #f3f4f6 !important; /* light text */
        box-shadow: 0 3px 9px rgba(0, 0, 0, 0.6) !important;
      }
      html.dark .sun-editor .se-btn-module-border {
        border-color: #4b5563 !important;
      }
      html.dark .sun-editor .se-submenu .se-form-group .se-color-input {
        color: #fff;
      }
      html.dark .sun-editor .se-btn-list.default_value {
        background-color: #b1b1b1;
      }
      html.dark .sun-editor .se-dialog .se-dialog-inner .se-link-preview {
        color: #b1b1b1;
      }
    `}</style>
  );
};
