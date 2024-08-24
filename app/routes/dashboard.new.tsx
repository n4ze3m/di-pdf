import { useState, useRef, useEffect } from "react";
import { PaperclipIcon, ArrowUpIcon } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center p-4 ">
        <div className="max-w-3xl w-full space-y-8">
          <Card className="w-full overflow-hidden border border-gray-200 bg-white">
            <CardContent className="p-1">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  placeholder="What PDF can I help you generate today?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, maxLength))}
                  className="w-full min-h-[100px] text-lg p-4 pr-24 border-0 focus:ring-0 resize-none bg-transparent outline-none"
                />
                <div className="absolute bottom-2 left-4 text-sm text-gray-400">
                  {prompt.length}/{maxLength}
                </div>
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className={`bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-full px-6 py-2 transition-all duration-300 ease-in-out ${
                      prompt ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    disabled={!prompt}
                  >
                    <ArrowUpIcon className="mr-2 h-5 w-5" />
                    Send
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