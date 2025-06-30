"use client";

import { useActionState } from "react";
import { updateProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface EditProjectFormProps {
  workspaceId: string;
  project: {
    id: string;
    name: string;
    description: string | null;
  };
  onOpenChange: (open: boolean) => void;
}

const initialState = {
  error: "",
  success: false,
};

export function EditProjectForm({ workspaceId, project, onOpenChange }: EditProjectFormProps) {
  const [state, formAction] = useActionState(updateProject, initialState);

  // Close dialog on successful update
  if (state.success) {
    onOpenChange(false);
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <input type="hidden" name="projectId" value={project.id} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" defaultValue={project.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" defaultValue={project.description || ""} className="col-span-3" />
            </div>
          </div>
          {state?.error && <p className="text-red-500 text-center">{state.error}</p>}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
