import { Link } from "@remix-run/react";
import Dashboard from "~/components/Layout/dashboard";
import { Button } from "~/components/ui/button";

const DashboardPage = () => {
  return (
    <Dashboard title="Dashboard">
      <div className="flex justify-end items-center">
        <Link
        to="/dashboard/new"
        className={`bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-xl  text-center default`}
        >New Document</Link>
      </div>
    </Dashboard>
  );
};

export default DashboardPage;
