import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Dashboard from "~/components/Layout/dashboard";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { db } from "~/lib/db.server";
import { withAuth } from "~/lib/with-auth";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export const meta: any = () => {
  return [
    { title: "Dashboard | DiPDF" },
    { name: "description", content: "Dashboard for DiPDF" },
  ]
};

export const loader = withAuth(async ({ userId }) => {
  const user_api = await db.user.findFirst({
    select: {
        api_key: true
    },
    where: {
     id: userId,
    },
   
  });

  return json({
    data: user_api?.api_key,
  });
});

const DashboardPage = () => {
  const { data } = useLoaderData<typeof loader>();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dashboard title="API Key">
      <Card className="p-6 mt-6">
        <CardTitle className="mb-4">Your API Key</CardTitle>
        <CardContent>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={data || "No API key found"}
              readOnly
              className="flex-grow p-2 border rounded"
            />
            <Button onClick={copyToClipboard} className="whitespace-nowrap">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Keep your API key secret. Do not share it with others.
          </p>
        </CardContent>
      </Card>
    </Dashboard>
  );
};

export default DashboardPage;