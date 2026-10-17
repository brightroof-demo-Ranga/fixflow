export function JobsList({ jobs }: { jobs: { requestId: string }[] }) {
  return (
    <section className="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Update jobs</h1>
      {jobs.length === 0 ? <p>No jobs assigned.</p> : null}
      <ul className="flex flex-col gap-3">
        {jobs.map((job) => (
          <li key={job.requestId}>
            <a className="underline" href={`/technician/jobs/${job.requestId}`}>
              Request {job.requestId}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
