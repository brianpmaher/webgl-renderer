export async function httpGetText(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}
