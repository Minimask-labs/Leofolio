
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  const userType = request.cookies.get('userType')?.value; // Assuming userType is stored in cookies
  const isAuthenticated = Boolean(token);

  const currentPath = request.nextUrl.pathname;

  // Define routes based on user type
  const protectedPages = [
    '/employer',
    '/freelancer',
     '/onboarding/employer',
    '/onboarding/freelancer',
  ];
  const defaultPages = ['/'];
  const freelancerPages = ['/freelancer', '/onboarding/freelancer'];
  const employerPages = ['/employer', '/onboarding/employer'];
  const authRoutes = [
    '/auth '
  ];
  // Redirect unauthenticated users trying to access protected pages
  if (
    !isAuthenticated &&
    protectedPages.some((page) => currentPath.startsWith(page))
  ) {
    return NextResponse.redirect(new URL('/auth', request.url)); // Redirect to home
  }

   // Restrict access to pages based on user type
  if (isAuthenticated) {
    if (userType == 'employer') {
      // Merchant trying to access normal user pages
      if (freelancerPages.some((page) => currentPath.startsWith(page))) {
        return NextResponse.redirect(new URL('/employer', request.url));
      }
    } else if (userType === 'freelancer') {
      // Normal user trying to access merchant pages
      if (employerPages.some((page) => currentPath.startsWith(page))) {
        return NextResponse.redirect(new URL('/freelancer', request.url));
      }
    }
    // Prevent access to auth routes for authenticated users
    if (authRoutes.some((route) => currentPath.startsWith(route))) {
      const redirectUrl = userType === 'employer' ? '/employer' : '/freelancer';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Allow the request to proceed as usual
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)' // Apply middleware to all paths except API, static files, etc.
  ]
};
