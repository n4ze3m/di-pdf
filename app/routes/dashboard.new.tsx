import { useState, useRef, useEffect } from "react";
import { ArrowUpIcon } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Dashboard from "~/components/Layout/dashboard";

export default function NewDashboard() {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 500;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleGenerate = () => {
    console.log("Generating PDF with prompt:", prompt);
  };

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
                  <span>{prompt.length}/{maxLength}</span>
                  <Button
                    onClick={handleGenerate}
                    className={`bg-gradient-to-r  from-gray-600 to-gray-800 text-white rounded-full transition-all duration-300 ease-in-out ${
                      prompt
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                    disabled={!prompt}
                  >
                    <ArrowUpIcon className="size-5" />
                    <span className="ml-2 hidden md:inline">Send</span>
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
