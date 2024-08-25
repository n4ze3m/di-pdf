import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";

export const withAuth = <T>(
    loader: (args: LoaderFunctionArgs & { userId: string }) => Promise<T>
) => {
    return async (args: LoaderFunctionArgs & { userId: string }) => {
        const session = await getSession(args.request.headers.get("Cookie"));
        if (!session.has("userId")) {
            return redirect("/login");
        }
        return loader({
            ...args,
            userId: session.get("userId") || ""
        });
    };
};


export const withAuthAction = <T>(
    action: (args: ActionFunctionArgs & { userId: string }) => Promise<T>
) => {
    return async (args: ActionFunctionArgs & { userId: string }) => {
        const session = await getSession(args.request.headers.get("Cookie"));
        if (!session.has("userId")) {
            return json({
                error: "Unauthorized",
            });
        }
        return action({
            ...args,
            userId: session.get("userId") || ""
        });
    };
}