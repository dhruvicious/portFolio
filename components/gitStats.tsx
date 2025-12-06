"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

type GithubAggregated = {
  totals: {
    stars: number;
    forks: number;
    watchers: number;
    openIssues: number;
    repoCount: number;
  };
  languages: {
    absolute: Record<string, number>;
    percentages: Record<string, number>;
  };
};

const TOTAL_LABELS: Record<string, string> = {
  stars: "Stars",
  forks: "Forks",
  watchers: "Watchers",
  openIssues: "Open Issues",
  repoCount: "Repositories",
};

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#A855F7",
  "#06B6D4",
  "#84CC16",
];

const useScreenSize = () => {
  const [isLarge, setIsLarge] = useState(true);

  useEffect(() => {
    const checkSize = () => setIsLarge(window.innerWidth >= 1280);
    checkSize();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkSize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isLarge;
};

const GlassCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-black/10 dark:border-white/20 shadow-lg rounded-2xl hover:shadow-xl transition-all">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-center text-gray-900 dark:text-white drop-shadow">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="h-80 flex items-center justify-center">
      {children}
    </CardContent>
  </Card>
);

export default function GithubDashboard() {
  const [data, setData] = useState<GithubAggregated | null>(null);
  const [loading, setLoading] = useState(true);
  const isLarge = useScreenSize();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/github", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processedData = useMemo(() => {
    if (!data) return null;

    const totalsData = Object.entries(data.totals)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        name: TOTAL_LABELS[key] ?? key,
        value,
      }));

    const filteredAbsolute = Object.fromEntries(
      Object.entries(data.languages.absolute).filter(
        ([lang, count]) =>
          lang.toLowerCase() !== "jupyter notebook" && count > 0,
      ),
    );

    const totalAbsolute = Object.values(filteredAbsolute).reduce(
      (sum, val) => sum + val,
      0,
    );

    const languagePercentageData = Object.entries(filteredAbsolute)
      .map(([lang, count]) => ({
        name: lang,
        value: totalAbsolute > 0 ? (count / totalAbsolute) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return { totalsData, languagePercentageData };
  }, [data]);

  if (loading || !data || !processedData) {
    return (
      <div
        className={`w-full grid gap-6 ${
          isLarge ? "grid-cols-3" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        <GlassCard title="Repository Metrics">
          <div className="w-full space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-6 bg-black/10 dark:bg-white/20 rounded animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Languages Used">
          <div
            className="w-32 h-32 bg-black/10 dark:bg-white/20 rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </GlassCard>

        {isLarge && (
          <GlassCard title="Top Languages">
            <div className="w-full space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-black/10 dark:bg-white/20 rounded-full animate-pulse" />
                  <div className="flex-1 h-4 bg-black/10 dark:bg-white/20 rounded animate-pulse" />
                  <div className="w-12 h-4 bg-black/10 dark:bg-white/20 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    );
  }

  const { totalsData, languagePercentageData } = processedData;

  const tooltipStyle = {
    backgroundColor: "rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: "12px",
    padding: "10px 14px",
  };

  return (
    <div
      className={`w-full grid gap-6 ${
        isLarge ? "grid-cols-3" : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {/* Repository Metrics */}
      <Card className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-black/10 dark:border-white/20 shadow-lg rounded-2xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center text-gray-900 dark:text-white drop-shadow">
            Repository Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={totalsData} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
                className="dark:stroke-white/20"
              />
              <XAxis
                dataKey="name"
                stroke="currentColor"
                className="text-gray-800 dark:text-gray-200"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="currentColor"
                className="text-gray-800 dark:text-gray-200"
                fontSize={12}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#fff", fontWeight: "500" }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Languages Chart */}
      <Card className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-black/10 dark:border-white/20 shadow-lg rounded-2xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center text-gray-900 dark:text-white drop-shadow">
            Languages Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={languagePercentageData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={110}
                innerRadius={60}
              >
                {languagePercentageData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number, name: string) => [
                  `${val.toFixed(1)}%`,
                  name,
                ]}
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#fff", fontWeight: "500" }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "20px",
                  color: "currentColor",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Languages Card - Only on large screens */}
      {isLarge && (
        <Card className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-black/10 dark:border-white/20 shadow-lg rounded-2xl hover:shadow-2xl transition-all">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-center text-gray-900 dark:text-white drop-shadow">
              Top Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {languagePercentageData.slice(0, 5).map((lang, index) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {lang.name}
                    </span>
                  </div>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {lang.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
