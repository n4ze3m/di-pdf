import { useState, useRef, useEffect } from "react";
import { ArrowUpIcon } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Dashboard from "~/components/Layout/dashboard";
import { withAuth } from "~/lib/with-auth";
import { json, MetaFunction } from "@remix-run/node";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@remix-run/react";
import toast from "react-hot-toast";
export const meta: MetaFunction = () => {
  return [
    { title: "Create New PDF | DiPDF" },
    { name: "description", content: "Dashbaord for DiPDF" },
  ]
};
export const loader = withAuth(async (args) => {
  return json({});
});
export default function NewDashboard() {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 800;

  const navigate = useNavigate();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const { mutate: handleGenerate, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/ai/create", {
        method: "POST",
        body: JSON.stringify({
          prompt,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || err?.message || "Something went wrong");
      }
      return (await res.json()) as {
        id: string;
      };
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      toast.success("PDF generated successfully");
      navigate(`/dashboard/doc/${data.id}`);
    },
  });

  return (
    <Dashboard title="">
      <div
        className="flex flex-col items-center justify-center p-4"
        style={{ height: "80vh" }}
      >
        <div className="max-w-3xl w-full space-y-8">
          <p className="text-center text-lg text-gray-600">
            Describe your PDF requirements, and AI will craft it for you.
          </p>

          <Card className="w-full overflow-hidden border border-gray-200 bg-white">
            <CardContent className="p-1">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  placeholder="What PDF can I help you generate today?"
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(e.target.value.slice(0, maxLength))
                  }
                  className="w-full min-h-[100px] text-lg p-4 pb-10  border-0 focus:ring-0 resize-none bg-transparent outline-none"
                />
                <div className="absolute bottom-2 left-4 text-sm text-gray-400 flex items-center justify-between w-full pr-4">
                  <span>
                    {prompt.length}/{maxLength}
                  </span>
                  <Button
                    onClick={async () => {
                      await handleGenerate();
                    }}
                    className={`bg-gradient-to-r  from-gray-600 to-gray-800 text-white rounded-full transition-all duration-300 ease-in-out ${
                      prompt
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                    disabled={!prompt || isGenerating}
                  >
                    <ArrowUpIcon className="size-5" />
                    <span className="ml-2 hidden md:inline">
                      {isGenerating ? "Generating..." : "Generate"}
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Generate a report on renewable energy trends",
              "Create a marketing brochure for a new product",
              "Design an educational booklet on financial literacy",
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm bg-white hover:bg-gray-50 transition-colors duration-300 border border-gray-200"
                onClick={() => setPrompt(example)}
              >
                {example} →
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
