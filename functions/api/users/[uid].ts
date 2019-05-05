import {D1Database, PagesFunction} from "@cloudflare/workers-types";

import {Node, User} from "../tables";


interface Env {
    DB: D1Database;
}

function genVLESS(userID: string, addrWithPort: string, hostName: string, tls: boolean): string {
    const path = encodeURIComponent("/wsv/v1?ed=2560");
    return `vless://${userID}@${addrWithPort}?encryption=none&security=${tls ? "tls" : "none"}&type=ws&host=${hostName}&sni=${hostName}&fp=random&path=${path}#${addrWithPort}`;
}

function removeDuplicates(arr: string[]): string[] {
    const map = new Map<string, boolean>();
    const result: string[] = [];

    for (const str of arr) {
        if (!map.has(str)) {
            map.set(str, true);
            result.push(str);
        }
    }

    return result;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const uid = context.params.uid as string || '';
    const db = context.env.DB;
    const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(uid).first<User>()
    if (!user) {
        return new Response("User not found", {status: 404})
    }

    const nowTs = Math.floor(Date.now() / 1000) - 3600 * 24
    const qq = "SELECT DISTINCT sub_addresses FROM nodes WHERE active_ts > ? LIMIT 100"
    const {results} = await db.prepare(qq).bind(nowTs).all<Node>();

    const hostPorts = results.map((r) => {
        return r.sub_addresses.split(",")
    }).flat().map((addr) => addr.trim());

    const subUrls = removeDuplicates(hostPorts).map((addrPort) => {
        const isTLS = addrPort.endsWith(":443")
        return genVLESS(uid, addrPort, "", isTLS)
    })
    user.sub_txt = subUrls.join("\n")
    return new Response(JSON.stringify(user), {
        headers: {"content-type": "application/json"},
    });
};