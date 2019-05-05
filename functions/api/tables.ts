export interface User {
    id: string
    email: string
    password: string
    available_kb: number
    expired_ts: number,
    active_ts: number,
    sub_txt: string,//not a column in db, just for vless URL
}

export interface Node {
    hostname: string
    ip: string
    req_count: number
    active_ts: number
    goroutine: number;
    version_info: string,
    sub_addresses: string,// eg a.ex.com:90,b.ex.com:443,c.ex.com:8080
}

export const cfg = {
    limit: "120",
    offset: "0",
}