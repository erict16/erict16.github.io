// Fetches the total GitHub stars across all public repositories owned by a user,
// cached in localStorage for one hour so the GitHub API is called rarely.
const CACHE_KEY = 'erict16-gh-stars';
const CACHE_TTL = 3_600_000;
const USERNAME = 'erict16';

interface CachedStars {
  count: number;
  time: number;
}

interface RepoSummary {
  stargazers_count?: number;
}

function formatStars(count: number): string {
  if (count >= 10_000) return `${Math.round(count / 1000)}k`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(count);
}

async function fetchTotalStars(): Promise<number | null> {
  let total = 0;
  for (let page = 1; page <= 5; page++) {
    const response = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner&page=${page}`,
    );
    if (!response.ok) return null;
    const repos = (await response.json()) as RepoSummary[];
    if (!Array.isArray(repos)) return null;
    for (const repo of repos) {
      if (typeof repo.stargazers_count === 'number') {
        total += repo.stargazers_count;
      }
    }
    if (repos.length < 100) break;
  }
  return total;
}

export function startGitHubStars() {
  const badges = document.querySelectorAll<HTMLElement>('[data-total-stars]');
  if (badges.length === 0) return;

  const render = (count: number) => {
    const label = formatStars(count);
    for (const badge of badges) {
      const value = badge.querySelector<HTMLElement>('[data-star-count]');
      if (value) value.textContent = label;
      badge.setAttribute(
        'aria-label',
        `GitHub, ${count} ${count === 1 ? 'star' : 'stars'} across all repositories`,
      );
    }
  };

  let cached: CachedStars | null = null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) cached = JSON.parse(raw) as CachedStars;
  } catch {
    cached = null;
  }

  if (cached && Number.isFinite(cached.count)) {
    render(cached.count);
    if (Date.now() - cached.time < CACHE_TTL) return;
  }

  fetchTotalStars()
    .then((count) => {
      if (count === null || !Number.isFinite(count)) return;
      render(count);
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ count, time: Date.now() }),
        );
      } catch {
        // Ignore storage errors in private mode.
      }
    })
    .catch(() => {});
}
