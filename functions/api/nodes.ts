import {D1PreparedStatement, PagesFunction} from "@cloudflare/workers-types";

import {Node, User, Env, cfg} from "../types";




interface AppStat {
    traffic: { [key: string]: number };//uuid -> KB number
    hostname: string;
    sub_addresses: string[];
    req_count: number;
    goroutine: number;
    version_info: string,
}


export const onRequestGet: PagesFunction<Env> = async (context) => {
    const token = context.request.headers.get("authorization") || '';
    const url = new URL(context.request.url);
    const params = url.searchParams;
    const offset = parseInt(params.get("offset") || cfg.offset)
    const limit = parseInt(params.get("limit") || cfg.limit)
    const db = context.env.DB;
    const nowTs = Math.floor(Date.now() / 1000) - 3600 * 24
    const qq = "SELECT * FROM nodes WHERE active_ts > ? ORDER BY active_ts DESC LIMIT ? OFFSET ?"
    const {results} = await db.prepare(qq).bind(nowTs, limit, offset).all<Node>();

    return new Response(JSON.stringify(results), {
        headers: {"content-type": "application/json"},
    });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const token = context.request.headers.get("authorization") || '';
    //todo::check token
    const db = context.env.DB;
    const body = await context.request.json<AppStat>();
    const nowTs = Math.floor(Date.now() / 1000)

    const clientIP = context.request.headers.get("cf-connecting-ip") || '';
    const sub_addresses = body.sub_addresses.join(",")
    await db.prepare("DELETE FROM nodes WHERE ip = ?").bind(clientIP).run();
    const qq = "INSERT INTO nodes (hostname, ip, req_count, active_ts, goroutine, version_info,sub_addresses) VALUES (?, ?, ?, ?, ?, ?, ?)"
    await db.prepare(qq).bind(body.hostname, clientIP, body.req_count, nowTs, body.goroutine, body.version_info, sub_addresses).run();

    const qqq = "SELECT * FROM users WHERE expire_ts > ? AND available_kb > ?"
    const {results} = await db.prepare(qqq).bind(nowTs, 0).all<User>();

    const allowUsers: { [key: string]: number } = {}
    const stmtList: D1PreparedStatement[] = []
    const nowDate = new Date().toISOString().slice(0, 10);
    for (const u of results) {
        const id = u.id
        let usedKB = body.traffic[id] || 0;
        if (usedKB < 0) {
            usedKB = 0
        }
        u.available_kb = u.available_kb - usedKB
        if (u.available_kb < 0) {
            u.available_kb = 0
        }else{
            allowUsers[id] = u.available_kb
        }
        if (!usedKB) continue;
        const userKbUpdate = db.prepare("UPDATE users SET available_kb = ? WHERE id = ?").bind(u.available_kb,id)
        const stmtUsageInsert = db.prepare("INSERT INTO usages (uid,kb,created_date,category) VALUES (?,?,?,?)").bind(id, usedKB, nowDate, 'raw')

        stmtList.push(userKbUpdate)
        stmtList.push(stmtUsageInsert)
    }
    if(stmtList.length>0){
        await db.batch(stmtList)
    }
    return new Response(JSON.stringify(allowUsers), {
        headers: {"content-type": "application/json"},
    });
};


export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const token = context.request.headers.get("authorization") || '';
    const body = await context.request.json<Node>();
    const db = context.env.DB;
    const q = "DELETE FROM nodes WHERE ip = ? AND hostname = ?";
    await db.prepare(q).bind(body.ip, body.hostname).run();
    return new Response(JSON.stringify(body), {
        headers: {"content-type": "application/json"},
    });
};
