import {D1Database, PagesFunction, crypto} from "@cloudflare/workers-types";
import {cfg, User} from "./tables";


interface Env {
    DB: D1Database;
    TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const token = context.request.headers.get("authorization") || '';
    const url = new URL(context.request.url);
    const params = url.searchParams;
    const limit = parseInt(params.get("size") || cfg.limit)
    const email = params.get("email") || ''
    const offset = (parseInt(params.get("page") || '1') - 1) * limit

    const db = context.env.DB;


    const users = await db.prepare("SELECT * FROM users LIMIT ?1 OFFSET ?2").bind(limit, offset).all<User>();
    return new Response(JSON.stringify(users.results), {
        headers: {"content-type": "application/json"},
    });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const token = context.request.headers.get("authorization") || '';
    // if (token !== context.env.TOKEN) {
    // 	return new Response("Unauthorized", {status: 401})
    // }
    const body = await context.request.json<User>();
    body.active_ts = Math.floor(Date.now() / 1000);
    if (body.expired_ts < 3600) {
        body.expired_ts = Math.floor(Date.now() / 1000) + 3600 * 24 * 30;
    }
    const db = context.env.DB;

    // language=SQL format=false
    const q = `INSERT INTO users (id,email,password,available_kb,expired_ts,active_ts) VALUES (?,?,?,?,?,?)`
    await db.prepare(q).bind(body.id, body.email, body.password, body.available_kb, body.expired_ts, body.active_ts).run();
    return new Response(JSON.stringify(body), {
        headers: {"content-type": "application/json"},
    });
};


export const onRequestPatch: PagesFunction<Env> = async (context) => {
    const token = context.request.headers.get("authorization") || '';
    // if (token !== context.env.TOKEN) {
    // 	return new Response("Unauthorized", {status: 401})
    // }
    const body = await context.request.json<User>();
    body.active_ts = Math.floor(Date.now() / 1000);
    if (body.expired_ts < 3600) {
        body.expired_ts = Math.floor(Date.now() / 1000) + 3600 * 24 * 30;
    }
    const db = context.env.DB;

    // language=SQL format=false
    const q = `UPDATE users SET email=?,password=?,available_kb=?,expired_ts=? WHERE id=?`
    await db.prepare(q).bind(body.email, body.password, body.available_kb, body.expired_ts, body.id).run();
    return new Response(JSON.stringify(body), {
        headers: {"content-type": "application/json"},
    });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const token = context.request.headers.get("authorization") || '';
    // if (token !== context.env.TOKEN) {
    // 	return new Response("Unauthorized", {status: 401})
    // }
    const body = await context.request.json<User>();
    const db = context.env.DB;

    // language=SQL format=false
    const q = `DELETE FROM users WHERE id=?`
    await db.prepare(q).bind( body.id).run();
    return new Response(JSON.stringify(body), {
        headers: {"content-type": "application/json"},
    });
};

