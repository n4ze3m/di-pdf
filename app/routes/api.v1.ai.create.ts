import { json } from "@remix-run/node";
import { withAuthAction } from "~/lib/with-auth";
import { z } from "zod";
import { generateMockData, generatePDF } from "~/lib/ibm.server";
import { db } from "~/lib/db.server";
import { generateJson } from "~/lib/extract-varaible";

const schema = z.object({
    prompt: z.string(),
})

export const action = withAuthAction(async ({ request, userId }) => {
    try {
        const body = await request.json();
        const {
            prompt
        } = schema.parse(body);


        const res = await generatePDF(prompt);

        const varaible = generateJson(res)

        // const mock = await generateMockData(JSON.stringify(varaible, null, 2))

        const doc = await db.document.create({
            data: {
                total_versions: 1,
                title: prompt.slice(0, 50),
                user_id: userId,
                docs: {
                    create: {
                        version_number: 1,
                        html: res,
                        variables: varaible,
                        active: true,
                    }
                }
            }
        })


        return json({
            id: doc.id,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return json({ errors: error.errors.map((e) => e.message) }, { status: 400 });
        }
        return json({ error: "Server error" }, { status: 500 });
    }
});