/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS script. */
const fs = require("node:fs");
const path = require("node:path");
const { parseArgs } = require("node:util");
const root = path.resolve(__dirname, "..");
const translit = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
function slugify(title) { return [...title.toLowerCase()].map(c => translit[c] ?? c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100).replace(/-$/, ""); }
function createPost({ title, type = "article" }, directory = root) {
  if (!["article", "news"].includes(type)) throw new Error("Тип: article или news");
  if (!title?.trim()) throw new Error('Укажите заголовок: npm run content:new -- --title "Название статьи"');
  const base = slugify(title);
  if (!base) throw new Error("В заголовке нужны русские или латинские буквы либо цифры");
  let slug = base, count = 2;
  while (["articles", "news"].some(folder => fs.existsSync(path.join(directory, "content", folder, slug + ".md")))) slug = base + "-" + count++;
  const file = path.join(directory, "content", type === "article" ? "articles" : "news", slug + ".md");
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Omsk", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const fields = { title: title.trim(), description: "Кратко опишите, чем полезен материал.", date, slug, type, published: false };
  const text = "---\n" + Object.entries(fields).map(([key, value]) => key + ": " + JSON.stringify(value)).join("\n") + "\n---\n\nНапишите вступление.\n\n## Что важно знать\n\nДобавьте основной текст.\n";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, { encoding: "utf8", flag: "wx" });
  return file;
}
if (require.main === module) {
  try {
    const { values } = parseArgs({ options: { title: { type: "string" }, type: { type: "string", default: "article" }, help: { type: "boolean" } } });
    if (values.help) console.log('Статья: npm run content:new -- --title "Название"\nНовость: npm run content:new -- --type news --title "Название"');
    else console.log("Создан черновик: " + createPost(values) + "\nЗаполните текст и description. Для публикации замените published: false на published: true, затем выполните npm run build.");
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { createPost, slugify };

