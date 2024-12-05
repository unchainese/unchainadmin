import {  PagesFunction} from "@cloudflare/workers-types";
import {Env} from "../types";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = "openid email";



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

