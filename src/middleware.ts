import { NextRequest, NextResponse } from "next/server";
// import Cookies from 'js-cookie';

export function middleware(request: NextRequest) {
    // const url = request.nextUrl.clone();
    // const cookie = request.cookies.get('address');
    // if (url.pathname === "/" && cookie) {
    //     url.pathname = '/home';
    //     return NextResponse.redirect(url);
    // }else if (url.pathname === "/home" && !cookie) {
    //     url.pathname = '/';
    //     return NextResponse.redirect(url);
    // }
    // return NextResponse.next();

}

// export const config = {
//     matcher: [ '/', '/home', '/marketplace', '/profile' ],
// };