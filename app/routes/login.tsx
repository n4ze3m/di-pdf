import { Label } from "@radix-ui/react-label";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Logo } from "~/components/common/Logo";

export const meta: MetaFunction = () => {
  return [
    { title: "Login | DiPDF" },
    { name: "description", content: "Login to DiPDF" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Logo />
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            DiPDF
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Login to access your DiPDF account and manage your documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="border-gray-300"
                />
              </div>
            </div>
            <Button className="w-full mt-6 " type="submit">
              Log in
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
