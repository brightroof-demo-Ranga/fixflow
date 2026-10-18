import type { ReactNode } from "react";
import { missingFieldSentences } from "./request-fields";

export function CustomerRequestScreen({
  missing = [],
  notice,
  requestId,
  form,
}: {
  missing?: string[];
  notice?: string;
  requestId?: string;
  form?: ReactNode;
}) {
  if (requestId) {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Request received</h1>
        <p>Request id {requestId}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Log a problem</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Enter a phone number, a system ID, and a problem description. No account is required.
      </p>
      {notice ? (
        <p role="alert" className="text-sm">
          {notice}
        </p>
      ) : missing.length > 0 ? (
        <p role="alert" className="text-sm">
          {missingFieldSentences(missing)}
        </p>
      ) : null}
      {form}
    </section>
  );
}

export function renderCustomerRequestScreen(props: { missing?: string[]; requestId?: string }) {
  return <CustomerRequestScreen missing={props.missing} requestId={props.requestId} />;
}
