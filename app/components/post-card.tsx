import Link from 'next/link';
import type { PostListItem } from '@/lib/posts';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group rounded-3xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:border-nocturnal-primary/30 hover:bg-white/8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <h3 className="text-md font-light text-white transition group-hover:text-nocturnal-primary md:text-xl lg:text-2xl">
            {post.title}
          </h3>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            Last Updated: {formatDate(post.lastUpdated)}
          </p>
        </div>

        <span className="text-sm font-normal text-nocturnal-secondary transition group-hover:text-nocturnal-primary">
          view entry
        </span>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-lg text-slate-400">
        {post.excerpt}
      </p>
    </Link>
  );
}