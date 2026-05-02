import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getAllPostSlugs, getPostSource, type PostFrontmatter } from '@/lib/posts';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostSource(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: `${formatDate(post.date)} • ${post.time}`,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostSource(slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX<PostFrontmatter>({
    source: post.content,
    options: {
      parseFrontmatter: true,
    },
  });

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-16 text-nocturnal-text sm:px-10 lg:px-12">
      <div className="fixed inset-0 starfield pointer-events-none opacity-30" aria-hidden="true" />
      <div
        className="fixed inset-0 pointer-events-none opacity-24"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(244, 114, 182, 0.12), transparent 34%), radial-gradient(circle at 80% 18%, rgba(168, 85, 247, 0.1), transparent 30%), radial-gradient(circle at 50% 75%, rgba(59, 130, 246, 0.07), transparent 28%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl pt-6 sm:pt-10 lg:pt-14">
        <div className="mb-12 mx-auto max-w-5xl border-b border-white/10 pb-8 text-left">
          <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.35em]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 transition hover:text-slate-200"
            >
              <span aria-hidden="true">←</span>
              back
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              •
            </span>
            <p className="text-nocturnal-primary/70">nocturnalia archive</p>
          </div>
          <h1 className="mt-4 text-3xl font-extralight tracking-tight text-white sm:text-7xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
            <span>{formatDate(post.date)}</span>
            <span>Last updated: {formatDate(post.lastUpdated)}</span>
            <span>{post.time}</span>
            <span>{post.tags.join(' · ')}</span>
          </div>
        </div>

        <article className="prose prose-invert mx-auto max-w-4xl prose-headings:text-white prose-a:text-nocturnal-primary prose-strong:text-white prose-code:text-nocturnal-secondary prose-pre:border prose-pre:border-white/10 prose-pre:bg-slate-950/80 prose-blockquote:border-nocturnal-secondary/40 prose-blockquote:text-slate-300 prose-p:leading-8 prose-li:marker:text-nocturnal-primary prose-hr:border-white/10 lg:max-w-5xl">
          {content}
        </article>
      </div>
    </main>
  );
}