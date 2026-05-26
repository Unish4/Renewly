import { SignIn } from "@clerk/react";

// Clerk's <SignIn /> is a fully built, accessible sign-in form.
// It handles email/password, Google OAuth, email verification,
// error states, and password reset out of the box.
//
// routing="path" + path="/sign-in" tells Clerk this component owns
// the /sign-in route. Clerk uses this for internal redirects
// (e.g., after email verification it knows where to send the user).
//
// afterSignInUrl="/" sends the user to the dashboard after successful login.
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn routing="path" path="/sign-in" afterSignInUrl="/" />
    </div>
  );
}
