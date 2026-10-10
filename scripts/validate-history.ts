import { validateHistory } from "./lib/history";

const errors = validateHistory();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("✓ Karnataka history stories, pictures and review records validated");
