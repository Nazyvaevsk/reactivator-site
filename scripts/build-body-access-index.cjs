const fs = require("fs");
const path = require("path");

const root = process.cwd();

const indexPath = path.join(
  root,
  "public",
  "body-dimensions",
  "body-dimensions-index.json"
);

const outputDir = path.join(
  root,
  "private",
  "body-dimensions"
);

const outputPath = path.join(
  outputDir,
  "access-index.json"
);

const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

const groups = {};

for (const brand of index.brands) {
  for (const model of brand.models) {
    for (const year of model.years) {
      for (const groupRef of year.groups) {
        const groupJsonPath = path.join(
          root,
          "public",
          "body-dimensions",
          groupRef.data
        );

        if (!fs.existsSync(groupJsonPath)) {
          console.warn(`Нет JSON: ${groupRef.data}`);
          continue;
        }

        const group = JSON.parse(
          fs.readFileSync(groupJsonPath, "utf8")
        );

        groups[group.groupId] = {
          groupId: group.groupId,
          make: group.make,
          model: group.model,
          year: group.year,
          variant: group.variant || "",
          sheetCount: group.sheetCount,
          sheets: group.sheets,
        };
      }
    }
  }
}

fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      schemaVersion: 1,
      groupCount: Object.keys(groups).length,
      groups,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`OK: ${Object.keys(groups).length} комплектов`);
console.log(outputPath);
