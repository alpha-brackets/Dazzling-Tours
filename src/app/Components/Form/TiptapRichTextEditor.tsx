"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Image from "@tiptap/extension-image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  FileImage,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

export interface TiptapRichTextEditorProps {
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  className?: string;
  rows?: number;
}

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}

/**
 * A single toolbar button.
 *
 * Declared at module scope rather than inside TiptapRichTextEditor: a component
 * defined during render is a brand-new type on every render, so React unmounts
 * and remounts the whole toolbar instead of updating it. It closes over nothing
 * from the parent, so hoisting is behaviour-preserving.
 */
const MenuButton = ({
  onClick,
  isActive = false,
  children,
  title,
  disabled = false,
}: MenuButtonProps) => (
  <Button
    type="button"
    onClick={onClick}
    variant={isActive ? "default" : "outline"}
    size="sm"
    className={cn(
      "h-8 w-8 p-0",
      isActive && "bg-[#EF7C00] hover:bg-[#d96e00] border-[#EF7C00]",
    )}
    title={title}
    disabled={disabled}
  >
    {children}
  </Button>
);

const TiptapRichTextEditor: React.FC<TiptapRichTextEditorProps> = ({
  label,
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  placeholder: _placeholder = "Enter your text here...",
  value = "",
  onChange,
  required = false,
  maxLength,
  showCharCount = false,
  className = "",
  rows = 6,
}) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        // code and codeBlock are included in StarterKit
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#EF7C00] underline cursor-pointer hover:text-[#d96e00]",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full rounded-lg my-4" },
        inline: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none",
        style: `min-height: ${rows * 1.5}rem; padding: 1rem;`,
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href ?? "";
    setLinkUrl(previousUrl);
    setLinkDialogOpen(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const applyImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageDialogOpen(false);
    setImageUrl("");
  }, [editor, imageUrl]);

  const getCharCount = () => editor?.getText().length ?? 0;
  const isOverLimit = maxLength && getCharCount() > maxLength;

  if (!editor) {
    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {description && <p className="text-xs text-gray-500">{description}</p>}
        <div
          className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
          style={{ minHeight: `${rows * 1.5}rem` }}
        >
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
            Loading rich text editor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {description && <p className="text-xs text-gray-500">{description}</p>}

      {/* Toolbar */}
      <div className="border border-gray-200 border-b-0 rounded-t-lg p-2 bg-gray-50">
        <div className="flex flex-wrap gap-1.5">
          {/* Undo / Redo */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo"
              disabled={!editor.can().undo()}
            >
              <Undo2 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo"
              disabled={!editor.can().redo()}
            >
              <Redo2 className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive("highlight")}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              isActive={editor.isActive("heading", { level: 4 })}
              title="Heading 4"
            >
              <Heading4 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive("paragraph")}
              title="Paragraph"
            >
              <span className="font-bold text-xs">P</span>
            </MenuButton>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              isActive={editor.isActive({ textAlign: "justify" })}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Code */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              title="Code Block"
            >
              <Code2 className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Super / Sub script */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              isActive={editor.isActive("superscript")}
              title="Superscript"
            >
              <SuperscriptIcon className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              isActive={editor.isActive("subscript")}
              title="Subscript"
            >
              <SubscriptIcon className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Link */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={openLinkDialog}
              isActive={editor.isActive("link")}
              title="Insert / Edit Link"
            >
              <Link2 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
              disabled={!editor.isActive("link")}
            >
              <Link2Off className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Image */}
          <div className="flex gap-1 border-r border-gray-200 pr-2">
            <MenuButton
              onClick={() => setImageDialogOpen(true)}
              title="Insert Image"
            >
              <FileImage className="h-4 w-4" />
            </MenuButton>
          </div>

          {/* Block Elements */}
          <div className="flex gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              <Minus className="h-4 w-4" />
            </MenuButton>
          </div>
        </div>
      </div>

      {/* Link Dialog */}
      {linkDialogOpen && (
        <div className="border border-gray-200 bg-white p-3 flex items-center gap-2 rounded-md shadow-sm">
          <Link2 className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyLink();
              if (e.key === "Escape") setLinkDialogOpen(false);
            }}
            placeholder="https://example.com"
            className="flex-1 text-sm border-none outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={applyLink}
            className="text-xs font-semibold text-[#EF7C00] hover:underline"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setLinkDialogOpen(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Image Dialog */}
      {imageDialogOpen && (
        <div className="border border-gray-200 bg-white p-3 flex items-center gap-2 rounded-md shadow-sm">
          <FileImage className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            autoFocus
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyImage();
              if (e.key === "Escape") setImageDialogOpen(false);
            }}
            placeholder="https://example.com/image.jpg"
            className="flex-1 text-sm border-none outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={applyImage}
            className="text-xs font-semibold text-[#EF7C00] hover:underline"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setImageDialogOpen(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor */}
      <div
        className={cn(
          "border border-gray-200 rounded-b-lg bg-white",
          isOverLimit
            ? "border-red-500"
            : "focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500",
        )}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      {showCharCount && (
        <div className="flex justify-between mt-1 text-xs">
          <span
            className={cn(
              "text-gray-500",
              isOverLimit && "text-red-500 font-medium",
            )}
          >
            {getCharCount()}
            {maxLength && ` / ${maxLength} characters`}
          </span>
          {isOverLimit && (
            <span className="text-red-500 font-medium">
              Character limit exceeded
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TiptapRichTextEditor;
