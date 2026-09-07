import { useState, useRef, useEffect } from 'react';
import type { Lib } from '../data/libs';
import { Demo } from '../components/Demo';

interface Props {
  lib: Lib;
  cats: Record<string, { name: string; color: string }>;
  allLibs: Lib[];
  prev: Lib | undefined;
  next: Lib | undefined;
  onNavigate: (id: string) => void;
  onHome: () => void;
}

const SECTIONS = [
  { id: 'problem', title: '解决什么问题', emoji: '🎯' },
  { id: 'scenes', title: '适用场景', emoji: '📍' },
  { id: 'concepts', title: '核心概念', emoji: '💡' },
  { id: 'install', title: '安装', emoji: '📥' },
  { id: 'examples', title: '代码示例', emoji: '💻' },
  { id: 'pitfalls', title: '常见坑点', emoji: '⚠️' },
  { id: 'relations', title: '库间关系', emoji: '🔗' },
  { id: 'demo', title: '可视化演示', emoji: '🎬' },
  { id: 'summary', title: '小结', emoji: '✅' },
];

export function LibPage({ lib, cats, allLibs, prev, next, onNavigate, onHome }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('problem');
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const accent = cats[lib.cat].color;

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    Object.values(sectionRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [lib.id]);

  useEffect(() => {
    setActiveTab(0);
  }, [lib.id]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#dce5f4]" style={{ '--accent': accent } as React.CSSProperties}>
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f17]/90 backdrop-blur-md border-b border-[#253149]">
        <div className="h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onHome}
              className="flex items-center gap-2 text-[#8b98b3] hover:text-[#dce5f4] transition-colors"
            >
              <span className="text-xl">🐍</span>
              <span className="font-bold bg-gradient-to-r from-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">
                PyLibGuide
              </span>
            </button>
            <span className="text-[#253149]">|</span>
            <span className="text-lg">{lib.icon}</span>
            <span className="font-medium">{lib.name}</span>
          </div>

          {/* Library selector dropdown */}
          <select
            value={lib.id}
            onChange={e => onNavigate(e.target.value)}
            className="hidden md:block bg-[#141c2c] border border-[#253149] rounded-lg px-3 py-1.5 text-sm text-[#dce5f4] focus:outline-none focus:border-[#38bdf8]"
          >
            {allLibs.map(l => (
              <option key={l.id} value={l.id}>{l.icon} {l.name}</option>
            ))}
          </select>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-[#8b98b3] hover:text-[#dce5f4]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-14 left-0 h-[calc(100vh-56px)] w-64 bg-[#0b0f17] border-r border-[#253149]
          overflow-y-auto z-40 transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4">
            <p className="text-xs uppercase tracking-wider text-[#8b98b3] mb-3 px-2">目录</p>
            {SECTIONS.map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollTo(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                  activeSection === sec.id
                    ? 'bg-[#141c2c] text-[#dce5f4] font-medium'
                    : 'text-[#8b98b3] hover:text-[#dce5f4] hover:bg-[#141c2c]/50'
                }`}
                style={activeSection === sec.id ? { borderLeft: `3px solid ${accent}` } : {}}
              >
                <span className="mr-2">{sec.emoji}</span>
                {sec.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
            {/* Hero */}
            <div className="mb-10">
              <button
                onClick={onHome}
                className="text-sm text-[#8b98b3] hover:text-[#38bdf8] transition-colors mb-4 inline-flex items-center gap-1"
              >
                ← 返回主页
              </button>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{lib.icon}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{lib.name}</h1>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium mt-1"
                    style={{ backgroundColor: accent + '20', color: accent }}
                  >
                    {cats[lib.cat].name}
                  </span>
                </div>
              </div>
              <p className="text-lg text-[#8b98b3] mb-4">{lib.tagline}</p>
              <div className="flex flex-wrap gap-2">
                {lib.badges.map(badge => (
                  <span key={badge} className="px-3 py-1 bg-[#141c2c] border border-[#253149] rounded-full text-sm text-[#8b98b3]">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem Section */}
            <section
              id="problem"
              ref={el => { sectionRefs.current['problem'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🎯</span> 解决什么问题
              </h2>
              <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
                <p className="text-[#dce5f4] leading-relaxed">{lib.problem}</p>
              </div>
            </section>

            {/* Scenes Section */}
            <section
              id="scenes"
              ref={el => { sectionRefs.current['scenes'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>📍</span> 适用场景
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {lib.scenes.map((scene, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#141c2c] border border-[#253149] rounded-lg p-3">
                    <span className="text-[#34d399] mt-0.5">✓</span>
                    <span className="text-sm text-[#dce5f4]">{scene}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-[#141c2c]/50 border border-[#253149]/50 rounded-lg p-3">
                <span className="text-[#fbbf24] text-sm">⚠️ 不适合：</span>
                <span className="text-sm text-[#8b98b3] ml-1">{lib.notFor}</span>
              </div>
            </section>

            {/* Concepts Section */}
            <section
              id="concepts"
              ref={el => { sectionRefs.current['concepts'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>💡</span> 核心概念
              </h2>
              <div className="bg-[#141c2c] border border-[#253149] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#253149]">
                      <th className="text-left px-4 py-3 text-sm font-medium text-[#8b98b3]">概念</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-[#8b98b3]">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lib.concepts.map((c, i) => (
                      <tr key={i} className="border-b border-[#253149]/50 last:border-0">
                        <td className="px-4 py-3 text-sm font-mono font-medium" style={{ color: accent }}>{c.term}</td>
                        <td className="px-4 py-3 text-sm text-[#8b98b3]">{c.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Install Section */}
            <section
              id="install"
              ref={el => { sectionRefs.current['install'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>📥</span> 安装
              </h2>
              <CodeBlock code={lib.install} onCopy={copyCode} copied={copied} accent={accent} />
            </section>

            {/* Examples Section */}
            <section
              id="examples"
              ref={el => { sectionRefs.current['examples'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>💻</span> 代码示例
              </h2>
              {/* Tabs */}
              <div className="flex gap-1 mb-3">
                {lib.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                      activeTab === i
                        ? 'bg-[#1a2332] text-[#dce5f4] border-b-2'
                        : 'bg-[#141c2c] text-[#8b98b3] hover:text-[#dce5f4]'
                    }`}
                    style={activeTab === i ? { borderBottomColor: accent } : {}}
                  >
                    {ex.tab}
                  </button>
                ))}
              </div>
              <CodeBlock
                code={lib.examples[activeTab]?.code || ''}
                onCopy={copyCode}
                copied={copied}
                accent={accent}
              />
            </section>

            {/* Pitfalls Section */}
            <section
              id="pitfalls"
              ref={el => { sectionRefs.current['pitfalls'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>⚠️</span> 常见坑点
              </h2>
              <div className="space-y-3">
                {lib.pitfalls.map((p, i) => (
                  <div key={i} className="bg-[#141c2c] border border-[#253149] rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-[#f87171] mt-0.5">✗</span>
                      <div>
                        <p className="font-medium text-[#dce5f4] text-sm mb-1">{p.title}</p>
                        <p className="text-sm text-[#8b98b3]">{p.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Relations Section */}
            <section
              id="relations"
              ref={el => { sectionRefs.current['relations'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🔗</span> 库间关系
              </h2>
              <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
                <p className="text-[#dce5f4] leading-relaxed">{lib.relations}</p>
              </div>
            </section>

            {/* Demo Section */}
            <section
              id="demo"
              ref={el => { sectionRefs.current['demo'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🎬</span> 可视化演示
              </h2>
              <Demo libId={lib.id} demoType={lib.demoType} accent={accent} />
            </section>

            {/* Summary Section */}
            <section
              id="summary"
              ref={el => { sectionRefs.current['summary'] = el; }}
              className="mb-10 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>✅</span> 小结
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {lib.summary.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#141c2c] border border-[#253149] rounded-lg p-3">
                    <span className="text-[#34d399] mt-0.5">✓</span>
                    <span className="text-sm text-[#dce5f4]">{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Prev/Next Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#253149]">
              {prev ? (
                <button
                  onClick={() => onNavigate(prev.id)}
                  className="flex items-center gap-3 px-4 py-3 bg-[#141c2c] border border-[#253149] rounded-xl hover:border-[#38bdf8]/50 transition-all group"
                >
                  <span className="text-[#8b98b3] group-hover:text-[#38bdf8]">←</span>
                  <div className="text-left">
                    <p className="text-xs text-[#8b98b3]">上一页</p>
                    <p className="text-sm font-medium text-[#dce5f4]">{prev.icon} {prev.name}</p>
                  </div>
                </button>
              ) : <div />}
              {next ? (
                <button
                  onClick={() => onNavigate(next.id)}
                  className="flex items-center gap-3 px-4 py-3 bg-[#141c2c] border border-[#253149] rounded-xl hover:border-[#38bdf8]/50 transition-all group"
                >
                  <div className="text-right">
                    <p className="text-xs text-[#8b98b3]">下一页</p>
                    <p className="text-sm font-medium text-[#dce5f4]">{next.icon} {next.name}</p>
                  </div>
                  <span className="text-[#8b98b3] group-hover:text-[#38bdf8]">→</span>
                </button>
              ) : <div />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function CodeBlock({ code, onCopy, copied, accent }: { code: string; onCopy: (c: string) => void; copied: boolean; accent: string }) {
  return (
    <div className="relative bg-[#0d1117] border border-[#253149] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#253149]">
        <span className="text-xs text-[#8b98b3]">python</span>
        <button
          onClick={() => onCopy(code)}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#8b98b3] hover:text-[#dce5f4] hover:bg-[#253149] transition-all"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-[#34d399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-[#c9d1d9]">{highlightPython(code)}</code>
      </pre>
    </div>
  );
}

function highlightPython(code: string): React.ReactNode {
  const lines = code.split('\n');
  return lines.map((line, i) => (
    <div key={i} className="flex">
      <span className="select-none w-8 text-right pr-4 text-[#484f58] text-xs leading-relaxed">{i + 1}</span>
      <span className="flex-1">{highlightLine(line)}</span>
    </div>
  ));
}

function highlightLine(line: string): React.ReactNode {
  // Simple syntax highlighting
  if (line.trim().startsWith('#')) {
    return <span className="text-[#8b949e] italic">{line}</span>;
  }

  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  // Keywords
  const keywords = /\b(from|import|class|def|async|await|return|if|else|elif|for|while|try|except|finally|with|as|yield|raise|pass|break|continue|and|or|not|in|is|None|True|False|self|print)\b/g;

  let lastIndex = 0;
  let match;
  const tempLine = remaining;

  // Process strings first
  const stringRegex = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
  const strings: { start: number; end: number; text: string }[] = [];
  while ((match = stringRegex.exec(tempLine)) !== null) {
    strings.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
  }

  // Process decorators
  const decoratorRegex = /(@\w+(\.\w+)*)/g;
  const decorators: { start: number; end: number; text: string }[] = [];
  while ((match = decoratorRegex.exec(tempLine)) !== null) {
    decorators.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
  }

  // Build highlighted output
  const tokens: { start: number; end: number; type: string; text: string }[] = [];
  strings.forEach(s => tokens.push({ ...s, type: 'string' }));
  decorators.forEach(d => tokens.push({ ...d, type: 'decorator' }));
  tokens.sort((a, b) => a.start - b.start);

  let pos = 0;
  tokens.forEach(token => {
    if (token.start > pos) {
      parts.push(<span key={key++}>{highlightKeywords(tempLine.slice(pos, token.start))}</span>);
    }
    if (token.type === 'string') {
      parts.push(<span key={key++} className="text-[#a5d6ff]">{token.text}</span>);
    } else if (token.type === 'decorator') {
      parts.push(<span key={key++} className="text-[#d2a8ff]">{token.text}</span>);
    }
    pos = token.end;
  });

  if (pos < tempLine.length) {
    parts.push(<span key={key++}>{highlightKeywords(tempLine.slice(pos))}</span>);
  }

  return <>{parts}</>;
}

function highlightKeywords(text: string): React.ReactNode {
  const keywords = ['from', 'import', 'class', 'def', 'async', 'await', 'return', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'yield', 'raise', 'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False', 'self'];

  const parts: React.ReactNode[] = [];
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(<span key={key++} className="text-[#ff7b72]">{match[0]}</span>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return <>{parts.length > 0 ? parts : text}</>;
}
