/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS script. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { createPost } = require("./content-new.cjs");
const exportsObject = {};
const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, "../lib/knowledge.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
let contentRoot = path.resolve(__dirname, "..");
vm.runInNewContext(code, { exports: exportsObject, require: id => id === "server-only" ? {} : require(id), process: { cwd: () => contentRoot }, console });
const { parsePost, getPosts } = exportsObject;
const realPosts = getPosts();
assert.ok(realPosts.filter(p => p.type === "article").length >= 5);
assert.ok(realPosts.some(p => p.type === "news"));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "reactivator-content-"));
try {
  contentRoot = temp;
  fs.mkdirSync(path.join(temp, "content/news"), { recursive: true });
  const file = createPost({ title: "Новая статья: геометрия кузова" }, temp);
  const text = fs.readFileSync(file, "utf8");
  const post = parsePost(text, path.basename(file), "article");
  assert.equal(post.slug, "novaya-statya-geometriya-kuzova");
  assert.equal(getPosts().length, 0, "Черновик скрыт");
  fs.writeFileSync(file, text.replace("published: false", "published: true"));
  assert.equal(getPosts().length, 1, "Публикация видна");
  const second = createPost({ title: "Новая статья: геометрия кузова", type: "news" }, temp);
  assert.ok(second.endsWith("-2.md"), "Slug уникален между типами");
  assert.throws(() => parsePost(text.replace(post.date, "2026-02-30"), path.basename(file), "article"), /date/);
  assert.throws(() => parsePost(text.replace(post.slug, "..\/secret"), path.basename(file), "article"), /slug/);
  assert.throws(() => parsePost(text, path.basename(file), "news"), /type/);
  assert.throws(() => parsePost(text.replace('title:', 'unknown:'), path.basename(file), "article"), /Неизвестное/);
  assert.throws(() => createPost({ title: "Test", type: "other" }, temp), /Тип/);
  fs.copyFileSync(file, path.join(temp, "content/news", path.basename(file)));
  const duplicate = path.join(temp, "content/news", path.basename(file));
  fs.writeFileSync(duplicate, fs.readFileSync(duplicate, "utf8").replace('"article"', '"news"'));
  assert.throws(() => getPosts(), /Повторный slug/);
  console.log("Knowledge checks passed: " + realPosts.length + " publications; drafts, validation, collisions and generator verified.");
} finally { fs.rmSync(temp, { recursive: true, force: true }); }

