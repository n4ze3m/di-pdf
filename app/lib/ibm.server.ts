const token = async () => {
  const apiKey = process.env.IBM_API_KEY;
  if (!apiKey) {
    throw new Error("IBM_API_KEY is not defined");
  }
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
  });
  return res.json();
};

export const generatePDF = async (userQuery: string) => {
  const tokenResponse = await token();

  const url =
    "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenResponse?.access_token}`,
  };

  const body = {
    input: `Generate an HTML template using Tailwind CSS classes for creating a PDF document. The template should:\n1. Use only HTML elements suitable for PDF rendering (avoid buttons, videos, or interactive elements).\n2. Implement a clean, professional layout optimized for print.\n3. Utilize Tailwind CSS classes for styling, including responsive design considerations.\n4. Include placeholders for dynamic content using Handlebars syntax (e.g., {{title}}, {{content}}). Use only snake_case or camelCase for variable names.\n5. Incorporate appropriate semantic HTML5 elements (e.g., header, main, footer).\n6. Ensure all text is legible when printed, using appropriate font sizes and contrast.\n7. Include styled elements such as headings, paragraphs, lists, and tables as needed.\n8. Implement a page header and footer with placeholders for page numbers and other metadata.\n9. Avoid any external resources or dependencies that may not render in a PDF.\n10. Maintain a consistent style and tone throughout the document.\nRemember to stay in character as an HTML/CSS generator and focus solely on creating the requested template. Do not break character or provide explanations outside the scope of generating the HTML/CSS code. The output should be valid HTML that can be directly used with a PDF generation too\n\nInput: #  professional resume template\nOutput: <!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>{{name}} - Resume</title>\n</head>\n<body class=\"bg-white text-gray-800\">\n    <div class=\"container mx-auto px-4 py-8\">\n        <header class=\"mb-6\">\n            <h1 class=\"text-3xl font-bold\">{{name}}</h1>\n            <p class=\"text-lg text-gray-600\">{{profession}}</p>\n        </header>\n        \n        <main>\n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold mb-2\">Contact Information</h2>\n                <p>Email: {{email}}</p>\n                <p>Phone: {{phone}}</p>\n                <p>Location: {{location}}</p>\n            </section>\n            \n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold mb-2\">Professional Summary</h2>\n                <p>{{summary}}</p>\n            </section>\n            \n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold mb-2\">Work Experience</h2>\n                {{#each experiences}}\n                <div class=\"mb-4\">\n                    <h3 class=\"text-lg font-medium\">{{this.title}} at {{this.company}}</h3>\n                    <p class=\"text-sm text-gray-600\">{{this.dateRange}}</p>\n                    <ul class=\"list-disc list-inside\">\n                        {{#each this.responsibilities}}\n                        <li>{{this}}</li>\n                        {{/each}}\n                    </ul>\n                </div>\n                {{/each}}\n            </section>\n            \n            <section>\n                <h2 class=\"text-xl font-semibold mb-2\">Education</h2>\n                {{#each education}}\n                <div class=\"mb-2\">\n                    <h3 class=\"text-lg font-medium\">{{this.degree}}</h3>\n                    <p>{{this.school}}, {{this.year}}</p>\n                </div>\n                {{/each}}\n            </section>\n        </main>\n        \n        <footer class=\"mt-8 text-center text-sm text-gray-500\">\n            <p>Page {{page}} of {{totalPages}}</p>\n        </footer>\n    </div>\n</body>\n</html>\n\n<end of code>\n\nInput: # Create a restaurant menu template\nOutput: <!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>{{restaurantName}} - Menu</title>\n</head>\n<body class=\"bg-amber-50 text-gray-800\">\n    <div class=\"container mx-auto px-4 py-8\">\n        <header class=\"text-center mb-8\">\n            <h1 class=\"text-4xl font-bold text-amber-800\">{{restaurantName}}</h1>\n            <p class=\"text-xl text-amber-600\">{{tagline}}</p>\n        </header>\n        \n        <main>\n            {{#each categories}}\n            <section class=\"mb-8\">\n                <h2 class=\"text-2xl font-semibold mb-4 text-amber-700 border-b-2 border-amber-200 pb-2\">{{this.name}}</h2>\n                {{#each this.items}}\n                <div class=\"mb-4 flex justify-between items-center\">\n                    <div>\n                        <h3 class=\"text-lg font-medium\">{{this.name}}</h3>\n                        <p class=\"text-sm text-gray-600\">{{this.description}}</p>\n                    </div>\n                    <p class=\"text-lg font-bold text-amber-800\">$ {{this.price}}</p>\n                </div>\n                {{/each}}\n            </section>\n            {{/each}}\n        </main>\n        \n        <footer class=\"mt-8 text-center text-sm text-amber-700\">\n            <p>{{address}}</p>\n            <p>{{phone}}</p>\n            <p class=\"mt-2\">Menu prices and items subject to change. Printed on {{currentDate}}</p>\n        </footer>\n    </div>\n</body>\n</html>\n\n<end of code>\n\nInput: # Lease agreement for a house\nOutput: <!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Lease Agreement</title>\n</head>\n<body class=\"bg-white\">\n    <div class=\"container mx-auto px-4 py-8\">\n        <header class=\"text-center\">\n            <h1 class=\"text-4xl font-bold\">Lease Agreement</h1>\n            <p class=\"text-xl\">This Lease Agreement (\"Agreement\") is entered into on {{date}}, by and between {{landlord_name}} (\"Landlord\") and {{tenant_name}} (\"Tenant\").</p>\n        </header>\n        \n        <main>\n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold\">Premises</h2>\n                <p>The Landlord rents to the Tenant and the Tenant rents from the Landlord, the premises located at:</p>\n                <p>{{address}}</p>\n                <p>{{city}}, {{state}} {{zip}}</p>\n            </section>\n            \n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold\">Term</h2>\n                <p>The initial term of this Lease will begin on {{start_date}} and will end on {{end_date}}</p>\n            </section>\n            \n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold\">Rent</h2>\n                <p>The Tenant shall pay the Landlord a monthly rent of:</p>\n                <p>{{rent_amount}}</p>\n                <p>due on the first day of each calendar month.</p>\n            </section>\n            \n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold\">Security Deposit</h2>\n                <p>The Tenant shall provide a security deposit of:</p>\n                <p>{{security_deposit_amount}}</p>\n                <p>to the Landlord within {{number_of_days}} days after the execution of this Agreement.</p>\n            </section>\n            \n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold\">Use of Premises</h2>\n                <p>The Tenant shall only use the Premises for the purpose of operating a {{typ_of_business}}.</p>\n            </section>\n            \n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold\">Maintenance and Repairs</h2>\n                <p>The Landlord shall maintain and repair the structural components of the Premises, while the Tenant shall maintain and repair all non-structural components.</p>\n            </section>\n            \n            <section class=\"mb-6\">\n                <h2 class=\"text-xl font-semibold\">Termination</h2>\n                <p>Either party may terminate this Agreement with a written notice of {{number_of_days}} days.</p>\n                <p>In the event of a termination by the Landlord, the Landlord shall refund the security deposit to the Tenant, less any lawful deductions.</p>\n            </section>\n        </main>\n    </div>\n</body>\n</html>\n\n<end of code>\n\nInput: # ${userQuery}\nOutput:`,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 2000,
      min_new_tokens: 1,
      stop_sequences: ["<end of code>"],
      repetition_penalty: 1,
    },
    model_id: process.env.IBM_MODEL_ID,
    project_id: process.env.IBM_PROJECT_ID,
  };

  const response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error(err);
    throw new Error("Non-200 response");
  }

  const res = (await response.json()) as {
    results: [
      {
        generated_text: string;
      }
    ];
  };

  const html = res.results[0].generated_text
    .replace(/<end of code>/, "")
    .trim();


  return html;
};


export const generateMockData = async (data: string) => {
  try {
    const tokenResponse = await token();

    const url =
      "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenResponse?.access_token}`,
    };


    const body = {
      input: `Fill the following JSON structure with realistic mock data\n\nInput: {\n  \"date\": \"\",\n  \"items\": [\n    {\n      \"name\": \"\",\n      \"price\": \"\",\n      \"quantity\": \"\",\n      \"description\": \"\"\n    }\n  ],\n  \"total\": \"\",\n  \"due_date\": \"\",\n  \"customer_name\": \"\",\n  \"account_number\": \"\",\n  \"customer_email\": \"\",\n  \"invoice_number\": \"\",\n  \"payment_method\": \"\",\n  \"routing_number\": \"\",\n  \"customer_address\": \"\"\n}\nOutput: {\n  \"date\": \"2024-08-15\",\n  \"items\": [\n    {\n      \"name\": \"Widget X\",\n      \"price\": \"29.99\",\n      \"quantity\": \"3\",\n      \"description\": \"High-quality multipurpose widget\"\n    },\n    {\n      \"name\": \"Gadget Y\",\n      \"price\": \"49.95\",\n      \"quantity\": \"1\",\n      \"description\": \"Advanced electronic gadget\"\n    }\n  ],\n  \"total\": \"139.92\",\n  \"dueDate\": \"2024-09-14\",\n  \"customerName\": \"John Doe\",\n  \"accountNumber\": \"AC1234567\",\n  \"customerEmail\": \"john.doe@example.com\",\n  \"invoiceNumber\": \"INV-2024-08150001\",\n  \"paymentMethod\": \"Credit Card\",\n  \"routingNumber\": \"021000021\",\n  \"customerAddress\": \"123 Main St, Anytown, AN 12345\"\n}\n\n<end of code>\n\nInput: ${data}\nOutput:`,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 5001,
        min_new_tokens: 1,
        stop_sequences: ["<end of code>"],
        repetition_penalty: 1,
      },
      model_id: process.env.IBM_MODEL_ID,
      project_id: process.env.IBM_PROJECT_ID,
    };
    const response = await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.json();
      console.error(err);
      return JSON.parse(data)
    }

    const res = (await response.json()) as {
      results: [
        {
          generated_text: string;
        }
      ];
    };

    const json = res.results[0].generated_text
    .replace(/<end of code>/, "")
    .trim();

    return JSON.parse(json);
  } catch (e) {
    console.error(e);
    return JSON.parse(data);
  }
}