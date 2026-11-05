/** Back means the parent section, including when arriving through a direct link or refresh. */
export function parentDestination(pathname: string): string {
  const parts = pathname.replace(/\.html$/, "").split("/").filter(Boolean);
  if (parts.length < 2) return "/";
  if (parts[0] === "picturebooks") return "/children";
  return "/" + parts.slice(0, -1).join("/");
}
