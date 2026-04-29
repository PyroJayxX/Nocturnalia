'use client';

import { useMemo, useState } from 'react';
import { PostCard } from './post-card';
import type { PostListItem } from '@/lib/posts';

type PostExplorerProps = {
  posts: PostListItem[];
};

function startOfDay(value: string) {
  return new Date(`${value}T00:00:00`).getTime();
}

function endOfDay(value: string) {
  return new Date(`${value}T23:59:59.999`).getTime();
}

export function PostExplorer({ posts }: PostExplorerProps) {
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const fromTime = fromDate ? startOfDay(fromDate) : null;
    const toTime = toDate ? endOfDay(toDate) : null;

    return posts.filter((post) => {
      const postTime = new Date(post.date).getTime();
      const searchable = [post.title, post.date, post.time, post.tags.join(' '), post.excerpt]
        .join(' ')
        .toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
      const matchesFrom = fromTime === null || postTime >= fromTime;
      const matchesTo = toTime === null || postTime <= toTime;

      return matchesQuery && matchesFrom && matchesTo;
    });
  }, [posts, query, fromDate, toDate]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">recent entries</p>
          <h2 className="mt-3 text-xl font-medium font-serif text-slate-100 sm:text-2xl md:text-3xl">
            Tonight, I couldn't sleep so I...
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((current) => !current)}
          className="self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.28em] text-slate-300 transition hover:border-nocturnal-primary/30 hover:text-slate-100 sm:self-end"
          aria-expanded={showFilters}
          aria-controls="post-explorer-filters"
        >
          {showFilters ? 'Hide filters' : 'Search / filters'}
        </button>
      </div>

      <section
        id="post-explorer-filters"
        className={`overflow-hidden transition-all duration-300 ${showFilters ? 'mt-6 max-h-[420px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'}`}
      >
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-4 shadow-[0_0_0_1px_rgba(129,140,248,0.06),0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-md sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.32em] text-slate-400">
                Search
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles, tags, dates, or excerpts"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-nocturnal-primary/60 focus:bg-white/8 focus:ring-2 focus:ring-nocturnal-primary/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.32em] text-slate-400">
                From
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="night-date h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-100 outline-none transition focus:border-nocturnal-primary/60 focus:bg-white/8 focus:ring-2 focus:ring-nocturnal-primary/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.32em] text-slate-400">
                To
              </span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="night-date h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-100 outline-none transition focus:border-nocturnal-primary/60 focus:bg-white/8 focus:ring-2 focus:ring-nocturnal-primary/20"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFromDate('');
                setToDate('');
              }}
              className="h-12 rounded-2xl border border-nocturnal-primary/25 bg-gradient-to-r from-nocturnal-primary/20 via-nocturnal-secondary/20 to-indigo-500/20 px-5 text-sm font-medium text-slate-100 transition hover:border-nocturnal-primary/40 hover:bg-nocturnal-primary/25"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <p>
              Showing <span className="text-slate-100">{filteredPosts.length}</span> of{' '}
              <span className="text-slate-100">{posts.length}</span> posts
            </p>
            {(query || fromDate || toDate) && (
              <p className="text-nocturnal-secondary/90">Filtered by your current search.</p>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}