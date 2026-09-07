import { useState, useMemo } from 'react';
import type { Lib } from '../data/libs';

interface Props {
  libs: Lib[];
  cats: Record<string, { name: string; color: string }>;
  onSelect: (id: string) => void;
}

export function IndexPage({ libs, cats, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return libs.filter(lib => {
      const matchCat = !activeCat || lib.cat === activeCat;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        lib.name.toLowerCase().includes(q) ||
        lib.tagline.toLowerCase().includes(q) ||
        lib.kw.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [libs, search, activeCat]);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#dce5f4]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f17]/90 backdrop-blur-md border-b border-[#253149]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐍</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">
              PyLibGuide
            </h1>
          </div>
          <div className="text-sm text-[#8b98b3]">
            {libs.length} 个库 · 5 大分类
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#38bdf8] via-[#a78bfa] to-[#34d399] bg-clip-text text-transparent">
              Python 库学习指南
            </span>
          </h2>
          <p className="text-lg text-[#8b98b3] mb-8 max-w-2xl mx-auto">
            19 个常用 Python 库的完整指南：核心概念、代码示例、可视化演示、常见坑点。
            从零到工程化，一站掌握。
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto mb-6">
            <input
              type="text"
              placeholder="搜索库名、关键词（如：串口、异步、测试）..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-[#141c2c] border border-[#253149] rounded-xl text-[#dce5f4] placeholder-[#8b98b3]/60 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-[#8b98b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCat(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                !activeCat
                  ? 'bg-[#38bdf8] text-[#0b0f17] font-medium'
                  : 'bg-[#141c2c] text-[#8b98b3] hover:text-[#dce5f4] border border-[#253149]'
              }`}
            >
              全部
            </button>
            {Object.entries(cats).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setActiveCat(activeCat === key ? null : key)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  activeCat === key
                    ? 'font-medium text-[#0b0f17]'
                    : 'bg-[#141c2c] text-[#8b98b3] hover:text-[#dce5f4] border border-[#253149]'
                }`}
                style={activeCat === key ? { backgroundColor: cat.color } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#8b98b3]">
              <p className="text-4xl mb-4">🔍</p>
              <p>没有找到匹配的库</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(lib => (
                <button
                  key={lib.id}
                  onClick={() => onSelect(lib.id)}
                  className="group text-left p-5 bg-[#141c2c] border border-[#253149] rounded-xl hover:border-[#38bdf8]/50 transition-all hover:shadow-lg hover:shadow-[#38bdf8]/5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{lib.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-[#dce5f4] group-hover:text-[#38bdf8] transition-colors">
                        {lib.name}
                      </h3>
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: cats[lib.cat].color + '20', color: cats[lib.cat].color }}
                      >
                        {cats[lib.cat].name}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#8b98b3] leading-relaxed mb-3">
                    {lib.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lib.badges.slice(0, 3).map(badge => (
                      <span key={badge} className="px-2 py-0.5 bg-[#253149] rounded text-xs text-[#8b98b3]">
                        {badge}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#253149] py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#8b98b3]">
          <p>PyLibGuide — 让 Python 库学习更高效</p>
          <p className="mt-1">涵盖 Web、数据、CLI、测试、硬件 5 大领域 19 个核心库</p>
        </div>
      </footer>
    </div>
  );
}
