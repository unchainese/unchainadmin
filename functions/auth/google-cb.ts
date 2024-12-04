import {D1Database, PagesFunction} from "@cloudflare/workers-types";
import {User} from "../tables";

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

    const userInfo: {
        email: string,
        email_verified: true,
        picture: string,
        sub: string
    } = await userInfoResponse.json();
    const userEmail = userInfo.email||"";
    if (!userEmail) {
        console.error("email not found");
        console.error(userInfo);
        return new Response("email not found", {status: 400});
    }
    let user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(userEmail).first<User>();
    if (!user) {
        user = {
            id: crypto.randomUUID(),
            email: userEmail,
            available_kb:  1024 * 1024 * 5,
            expired_ts: Math.floor(Date.now() / 1000) + 3600 * 24 * 90,
            active_ts: Math.floor(Date.now() / 1000),
        } as User;
        const q = "INSERT INTO users (id,email, available_kb, expired_ts, active_ts) VALUES (?, ?, ?, ?, ?)"
        await env.DB.prepare(q).bind(user.id, user.email, user.expired_ts, user.expired_ts, user.active_ts).run();
    }
    //write cookie
    const cookieValue = `id=${user.id}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`;
    const redirectUrl =`https://${request.headers.get("host")}/`;
    return new Response(JSON.stringify(userInfo), {
        status: 302,
        headers: {
            "Location": redirectUrl,
            "Set-Cookie": cookieValue,
            "Content-Type": "application/json"
        },
    });
}