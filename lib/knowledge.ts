import "server-only";
import fs from "node:fs";
import path from "node:path";

export type KnowledgePost = {
  title: string; description: string; date: string; slug: string;
  type: "article" | "news"; published: boolean; body: string; tags?: string[];
};

// Deliberately small front matter format: one JSON value per line, not full YAML.
export function parsePost(source: string, filename: string, type: KnowledgePost["type"]): KnowledgePost {
  const fail = (message: string): never => { throw new Error(filename + ": " + message); };
  const match = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return fail("Нужны поля между строками --- и текст после них");
  const data: Record<string, unknown> = {};
  for (const line of match[1].split("\n").filter(line => line.trim())) {
    const field = line.match(/^([a-z]+):\s*(.+)$/);
    if (!field || Object.hasOwn(data, field[1])) return fail("Некорректное или повторное поле: " + line);
    if (!["title", "description", "date", "slug", "type", "published", "tags"].includes(field[1])) return fail("Неизвестное поле: " + field[1]);
    try { data[field[1]] = JSON.parse(field[2]); } catch { return fail("Значение поля " + field[1] + " должно быть JSON: текст в двойных кавычках"); }
  }
  for (const key of ["title", "description", "date", "slug", "type"]) {
    if (typeof data[key] !== "string" || !(data[key] as string).trim()) return fail("Заполните поле " + key);
  }
  const { title, description, date, slug } = data as Record<string, string>;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return fail("slug: только латиница, цифры и дефисы");
  if (path.basename(filename, ".md") !== slug) return fail("Имя файла должно совпадать со slug");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) return fail("date: укажите реальную дату YYYY-MM-DD");
  if (data.type !== type) return fail("type не соответствует папке");
  if (typeof data.published !== "boolean") return fail("published должен быть true или false");
  if (data.tags !== undefined && (!Array.isArray(data.tags) || !data.tags.every(tag => typeof tag === "string"))) return fail("tags: массив строк");
  if (!match[2].trim()) return fail("Текст материала пуст");
  return { title, description, date, slug, type, published: data.published, body: match[2].trim(), tags: data.tags as string[] | undefined };
}

export function getPosts(): KnowledgePost[] {
  const posts: KnowledgePost[] = [];
  const slugs = new Set<string>();
  for (const type of ["article", "news"] as const) {
    const directory = path.join(process.cwd(), "content", type === "article" ? "articles" : "news");
    for (const file of fs.readdirSync(directory).filter(file => file.endsWith(".md")).sort()) {
      const post = parsePost(fs.readFileSync(path.join(directory, file), "utf8"), file, type);
      if (slugs.has(post.slug)) throw new Error("Повторный slug: " + post.slug);
      slugs.add(post.slug);
      if (post.published) posts.push(post);
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getPost(slug: string) { return getPosts().find(post => post.slug === slug); }
export function formatPostDate(date: string) { return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date)); }

