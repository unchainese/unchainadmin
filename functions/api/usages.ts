import {PagesFunction} from "@cloudflare/workers-types";
import {cfg, Env, Usage} from "../types";


export const onRequestGet: PagesFunction<Env> = async (context) => {
    const token = context.request.headers.get("authorization") || '';


    const url = new URL(context.request.url);
    const params = url.searchParams;
    const offset = parseInt(params.get("offset") || cfg.offset)
    const limit = parseInt(params.get("limit") || cfg.limit)
    const db = context.env.DB;
    const nowDate = new Date().toISOString().slice(0, 10);
    const qq = "SELECT * FROM usages WHERE created_date <= ? ORDER BY created_date DESC LIMIT ? OFFSET ?"
    const {results} = await db.prepare(qq).bind(nowDate, limit, offset).all<Usage>();

    return new Response(JSON.stringify(results), {
        headers: {"content-type": "application/json"},
    });
};