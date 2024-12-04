import {D1Database,  PagesFunction} from "@cloudflare/workers-types";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = "openid email";

interface Env {
    DB: D1Database;
    GOOGLE_CLIENT_ID: string;
    REDIRECT_URI: string;
    GOOGLE_CLIENT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({request, env}) => {
    const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.REDIRECT_URI,
        response_type: "code",
        scope: SCOPES,
        access_type: "offline",
        prompt: "consent",
    });
    return Response.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}

