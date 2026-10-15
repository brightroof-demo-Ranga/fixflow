import type { ReactElement } from "react";
import { SignInForm } from "../app/sign-in/sign-in-form";
import { SignOutButton } from "../app/sign-in/sign-out-button";
import { getStaffBySession } from "./session";
import { STAFF_SCREENS, type StaffPath } from "./staff-paths";

export type StaffView =
  | { screen: "sign-in" }
  | { screen: "staff"; title: string }
  | { screen: "unavailable" };

export async function loadStaffView(path: StaffPath, token: string | null): Promise<StaffView> {
  const staff = await getStaffBySession(token);
  if (!staff) {
    return { screen: "sign-in" };
  }
  if (staff.role !== STAFF_SCREENS[path].role) {
    return { screen: "unavailable" };
  }
  return { screen: "staff", title: STAFF_SCREENS[path].title };
}

export async function renderStaffScreen(path: StaffPath, token: string | null): Promise<ReactElement> {
  const view = await loadStaffView(path, token);
  if (view.screen === "staff") {
    return <StaffScreen title={view.title} />;
  }
  if (view.screen === "unavailable") {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Not available</h1>
      </section>
    );
  }
  return <SignInScreen />;
}

export function SignInScreen() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Dispatchers, technicians, and ops managers sign in with their staff email and password.
      </p>
      <SignInForm />
    </section>
  );
}

function StaffScreen({ title }: { title: string }) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <SignOutButton />
    </section>
  );
}
