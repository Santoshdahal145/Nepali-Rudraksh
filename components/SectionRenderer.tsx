"use client";

import Image from "next/image";
import { prepareSafeHtml } from "@/lib/sanititzeHtml";
import { SingleSectionType } from "@/app/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionRendererProps {
  section: SingleSectionType;
}

export const SectionRenderer = ({ section }: SectionRendererProps) => {
  const renderSection = () => {
    switch (section.type) {
      case "INFO_BLOCK":
        return (
          <Card className="w-full bg-transparent border-transparent">
            <CardHeader>
              {section.title && (
                <CardTitle className="text-gray-300">{section.title}</CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {section.description && (
                <p className="text-base text-muted-foreground whitespace-pre-wrap">
                  {section.description}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case "IMAGE_BLOCK":
        return (
          <div className="w-full flex justify-center">
            {section.image && typeof section.image === "string" && (
              <div className="relative w-full max-w-2xl h-96 rounded-lg overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title || "Section image"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        );

      case "LINK_BLOCK":
        return (
          <Card className="w-full bg-transparent border-transparent">
            <CardHeader>
              {section.title && (
                <CardTitle className="text-gray-300">{section.title}</CardTitle>
              )}
              {section.description && (
                <CardDescription>{section.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {section.link && (
                <a
                  href={section.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Visit Link
                </a>
              )}
            </CardContent>
          </Card>
        );

      case "HTML_BLOCK":
        return (
          <div
            className="w-full prose prose-sm max-w-full dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: section.html ? prepareSafeHtml(section.html) : "",
            }}
          />
        );

      default:
        return null;
    }
  };

  return <div className="w-full">{renderSection()}</div>;
};
