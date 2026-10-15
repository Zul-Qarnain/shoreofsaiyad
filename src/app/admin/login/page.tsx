"use client";

import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

export default function AdminLoginPage() {
  const [state, setState] = useState<LoginState>({});
  const [pending, startTransition] = useTransition();

  const formAction = (formData: FormData) =>
    startTransition(async () => {
      // On success the action redirects; otherwise it returns an error message.
      setState(await login({}, formData));
    });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/40 px-4">
      <Logo />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Admin sign in
          </CardTitle>
          <CardDescription>Store staff only.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            {state.error && (
              <p role="alert" className="text-sm text-destructive">
                {state.error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
