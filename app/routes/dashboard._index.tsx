import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Dashboard from "~/components/Layout/dashboard";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { db } from "~/lib/db.server";
import { withAuth } from "~/lib/with-auth";
export const meta: any = () => {
  return [
    { title: "Dashboard | DiPDF" },
    { name: "description", content: "Dashbaord for DiPDF" },
  ]
};
export const loader = withAuth(async ({ userId }) => {
  const docs = await db.document.findMany({
    select: {
      id: true,
      title: true,
      total_versions: true,
    },
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return json({
    data: docs,
  });
});

const DashboardPage = () => {
  const { data } = useLoaderData<typeof loader>();

  return (
    <Dashboard title="Dashboard">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-end items-center">
          <Link
            to="/dashboard/new"
            className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium"
          >
            New Document
          </Link>
        </div>
        {data.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No documents found. Create a new one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((doc) => (
              <Link key={doc.id} to={`/dashboard/doc/${doc.id}`}>
                <Card
                  className="transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  <CardContent className="p-6">
                    <CardTitle className="mb-2">{doc.title}</CardTitle>
                    <span className="text-primary hover:text-primary/90 text-sm font-medium">
                      v{doc.total_versions}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default DashboardPage;