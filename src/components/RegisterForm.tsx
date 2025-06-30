"use client";

import { useActionState } from "react";
import { register } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  error: "",
  success: false,
};

export function RegisterForm() {
  const [state, formAction] = useActionState(register, initialState);

  return (
    <form action={formAction}>
      <div className="grid w-full items-center gap-1.5 mb-4">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" placeholder="Name" autoComplete="name" />
      </div>
      <div className="grid w-full items-center gap-1.5 mb-4">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" placeholder="Email" autoComplete="email" />
      </div>
      <div className="grid w-full items-center gap-1.5 mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
        />
      </div>
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <Button type="submit" className="w-full mt-4">
        Register
      </Button>
    </form>
  );
}
