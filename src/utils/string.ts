export function toFirstLetterLowerCase(str: string): string {
  return str[0].toLocaleLowerCase() + str.slice(1);
}
