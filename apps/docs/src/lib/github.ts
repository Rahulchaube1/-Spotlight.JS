const formatter = Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const defaultStarCount = 0;
let starCount: number | undefined = undefined;

export async function countStars(repo = "Rahulchaube1/-Spotlight.JS"): Promise<number> {
  if (starCount !== undefined) {
    return starCount;
  }

  try {
    const repoData = await fetch(`https://api.github.com/repos/${repo}`);
    const json = await repoData.json();

    starCount = (json.stargazers_count !== undefined) ? Number(json.stargazers_count) : defaultStarCount;
  } catch (e) {
    console.log("Failed to fetch stars", e);
    starCount = defaultStarCount;
  }

  return starCount;
}

export async function getFormattedStars(repo = "Rahulchaube1/-Spotlight.JS"): Promise<string> {
  const stars = await countStars(repo);
  return formatter.format(stars);
}
