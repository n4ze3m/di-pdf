import { json, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DynamicForm from "~/components/DynamicForm";
import Dashboard from "~/components/Layout/dashboard";
import { db } from "~/lib/db.server";
import { withAuth } from "~/lib/with-auth";
import DocumentPreview from "~/components/common/PDFPreview";
import { useState } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";


export const meta: MetaFunction = () => {
  return [
    { title: "Playground | DiPDF" },
    { name: "description", content: "Playground for DiPDF"}
  ];
};
function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ??
    request.headers.get("host") ??
    new URL(request.url).host;
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export const loader = withAuth(async ({ params, userId, request }) => {
  const slug = params.slug;

  const data = await db.document.findFirst({
    where: {
      user_id: userId,
      id: slug,
    },
  });

  const activeDoc = await db.documentVersion.findFirst({
    where: {
      document_id: slug,
      active: true,
    },
  });

  if (!data) {
    return redirect("/dashboard", {
      status: 404,
    });
  }

  return json({
    data,
    doc: activeDoc,
    url: getDomainUrl(request),
  });
});

export default function NewDashboard() {
  const { doc, data, url } = useLoaderData<typeof loader>();
  const [variable, setVariable] = useState<any | undefined>();

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Dashboard title={""}>
      <header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center">
          <DocumentIcon className="size-4 text-indigo-600 mr-3" />
          <h1 className="text-sm italic leading-tight tracking-tight text-gray-600">
            {data.title}
          </h1>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <Tabs defaultValue="input">
          <div className="flex justify-end">
            <TabsList className=" justify-end">
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="variable">Variable</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="input">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Input Information</h2>
              <DynamicForm
                schema={doc?.variables as any}
                onSubmit={(data) => {
                  console.log(data);
                  setVariable(data);
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="variable">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Variable Information</h2>
              <Textarea
                readOnly
                value={JSON.stringify(doc?.variables || {}, null, 2)}
                rows={10}
              />
              <h3 className="text-xl font-semibold mt-6">
                Generate PDF Examples
              </h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-medium">Node.js Example:</h4>
                  <Button
                    onClick={() =>
                      copyToClipboard(`
const axios = require('axios');

async function generatePDF(apiKey, documentId, variables) {
  try {
    const response = await axios.post('${url}/api/v1/generate', {
      document_id: documentId,
      variables: variables
    }, {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    // Save the PDF or process it as needed
    const pdfBuffer = Buffer.from(response.data, 'binary');
    // For example, save to a file:
    // require('fs').writeFileSync('generated.pdf', pdfBuffer);

    console.log('PDF generated successfully');
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    throw error;
  }
}

// Usage
const apiKey = 'YOUR_API_KEY';
const documentId = '${data.id}';
const variables = ${JSON.stringify(variable || doc?.variables, null, 2)};

generatePDF(apiKey, documentId, variables)
  .then(pdf => console.log('PDF generated, size:', pdf.length, 'bytes'))
  .catch(err => console.error('Failed to generate PDF:', err));
                  `)
                    }
                  >
                    Copy
                  </Button>
                </div>
                <pre className="bg-white p-2 rounded-md overflow-x-auto">
                  <code>{`
const axios = require('axios');

async function generatePDF(apiKey, documentId, variables) {
  try {
    const response = await axios.post('${url}/api/v1/generate', {
      document_id: documentId,
      variables: variables
    }, {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    // Save the PDF or process it as needed
    const pdfBuffer = Buffer.from(response.data, 'binary');
    // For example, save to a file:
    // require('fs').writeFileSync('generated.pdf', pdfBuffer);

    console.log('PDF generated successfully');
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    throw error;
  }
}

// Usage
const apiKey = 'YOUR_API_KEY';
const documentId = '${data.id}';
const variables = ${JSON.stringify(variable || doc?.variables, null, 2)};

generatePDF(apiKey, documentId, variables)
  .then(pdf => console.log('PDF generated, size:', pdf.length, 'bytes'))
  .catch(err => console.error('Failed to generate PDF:', err));
                  `}</code>
                </pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-md mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-medium">Python Example:</h4>
                  <Button
                    onClick={() =>
                      copyToClipboard(`
import requests
import json

def generate_pdf(api_key, document_id, variables):
    url = '${url}/api/v1/generate'
    headers = {
        'X-Api-Key': api_key,
        'Content-Type': 'application/json'
    }
    payload = {
        'document_id': document_id,
        'variables': variables
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        # Save the PDF or process it as needed
        pdf_content = response.content
        # For example, save to a file:
        # with open('generated.pdf', 'wb') as f:
        #     f.write(pdf_content)
        
        print('PDF generated successfully')
        return pdf_content
    except requests.exceptions.RequestException as e:
        print('Error generating PDF:', str(e))
        raise

# Usage
api_key = 'YOUR_API_KEY'
document_id = '${data.id}'
variables = ${JSON.stringify(variable || doc?.variables, null, 2)}

try:
    pdf = generate_pdf(api_key, document_id, variables)
    print('PDF generated, size:', len(pdf), 'bytes')
except Exception as e:
    print('Failed to generate PDF:', str(e))
                  `)
                    }
                  >
                    Copy
                  </Button>
                </div>
                <pre className="bg-white p-2 rounded-md overflow-x-auto">
                  <code>{`
import requests
import json

def generate_pdf(api_key, document_id, variables):
    url = '${url}/api/v1/generate'
    headers = {
        'X-Api-Key': api_key,
        'Content-Type': 'application/json'
    }
    payload = {
        'document_id': document_id,
        'variables': variables
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        # Save the PDF or process it as needed
        pdf_content = response.content
        # For example, save to a file:
        # with open('generated.pdf', 'wb') as f:
        #     f.write(pdf_content)
        
        print('PDF generated successfully')
        return pdf_content
    except requests.exceptions.RequestException as e:
        print('Error generating PDF:', str(e))
        raise

# Usage
api_key = 'YOUR_API_KEY'
document_id = '${data.id}'
variables = ${JSON.stringify(variable || doc?.variables, null, 2)}

try:
    pdf = generate_pdf(api_key, document_id, variables)
    print('PDF generated, size:', len(pdf), 'bytes')
except Exception as e:
    print('Failed to generate PDF:', str(e))
                  `}</code>
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DocumentPreview varaibles={variable} />
      </div>
    </Dashboard>
  );
}
