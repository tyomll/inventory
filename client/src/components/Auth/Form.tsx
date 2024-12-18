"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { login, register } from "@/api/api";
import { AxiosError } from "axios";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

interface Props {
  form: "login" | "register";
}

const EMPTY_CREDENTIALS = {
  email: "",
  password: "",
};

const handleError = (error: AxiosError) => {
  switch (error.response?.status) {
    case 400:
      return "Invalid email or password.";
    case 409:
      return "This email is already in use.";
    default:
      return "Something went wrong. Please try again.";
  }
};

const AuthForm = ({ form }: Props) => {
  const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);
  const [error, setError] = useState<string | null>(null);
  const isLoginForm = form === "login";
  const { toast } = useToast();
  const router = useRouter();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    const { email, password } = credentials;
    try {
      if (isLoginForm) {
        const response = await login(email, password);
        const { token, expiresIn } = response.data;

        await setCookie("token", token, {
          maxAge: expiresIn,
          path: "/",
        });

        toast({
          title: "Login successful",
          description: "You have successfully logged in.",
          variant: "default",
        });
        router.push("/dashboard/products");
      } else {
        await register(email, password);
        toast({
          title: "Registration successful",
          description: "You have successfully registered.",
          variant: "default",
        });
        router.push("/auth/login");
      }
      setError(null);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const errorMessage = handleError(axiosError);
      setError(errorMessage);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {isLoginForm ? "Login" : "Register"}
        </CardTitle>
        <CardDescription>
          Enter your email and password to{" "}
          {isLoginForm ? "login to your" : "register an"} account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={handleFormChange}
              value={credentials.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              onChange={handleFormChange}
              value={credentials.password}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
          <Button type="submit" className="w-full" onClick={onSubmit}>
            {isLoginForm ? "Login" : "Register"}
          </Button>
        </div>
        <div className="mt-4 text-center space-x-1">
          <span className="text-sm text-muted-foreground">
            {isLoginForm
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <Link
            href={isLoginForm ? "/auth/register" : "/auth/login"}
            className="text-sm font-bold text-muted-foreground"
          >
            {isLoginForm ? "Try for free" : "Sign in"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
