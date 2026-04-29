import { getAllPosts } from "@/lib/posts";
import { PostExplorer } from "./components/post-explorer";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="relative overflow-hidden">
      <div className="fixed inset-0 starfield pointer-events-none opacity-40" aria-hidden="true" />
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(244, 114, 182, 0.14), transparent 34%), radial-gradient(circle at 80% 18%, rgba(168, 85, 247, 0.12), transparent 30%), radial-gradient(circle at 50% 75%, rgba(59, 130, 246, 0.08), transparent 28%)',
        }}
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-24 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm uppercase tracking-[0.4em] text-nocturnal-primary/70">
            nocturnal notes
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
            Nocturnalia
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            a journal of things i do during nights where i couldn&apos;t sleep
          </p>
          <div className="mt-10 h-px w-40 bg-gradient-to-r from-nocturnal-primary via-nocturnal-secondary to-transparent" />
        </div>

        <section className="mt-20 max-w-5xl">
          <PostExplorer posts={posts} />
        </section>
      </section>
    </main>
  );
}
