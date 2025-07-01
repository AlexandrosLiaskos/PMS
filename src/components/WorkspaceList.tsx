"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MoreHorizontal, Edit, Trash2, Plus, Building2 } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  userId: string;
}

import { useRouter } from "next/navigation";

// ... (rest of the component)

export default function WorkspaceList() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");
  const [deletingWorkspace, setDeletingWorkspace] = useState<Workspace | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [actionsWorkspace, setActionsWorkspace] = useState<Workspace | null>(null);

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/workspaces");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setWorkspaces(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;

    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newWorkspaceName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setNewWorkspaceName("");
      setCreateDialogOpen(false);
      fetchWorkspaces(); // Refresh the list
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setActionsWorkspace(null); // Close actions dialog
    setEditingWorkspace(workspace);
    setEditWorkspaceName(workspace.name);
  };

  const handleUpdateWorkspace = async () => {
    if (!editingWorkspace || !editWorkspaceName.trim()) return;

    try {
      const response = await fetch(`/api/workspaces/${editingWorkspace.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editWorkspaceName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setEditingWorkspace(null);
      setEditWorkspaceName("");
      fetchWorkspaces(); // Refresh the list
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        alert(`Failed to update workspace: ${err.message}`);
      }
    }
  };

  const handleDeleteWorkspaceConfirm = (workspace: Workspace) => {
    setActionsWorkspace(null); // Close actions dialog
    setDeletingWorkspace(workspace);
  };

  const handleDeleteWorkspace = async () => {
    if (!deletingWorkspace) return;

    setDeletingId(deletingWorkspace.id);
    try {
      const response = await fetch(`/api/workspaces/${deletingWorkspace.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setDeletingWorkspace(null);
      fetchWorkspaces(); // Refresh the list
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        alert(`Failed to delete workspace: ${err.message}`);
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p>Loading workspaces...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Workspaces</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Organize and manage your projects across different workspaces</p>
      </div>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <Card className="mb-8 border-dashed border-2 border-primary/30 hover:border-primary/60 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors duration-200">
                <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-200">Create New Workspace</h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">Start organizing your projects in a new workspace</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Workspace</DialogTitle>
            <DialogDescription>
              Enter a name for your new workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              placeholder="Workspace Name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newWorkspaceName.trim()) {
                  handleCreateWorkspace();
                }
              }}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {workspaces.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No workspaces yet</h3>
          <p className="text-gray-500 mb-4">Create your first workspace to start organizing your projects</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="flex items-center justify-between border-primary shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
              <CardHeader className="p-4">
                <CardTitle className="text-xl">{workspace.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex items-center gap-2">
                <InteractiveHoverButton
                  onClick={() => router.push(`/workspaces/${workspace.id}`)}
                >
                  View Projects
                </InteractiveHoverButton>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setActionsWorkspace(workspace)}
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Workspace Dialog */}
      <Dialog open={!!editingWorkspace} onOpenChange={(open) => !open && setEditingWorkspace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Update the name of your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="edit-name"
              placeholder="Workspace Name"
              value={editWorkspaceName}
              onChange={(e) => setEditWorkspaceName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editWorkspaceName.trim()) {
                  handleUpdateWorkspace();
                }
              }}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingWorkspace(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWorkspace} disabled={!editWorkspaceName.trim()}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workspace Actions Dialog */}
      <Dialog open={!!actionsWorkspace} onOpenChange={(open) => !open && setActionsWorkspace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace Actions</DialogTitle>
            <DialogDescription>
              Choose an action for "{actionsWorkspace?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Button 
              variant="outline" 
              onClick={() => handleEditWorkspace(actionsWorkspace!)}
              className="justify-start"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Workspace
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteWorkspaceConfirm(actionsWorkspace!)}
              className="justify-start"
              disabled={deletingId === actionsWorkspace?.id}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deletingId === actionsWorkspace?.id ? "Deleting..." : "Delete Workspace"}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionsWorkspace(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Workspace Dialog */}
      <Dialog open={!!deletingWorkspace} onOpenChange={(open) => !open && setDeletingWorkspace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingWorkspace?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingWorkspace(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteWorkspace}
              disabled={deletingId === deletingWorkspace?.id}
            >
              {deletingId === deletingWorkspace?.id ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
