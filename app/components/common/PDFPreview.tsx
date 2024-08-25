import { useParams } from "@remix-run/react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";

const DocumentPreview = ({ varaibles }: { varaibles?: any }) => {
  const params = useParams<{ slug: string }>();

  const generatePdf = async () => {
    const res = await fetch(`/api/v1/ai/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doc_id: params.slug,
        varaibles,
      }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    return url;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["generatePdf", params.slug, varaibles],
    queryFn: generatePdf,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Preview</h2>
        <Button
          onClick={async () => {
            if (data) {
              const ref = await fetch(data);
              const blob = await ref.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "document.pdf";
              document.body.appendChild(a);
              a.click();
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Download"}
        </Button>
      </div>
      <Card className="w-full h-[200mm] overflow-hidden bg-gray-100 shadow-lg">
        <div className="relative w-full h-full overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <p>Loading PDF...</p>
            </div>
          ) : (
            <object
              type="application/pdf"
              data={data}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocumentPreview;
