import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileTree } from "@/components/magicui/file-tree";
import MarkdownEditor from "@/components/MarkdownEditor";

interface KnowledgeBaseProps {
  contents: Array<{
    id: string;
    title: string;
    content: string;
    path: string | null;
    type: string;
  }>;
  onCreate: (title: string, content: string, path: string) => void;
}

export function KnowledgeBase({ contents, onCreate }: KnowledgeBaseProps) {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPath, setNewPath] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleSelect = (id: string) => {
    setSelectedContent(id);
  };

  const handleCreate = () => {
    onCreate(newTitle, newContent, newPath);
    setNewTitle("");
    setNewPath("");
    setNewContent("");
    setIsCreating(false);
  };

  // Organize contents into a tree structure based on paths
  const treeData = buildTreeData(contents);

  return (
    <Card className="shadow-md w-full mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          Knowledge Base
          <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
            + New Document
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[400px]">
        <div className="overflow-y-auto flex-grow">
          {treeData.length > 0 ? (
            <FileTree
              data={treeData}
              onSelect={(id: string) => handleSelect(id)}
              className="bg-white rounded-md border"
            />
          ) : (
            <p className="text-sm text-gray-500">No documents in the knowledge base.</p>
          )}
        </div>

        {/* Dialog for viewing/editing existing content */}
        {selectedContent && (
          <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
            <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {contents.find((c) => c.id === selectedContent)?.title || "Document"}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col h-full">
                <MarkdownEditor
                  initialContent={contents.find((c) => c.id === selectedContent)?.content || ""}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog for creating new content */}
        {isCreating && (
          <Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
            <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Path (e.g., folder/subfolder)"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <MarkdownEditor
                  initialContent={newContent}
                />
                <Button onClick={handleCreate} disabled={!newTitle}>
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

 // Helper function to build tree data from content paths
function buildTreeData(contents: Array<{ id: string; title: string; path: string | null; type: string }>) {
  const treeData: Array<{ id: string; name: string; children?: Array<{ id: string; name: string; children?: Array<{ id: string; name: string }> }> }> = [];

  contents.forEach((content) => {
    if (!content.path || content.path.trim() === "") {
      treeData.push({
        id: content.id,
        name: content.title,
      });
    } else {
      const pathParts = content.path.split("/").filter((p) => p.trim() !== "");
      let currentLevel = treeData;

      pathParts.forEach((part, index) => {
        let existingFolder = currentLevel.find((item) => item.name === part && !item.id.startsWith("content-"));

        if (!existingFolder) {
          existingFolder = {
            id: `folder-${part}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            name: part,
            children: [],
          };
          currentLevel.push(existingFolder);
        }

        if (index === pathParts.length - 1) {
          existingFolder.children = existingFolder.children || [];
          existingFolder.children.push({
            id: content.id,
            name: content.title,
          });
        } else {
          existingFolder.children = existingFolder.children || [];
          currentLevel = existingFolder.children;
        }
      });
    }
  });

  return treeData;
}
