"use client";

import { useActionState } from "react";
import { deleteProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

interface DeleteProjectDialogProps {
  workspaceId: string;
  projectId: string;
  projectName: string;
  onOpenChange: (open: boolean) => void;
}

const initialState = {
  error: "",
  success: false,
};

export function DeleteProjectDialog({ workspaceId, projectId, projectName, onOpenChange }: DeleteProjectDialogProps) {
  const [state, formAction] = useActionState(deleteProject, initialState);

  // Close dialog on successful deletion
  if (state.success) {
    onOpenChange(false);
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the project &quot;{projectName}&quot;?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <input type="hidden" name="projectId" value={projectId} />
          {state?.error && <p className="text-red-500 text-center">{state.error}</p>}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="destructive">Delete</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
