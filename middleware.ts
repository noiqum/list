import { headers, cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    let response = NextResponse.next()
    response.cookies.set("token", token || "")
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response
}