import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

const isLoginRoute = createRouteMatcher(["/login"]);

export default clerkMiddleware(async (auth, req) => {
  const authenticatedUser = await auth();

  if (authenticatedUser.userId) {
    return NextResponse.next();
  }

  if (isLoginRoute(req)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
