import { json } from "@remix-run/node";
import { db } from "~/lib/db.server";
import { withAuth } from "~/lib/with-auth";

export const loader = withAuth(async ({ userId }) => {

    const docs = await db.document.findMany({
        select: {
            id: true,
            title: true,
            total_versions: true,
        },
        where: {
            user_id: userId,
        },
        orderBy: {
            created_at: "desc",
        }
    })

    return json({
        data: docs
    });
});