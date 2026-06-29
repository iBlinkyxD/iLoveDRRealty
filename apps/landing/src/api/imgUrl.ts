export function supabaseImgUrl(url: string, width: number, quality = 75): string {
  if (!url?.includes('/storage/v1/object/public/')) return url
  const base = url.split('?')[0].replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
  return `${base}?width=${width}&quality=${quality}`
}
