import { withAuthAction } from "~/lib/with-auth";
import puppeteer from "puppeteer"
import { db } from "~/lib/db.server";
import { json } from "@remix-run/node";
import { compileTemplate } from "~/lib/compile-hb";

export const action = withAuthAction(async ({ request, userId }) => {
    const data = await request.json();

    const doc = await db.document.findFirst({
        where: {
            id: data.doc_id,
            user_id: userId,
        }
    })
    const activeDoc = await db.documentVersion.findFirst({
        where: {
            document_id: data.doc_id,
            active: true,
        },
    });

    if (!doc) {
        return json({
            message: "Document not found"
        }, 404)
    }

    let template = "";

    if (data?.varaibles) {
        template = compileTemplate(
            activeDoc?.html || "",
            data.varaibles
        )
    } else {
        template = compileTemplate(
            activeDoc?.html || "",
            activeDoc?.variables || ({} as any)
        )
    }

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
        timeout: 120000, // Increase timeout to 120 seconds
        protocolTimeout: 120000 // Add protocolTimeout and set it to 120 seconds
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 1200 });

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 120000 });

    const pdf = await page.pdf({
        format: "A4",
        timeout: 120000,
    });
    await browser.close();


    return new Response(pdf,
        {
            headers: {
                "Content-Type": "application/pdf",
            },
        })

})