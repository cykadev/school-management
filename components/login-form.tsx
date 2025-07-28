"use client";

import { cn, validateSingleFormFieldZod } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as z from "zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2Icon } from 'lucide-react';
import { useMutation } from "urql";
import ErrorBox from "./modified/errorBox";


const loginType = z.object({
  email: z.email('Email address is not valid.'),
  password: z.string('Password should be atleast 6 characters.').min(6),
});

const LOGIN_MUTATION = `
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      message
      user {
        id
        email
        role
        firstName
        lastName
        status
      }
    }
  }
`;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [form, setForm] = useState<Record<string, string>>({ email: '', password: '' });
  const [savedFieldErrors, setSavedFieldErrors] = useState<Record<string, unknown>>({});
  const [serverError, setServerError] = useState<string>('');

  const [{ fetching }, attemptLogin] = useMutation(LOGIN_MUTATION);

  const handleOnChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {

    const setNewFieldErrors = validateSingleFormFieldZod(
      e.target.id,
      e.target.value,
      loginType,
      savedFieldErrors
    );

    if (setNewFieldErrors !== null) {
      setSavedFieldErrors(setNewFieldErrors);
    }

    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setServerError('');

    const result = loginType.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setSavedFieldErrors(fieldErrors);
    } else {

      // submit form
      const response = await attemptLogin({ input: form });

      if(response.error){
          setServerError(response.error.graphQLErrors?.[0]?.message ?? 'Something went wrong');
          return;
      }

      console.log("data", response.data)

    }


  };


  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>

      {serverError.length > 0 && (
        <ErrorBox errorMessage={serverError} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} name="loginForm">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  autoComplete="off"
                  aria-invalid={!!savedFieldErrors.email}
                  onChange={handleOnChangeEvent}
                />
                {/* {fieldErrors.email?.[0] && (
                  <p className="text-sm text-destructive">{fieldErrors.email[0]}</p>
                )} */}
              </div>
              <div className="grid gap-3">

                <div className="relative max-w-sm">
                  {/* <Label htmlFor="password">Password</Label> */}
                  <div className="flex items-center mb-2">
                    <Label htmlFor="password">Password</Label>
                    {/* <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="off"
                    aria-invalid={!!savedFieldErrors.password}
                    onChange={handleOnChangeEvent}
                    className={cn("pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-7.5 text-muted-foreground hover:text-foreground"
                    tabIndex={-1} // so it doesn't receive focus when tabbing through form
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={fetching}>
                  {fetching ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Powered by{" "}
              <a href="#" className="underline underline-offset-4">
                Code Sprint
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
