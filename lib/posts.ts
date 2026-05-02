import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export type PostFrontmatter = {
  title: string;
  date: string;
  lastUpdated: string;
  time: string;
  tags: string[];
};

export type PostListItem = PostFrontmatter & {
  slug: string;
  excerpt: string;
};

export type PostSource = PostFrontmatter & {
  slug: string;
  content: string;
};

function normalizeExcerpt(content: string) {
  const firstParagraph = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .find((paragraph) => paragraph.length > 0 && !paragraph.startsWith('#'));

  const snippet = (firstParagraph ?? content)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[>*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return snippet.length > 160 ? `${snippet.slice(0, 157)}...` : snippet;
}

export async function getAllPosts(): Promise<PostListItem[]> {
  const files = await fs.readdir(postsDirectory);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, '');
        const filePath = path.join(postsDirectory, file);
        const source = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(source);
        const frontmatter = data as PostFrontmatter;

        return {
          slug,
          ...frontmatter,
          excerpt: normalizeExcerpt(content),
        } satisfies PostListItem;
      }),
  );

  return posts.sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

export async function getAllPostSlugs() {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getPostSource(slug: string): Promise<PostSource | null> {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(source);

    return {
      slug,
      content,
      ...(data as PostFrontmatter),
    };
  } catch {
    return null;
  }
}