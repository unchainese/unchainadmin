import {D1Database,  PagesFunction} from "@cloudflare/workers-types";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

interface Env {
    DB: D1Database;
    GOOGLE_CLIENT_ID: string;
    REDIRECT_URI: string;
    GOOGLE_CLIENT_SECRET: string;
}




export const onRequestGet: PagesFunction<Env> = async ({request, env}) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const tokenResponse = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: env.REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    const tokens = await tokenResponse.json<{ access_token: string }>();
    const userInfoResponse = await fetch(USERINFO_URL, {
        headers: {Authorization: `Bearer ${tokens.access_token}`},
    });

    const userInfo = await userInfoResponse.json();
    return new Response(JSON.stringify(userInfo), {
        headers: {"Content-Type": "application/json"},
    });
}