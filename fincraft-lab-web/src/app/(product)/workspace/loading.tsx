function LoadingBlock({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-2xl bg-(--surface-paper) ${className}`} />;
}

export default function WorkspaceLoading() {
  return (
    <div data-document-page="workspace" className="mx-auto max-w-5xl space-y-6" aria-busy="true">
      <div role="status" className="sr-only">Loading workspace records</div>
      <header className="space-y-3 border-b border-(--border-subtle) pb-4">
        <LoadingBlock className="h-4 w-40" />
        <LoadingBlock className="h-9 w-72" />
        <LoadingBlock className="h-4 w-full max-w-2xl" />
      </header>
      <LoadingBlock className="h-24 w-full" />
      <LoadingBlock className="h-36 w-full" />
      <section className="surface-solid space-y-4 rounded-2xl border border-(--border-subtle) p-4 sm:p-6">
        <LoadingBlock className="h-6 w-48" />
        <LoadingBlock className="h-11 w-full" />
        <LoadingBlock className="h-28 w-full" />
      </section>
    </div>
  );
}
