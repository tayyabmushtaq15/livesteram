export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    // Handle youtu.be short links
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    const u = new URL(url);
    // Live streams or regular videos: ?v=ID
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
    // Already an embed URL
    if (u.pathname.startsWith("/embed/")) return url;
    return null;
  } catch {
    return null;
  }
}
