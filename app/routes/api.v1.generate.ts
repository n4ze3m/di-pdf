import puppeteer from "puppeteer"
import { db } from "~/lib/db.server";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { compileTemplate } from "~/lib/compile-hb";

export const action = async ({
    request,
}: ActionFunctionArgs) => {

    const api_key = request.headers.get("x-api-key");

    if (!api_key) {
        return json({
            error: "No `x-api-key` header provided"
        }, 401);
    }

    const user = await db.user.findUnique({
        where: {
            api_key: api_key,
        },
    });

    if (!user) {
        return json({
            error: "Invalid API key",
        }, 401);
    }

    const data = await request.json();

    const doc = await db.document.findFirst({
        where: {
            id: data.document_id,
            user_id: user.id,
        }
    })

    if (!doc) {
        return json({
            error: "Document not found",
        }, 404);
    }


    const activeDoc = await db.documentVersion.findFirst({
        where: {
            document_id : doc.id,
            active: true,
        },
    });

    if (!doc) {
        return json({
            message: "Document not found"
        }, 404)
    }

    if (!data.variables) {
        return json({
            message: "No variables provided"
        }, 400)
    }

    console.log( activeDoc?.html )

    const template = compileTemplate(
        activeDoc?.html || "",
        data.variables
    )

    const html = `
       <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="p-6">
          ${template}
        </body>
      </html>
`

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 1200 });

    await page.setContent(html);

    const pdf = await page.pdf({
        format: "A4",
    });
    await browser.close();

    return new Response(pdf,
        {
            headers: {
                "Content-Type": "application/pdf",
            },
        })

}

  export const loader = async () => {
      return new Response("Method Not Allowed", {
          status: 405,
          headers: {
              "Allow": "POST"
          }
      })
  }