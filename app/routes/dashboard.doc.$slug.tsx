import DynamicForm from "~/components/DynamicForm";
import Dashboard from "~/components/Layout/dashboard";

export default function NewDashboard() {
  return <Dashboard title="">
    <DynamicForm
    schema={{
        title: "string",
        description: "string",
        content: "string",
        author: "string",
        skills: [
            "string"
        ],
        tags: [
            "string"

        ]
    }}
    onSubmit={(data) => {
        console.log(data);
    }}
    />
  </Dashboard>;
}
