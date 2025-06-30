"use client";

import { useActionState } from "react";
import { createProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface CreateProjectFormProps {
  workspaceId: string;
}

const initialState = {
  error: "",
  success: false,
};

export function CreateProjectForm({ workspaceId }: CreateProjectFormProps) {
  const [state, formAction] = useActionState(createProject, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <InteractiveHoverButton className="flex items-center gap-2 mb-8">
          New Project
        </InteractiveHoverButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new project.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" className="col-span-3" />
            </div>
          </div>
          {state?.error && <p className="text-red-500 text-center">{state.error}</p>}
          <DialogFooter>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
