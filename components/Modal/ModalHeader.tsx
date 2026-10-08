"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalHeaderProps {
  title?: string;
  variant?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function ModalHeader({
  title,
  onClose,
  children,
}: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3 mb-2 px-2">
      {title ? (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      ) : (
        children
      )}
      {onClose && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  );
}
