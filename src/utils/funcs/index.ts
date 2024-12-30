export default function capitalize(str: string): string {
  console.log(str, str?.charAt(0)?.toUpperCase() + str?.slice(1));
  return str ? str?.charAt(0)?.toUpperCase() + str?.slice(1) : "";
}