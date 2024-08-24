import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "../sessions";

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    const session = await getSession(
        request.headers.get("Cookie")
    );
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
};
