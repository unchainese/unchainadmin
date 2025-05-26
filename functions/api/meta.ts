import {PagesFunction} from "@cloudflare/workers-types";
import { Env } from "../types";


export const onRequestGet: PagesFunction<Env> = async (context) => {

    const results = {"1":93}
    return new Response(JSON.stringify(results), {
        headers: {"content-type": "application/json"},
    });
};