import React, { useState } from "react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTreeItem {
  id: string;
  name: string;
  children?: FileTreeItem[];
}

interface FileTreeProps {
  data: FileTreeItem[];
  onSelect?: (id: string) => void;
  className?: string;
}

export function FileTree({ data, onSelect, className }: FileTreeProps) {
  return (
    <div className={cn("p-2", className)}>
      {data.map((item) => (
        <FileTreeNode key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}

function FileTreeNode({ item, onSelect }: { item: FileTreeItem; onSelect?: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (onSelect) {
      onSelect(item.id);
    }
  };

  return (
    <div className={`ml-[${item.id.startsWith("folder-") ? 0 : 16}px]`}>
      <div
        className="flex items-center cursor-pointer hover:bg-gray-100 rounded-md p-1"
        onClick={handleClick}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1" />
          )
        ) : (
          <div className="w-5" /> // Spacer for alignment
        )}
        {hasChildren ? (
          <Folder className="w-4 h-4 mr-2 text-blue-500" />
        ) : (
          <File className="w-4 h-4 mr-2 text-gray-500" />
        )}
        <span className="text-sm truncate">{item.name}</span>
      </div>
      {hasChildren && isOpen && (
        <div className="ml-4">
          {item.children!.map((child) => (
            <FileTreeNode key={child.id} item={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
