"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";

export type ImageFileItem = {
  id: string;
  file?: File;
  previewUrl: string;
};

type BaseProps = {
  label?: string;
  id?: string;
  errorMsg?: string;
  maxFiles?: number;
};

type SingleProps = BaseProps & {
  type: "single";
  onChange: (file: File | null) => void;
  initialUrl?: string | null;
};

type MultipleProps = BaseProps & {
  type: "multiple";
  onChange: (files: File[]) => void;
  initialUrls?: string[];
};

export type ImagePickerProps = SingleProps | MultipleProps;

export const ImagePicker: React.FC<ImagePickerProps> = (props) => {
  const { type, label, id, errorMsg } = props;
  const maxFiles = type === "single" ? 1 : (props.maxFiles ?? 5);

  // Track initial values as a string key to prevent array-reference re-render loops
  const initialSyncKey =
    type === "single"
      ? (props.initialUrl ?? "")
      : (props.initialUrls ?? []).join(",");

  const [items, setItems] = useState<ImageFileItem[]>(() => {
    if (type === "single" && props.initialUrl) {
      return [{ id: props.initialUrl, previewUrl: props.initialUrl }];
    }
    if (type === "multiple" && props.initialUrls) {
      return props.initialUrls.map((url) => ({ id: url, previewUrl: url }));
    }
    return [];
  });

  // Keep a ref of items to reliably revoke on unmount or replace
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Sync when initial URLs actually change from parent
  useEffect(() => {
    if (type === "single") {
      setItems(
        props.initialUrl
          ? [{ id: props.initialUrl, previewUrl: props.initialUrl }]
          : []
      );
    } else {
      setItems(
        (props.initialUrls || []).map((url) => ({ id: url, previewUrl: url }))
      );
    }
  }, [type, initialSyncKey]);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  const notifyChange = useCallback(
    (currentItems: ImageFileItem[]) => {
      if (type === "single") {
        const file = currentItems[0]?.file ?? null;
        props.onChange(file);
      } else {
        const files = currentItems
          .map((item) => item.file)
          .filter((file): file is File => Boolean(file));
        props.onChange(files);
      }
    },
    [type, props]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: ImageFileItem[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      let updated: ImageFileItem[];
      if (type === "single") {
        if (items[0]?.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(items[0].previewUrl);
        }
        updated = newItems.slice(0, 1);
      } else {
        updated = [...items, ...newItems].slice(0, maxFiles);
      }

      setItems(updated);
      notifyChange(updated);
    },
    [items, maxFiles, notifyChange, type]
  );

  const handleDelete = (idToRemove: string) => {
    const itemToRemove = items.find((item) => item.id === idToRemove);
    if (itemToRemove?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    }

    const updated = items.filter((item) => item.id !== idToRemove);
    setItems(updated);
    notifyChange(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: type === "multiple",
    maxFiles: maxFiles - items.length,
    disabled: items.length >= maxFiles,
  });

  const isFull = items.length >= maxFiles;

  return (
    <div className="space-y-3">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative flex flex-col items-center justify-center border p-2 rounded-md shadow-sm border-gray-200 bg-white"
            >
              <Image
                src={item.previewUrl}
                alt={`Image preview ${index + 1}`}
                width={96}
                height={96}
                unoptimized={item.previewUrl.startsWith("blob:")}
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow transition-colors"
                onClick={() => handleDelete(item.id)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!isFull && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 text-center cursor-pointer rounded-md transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} id={id} />
          <p className="text-sm text-gray-600">
            {type === "single"
              ? "Drag & drop an image, or click to browse"
              : `Drag & drop up to ${maxFiles} images (${items.length}/${maxFiles})`}
          </p>
        </div>
      )}

      {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
    </div>
  );
};
