
import { NextResponse } from 'next/server'
 
export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Define protected path
  if (pathname.startsWith('/admin')) {
    
    // Exclude the login page itself to avoid infinite loop
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for auth cookie
    const authCookie = request.cookies.get('admin_auth');

    if (!authCookie || authCookie.value !== 'true') {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: '/admin/:path*',
}
