import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";
const ALLOWED_ORIGIN = "bedhruvicious.co.in"

// GitHub API response types
interface GitHubProfile {
	name: string | null;
	login: string;
	avatar_url: string;
	bio: string | null;
	followers: number;
	following: number;
	public_repos: number;
}

interface GitHubRepo {
	name: string;
	stargazers_count: number;
	forks_count: number;
	watchers_count: number;
	open_issues_count: number;
}

type GitHubLanguages = Record<string, number>;

// Generic fetch with authentication and typed response
async function fetchWithAuth<T>(url: string): Promise<T> {
	const res = await fetch(url, {
		headers: {
			Authorization: `token ${process.env.GITHUB_TOKEN}`,
			"User-Agent": "nextjs-app",
		},
		cache: "no-store",
	});
	if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
	return res.json() as Promise<T>;
}

export async function GET(req: Request) {
	const origin = req.headers.get("origin") || req.headers.get("referer");
	if (!origin || !origin.startsWith(ALLOWED_ORIGIN)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const username = "dhruvicious";

	try {
		// 1. User profile
		const profile = await fetchWithAuth<GitHubProfile>(
			`${GITHUB_API}/users/${username}`
		);

		// 2. All repos (first page, 100 max — extend with pagination if needed)
		const repos = await fetchWithAuth<GitHubRepo[]>(
			`${GITHUB_API}/users/${username}/repos?per_page=100`
		);

		let totalStars = 0;
		let totalForks = 0;
		let totalWatchers = 0;
		let totalOpenIssues = 0;
		let languageTotals: Record<string, number> = {};

		// 3. Fetch languages for all repos in parallel
		const langPromises = repos.map((repo) =>
			fetchWithAuth<GitHubLanguages>(
				`${GITHUB_API}/repos/${username}/${repo.name}/languages`
			)
		);
		const langResults = await Promise.all(langPromises);

		// 4. Aggregate repo stats and language totals
		repos.forEach((repo: GitHubRepo, idx: number) => {
			totalStars += repo.stargazers_count;
			totalForks += repo.forks_count;
			totalWatchers += repo.watchers_count;
			totalOpenIssues += repo.open_issues_count;

			const repoLangs = langResults[idx];
			for (const [lang, bytes] of Object.entries(repoLangs)) {
				languageTotals[lang] =
					(languageTotals[lang] || 0) + (bytes as number);
			}
		});

		// 5. Compute language percentages
		const totalBytes = Object.values(languageTotals).reduce(
			(a, b) => a + b,
			0
		);
		const languagePercentages: Record<string, number> = {};
		for (const [lang, bytes] of Object.entries(languageTotals)) {
			languagePercentages[lang] = (bytes / totalBytes) * 100;
		}

		// 6. Return aggregated result
		const aggregated = {
			profile: {
				name: profile.name,
				login: profile.login,
				avatar: profile.avatar_url,
				bio: profile.bio,
				followers: profile.followers,
				following: profile.following,
				publicRepos: profile.public_repos,
			},
			totals: {
				stars: totalStars,
				forks: totalForks,
				watchers: totalWatchers,
				openIssues: totalOpenIssues,
				repoCount: repos.length,
			},
			languages: {
				absolute: languageTotals,
				percentages: languagePercentages,
			},
		};

		return NextResponse.json(aggregated);
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}