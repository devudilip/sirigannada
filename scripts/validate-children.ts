import { validateChildren } from "./lib/children";

const errors = validateChildren();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("✓ Children's stories, illustrations and review records validated");
