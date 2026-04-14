import { API_ENDPOINTS, FIVE_SECONDS } from "@/lib/constants";
import { hashString } from "@/utils/seeded-random";
import type { ThemeSnippet } from "@/types/game";

interface AnimeThemesResponse {
  anime?: Array<{
    animethemes?: Array<{
      id: number;
      slug?: string;
      type?: string;
      song?: {
        title?: string | null;
      } | null;
      animethemeentries?: Array<{
        videos?: Array<{
          link?: string | null;
          audio?: {
            link?: string | null;
          } | null;
        }> | null;
      }> | null;
    }> | null;
  }> | null;
}

type AnimeTheme = {
  id: number;
  slug?: string;
  type?: string;
  song?: {
    title?: string | null;
  } | null;
  animethemeentries?: Array<{
    videos?: Array<{
      link?: string | null;
      audio?: {
        link?: string | null;
      } | null;
    }> | null;
  }> | null;
};

function getThemeSource(theme: AnimeTheme) {
  const entries = theme.animethemeentries ?? [];

  for (const entry of entries) {
    for (const video of entry.videos ?? []) {
      const source = video.audio?.link ?? video.link;
      if (source) {
        return source;
      }
    }
  }

  return null;
}

export async function fetchOpeningSnippet(animeId: number): Promise<ThemeSnippet | null> {
  const url = new URL("/anime", API_ENDPOINTS.animeThemes);
  url.searchParams.set("filter[has]", "resources");
  url.searchParams.set("filter[site]", "AniList");
  url.searchParams.set("filter[external_id]", String(animeId));
  url.searchParams.set(
    "include",
    "animethemes.song,animethemes.animethemeentries.videos.audio",
  );

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`AnimeThemes request failed with ${response.status}`);
  }

  const payload = (await response.json()) as AnimeThemesResponse;
  const themes = payload.anime?.[0]?.animethemes ?? [];
  const openingTheme = themes.find((theme) => theme.type === "OP" || theme.slug?.startsWith("OP"));

  if (!openingTheme) {
    return null;
  }

  const source = getThemeSource(openingTheme);

  if (!source) {
    return null;
  }

  return {
    themeId: openingTheme.id,
    source,
    previewSeed: hashString(`${animeId}:${openingTheme.id}:${FIVE_SECONDS}`),
    songTitle: openingTheme.song?.title ?? null,
  };
}
