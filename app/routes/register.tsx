import { Label } from "@radix-ui/react-label";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, Link, redirect, useLoaderData } from "@remix-run/react";
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
import { commitSession, getSession } from "~/sessions";
import { db } from "~/lib/db.server";
import argon2 from "argon2";
import { generateApiKey } from "~/lib/api-key";

export const meta: MetaFunction = () => {
  return [
    { title: "Register | DiPDF" },
    { name: "description", content: "Register to DiPDF" },
  ];
};
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/dashboard");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();

  const name = form.get("name");
  const email = form.get("email");
  const password = form.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    session.flash("error", "Invalid form data");
    return redirect("/register", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    session.flash("error", "Email already in use");
    return redirect("/register", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: await argon2.hash(password),
      api_key: generateApiKey(),
    },
  });

  session.set("userId", newUser.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Register() {
  const { error } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Logo />
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            DiPDF
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Create an account to start using DiPDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
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
                  name="password"
                  required
                  className="border-gray-300"
                />
              </div>
            </div>
            <Button className="w-full mt-6 " type="submit">
              Register
            </Button>
            {error && (
              <div className="text-red-500 text-center mt-4">{error}</div>
            )}
          </Form>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
