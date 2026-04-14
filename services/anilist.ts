import { API_ENDPOINTS } from "@/lib/constants";
import type { AnimeCatalogEntry } from "@/types/game";

interface AniListResponse {
  data?: {
    Page?: {
      media?: Array<{
        id: number;
        popularity: number;
        title: {
          english?: string | null;
          romaji: string;
          native?: string | null;
        };
        synonyms?: string[] | null;
        coverImage?: {
          extraLarge?: string | null;
          large?: string | null;
        } | null;
        bannerImage?: string | null;
        format?: string | null;
        seasonYear?: number | null;
        meanScore?: number | null;
        siteUrl?: string | null;
      }> | null;
    };
  };
}

const ANILIST_QUERY = `
  query CatalogPage($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: ANIME
        sort: POPULARITY_DESC
        format_not_in: [MUSIC, NOVEL, ONA]
        isAdult: false
      ) {
        id
        popularity
        title {
          english
          romaji
          native
        }
        synonyms
        coverImage {
          extraLarge
          large
        }
        bannerImage
        format
        seasonYear
        meanScore
        siteUrl
      }
    }
  }
`;

export async function fetchAniListCatalogPage(page: number, perPage = 50) {
  const response = await fetch(API_ENDPOINTS.anilist, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: ANILIST_QUERY,
      variables: { page, perPage },
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed with ${response.status}`);
  }

  const payload = (await response.json()) as AniListResponse;
  const media = payload.data?.Page?.media ?? [];

  return media
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .map<AnimeCatalogEntry>((entry) => ({
      id: entry.id,
      popularity: entry.popularity,
      titles: entry.title,
      synonyms: entry.synonyms ?? [],
      coverImage: entry.coverImage?.extraLarge ?? entry.coverImage?.large ?? "",
      bannerImage: entry.bannerImage,
      format: entry.format,
      seasonYear: entry.seasonYear,
      meanScore: entry.meanScore,
      siteUrl: entry.siteUrl,
    }))
    .filter((entry) => Boolean(entry.coverImage));
}
