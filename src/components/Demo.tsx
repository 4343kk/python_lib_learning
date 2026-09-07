import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  libId: string;
  demoType: string;
  accent: string;
}

export function Demo({ libId, demoType, accent }: Props) {
  switch (demoType) {
    case 'flow': return <FlowDemo accent={accent} />;
    case 'validation': return <ValidationDemo accent={accent} />;
    case 'onion': return <OnionDemo accent={accent} />;
    case 'server': return <ServerDemo accent={accent} />;
    case 'request': return <RequestDemo accent={accent} />;
    case 'timeline': return <TimelineDemo accent={accent} />;
    case 'test': return <TestDemo accent={accent} />;
    case 'cli': return <CliDemo accent={accent} />;
    case 'typer': return <TyperDemo accent={accent} />;
    case 'attrs': return <AttrsDemo accent={accent} />;
    case 'rich': return <RichDemo accent={accent} />;
    case 'jinja': return <JinjaDemo accent={accent} />;
    case 'serial': return <SerialDemo accent={accent} />;
    case 'modbus': return <ModbusDemo accent={accent} />;
    case 'pymodbus': return <PymodbusDemo accent={accent} />;
    case 'visa': return <VisaDemo accent={accent} />;
    case 'pdf': return <PdfDemo accent={accent} />;
    case 'packaging': return <PackagingDemo accent={accent} />;
    case 'playwright': return <PlaywrightDemo accent={accent} />;
    default: return <DefaultDemo />;
  }
}

function DefaultDemo() {
  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-8 text-center text-[#8b98b3]">
      <p className="text-4xl mb-3">🎬</p>
      <p>交互式演示</p>
    </div>
  );
}

// Terminal component shared by many demos
function Terminal({ lines, accent }: { lines: { text: string; cls?: string }[]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  return (
    <div ref={ref} className="bg-[#0d1117] border border-[#253149] rounded-lg p-3 font-mono text-sm max-h-64 overflow-y-auto">
      {lines.map((line, i) => (
        <div key={i} className={`leading-relaxed ${
          line.cls === 'ok' ? 'text-[#34d399]' :
          line.cls === 'err' ? 'text-[#f87171]' :
          line.cls === 'warn' ? 'text-[#fbbf24]' :
          line.cls === 'dim' ? 'text-[#484f58]' :
          line.cls === 'hl' ? 'text-[#38bdf8]' :
          'text-[#c9d1d9]'
        }`}>
          {line.text}
        </div>
      ))}
      {lines.length === 0 && <span className="text-[#484f58]">$ 等待操作...</span>}
    </div>
  );
}

// Flow Demo (FastAPI)
function FlowDemo({ accent }: { accent: string }) {
  const [step, setStep] = useState(-1);
  const [valid, setValid] = useState(true);
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);

  const nodes = ['客户端', '路由匹配', '参数解析', 'Pydantic 校验', '依赖注入', '处理函数'];
  const goodSteps = [
    { node: 0, msg: '→ GET /items/42', cls: 'hl' },
    { node: 1, msg: '✓ 匹配路由: GET /items/{item_id}', cls: 'ok' },
    { node: 2, msg: '✓ 解析参数: item_id=42', cls: 'ok' },
    { node: 3, msg: '✓ Pydantic 校验通过', cls: 'ok' },
    { node: 4, msg: '✓ 注入依赖: db_session', cls: 'ok' },
    { node: 5, msg: '✓ 返回 200: {"item_id": 42}', cls: 'ok' },
  ];
  const badSteps = [
    { node: 0, msg: '→ GET /items/abc', cls: 'hl' },
    { node: 1, msg: '✓ 匹配路由: GET /items/{item_id}', cls: 'ok' },
    { node: 2, msg: '✗ 参数解析失败: "abc" 不是 int', cls: 'err' },
    { node: 2, msg: '→ 返回 422 Unprocessable Entity', cls: 'err' },
  ];

  const run = useCallback(async () => {
    setStep(-1);
    setLogs([]);
    const steps = valid ? goodSteps : badSteps;
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setStep(steps[i].node);
      setLogs(prev => [...prev, { text: steps[i].msg, cls: steps[i].cls }]);
    }
  }, [valid]);

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setValid(true)} className={`px-3 py-1 rounded text-sm ${valid ? 'bg-[#34d399]/20 text-[#34d399]' : 'bg-[#253149] text-[#8b98b3]'}`}>
          合法请求
        </button>
        <button onClick={() => setValid(false)} className={`px-3 py-1 rounded text-sm ${!valid ? 'bg-[#f87171]/20 text-[#f87171]' : 'bg-[#253149] text-[#8b98b3]'}`}>
          非法请求
        </button>
        <button onClick={run} className="px-4 py-1 rounded text-sm font-medium text-[#0b0f17]" style={{ backgroundColor: accent }}>
          ▶ 运行
        </button>
      </div>
      {/* Flow nodes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {nodes.map((node, i) => (
          <div key={i} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border transition-all ${
            step === i ? (valid ? 'border-[#34d399] bg-[#34d399]/10 text-[#34d399]' : 'border-[#f87171] bg-[#f87171]/10 text-[#f87171]') :
            step > i ? 'border-[#253149] bg-[#253149]/50 text-[#8b98b3]' :
            'border-[#253149] text-[#8b98b3]'
          }`}>
            {step >= i && <span>{valid ? '✓' : (step === i && i >= 2 ? '✗' : '✓')}</span>}
            {node}
          </div>
        ))}
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// Validation Demo (Pydantic)
function ValidationDemo({ accent }: { accent: string }) {
  const [json, setJson] = useState('{"id": 123, "name": "Alice", "email": "alice@example.com", "age": 25}');
  const [result, setResult] = useState<{ valid: boolean; data?: any; errors?: any[] }>({ valid: true });

  const validate = () => {
    try {
      const data = JSON.parse(json);
      const errors: any[] = [];
      if (typeof data.id !== 'number') errors.push({ field: 'id', msg: '必须是整数' });
      if (typeof data.name !== 'string' || data.name.length < 2) errors.push({ field: 'name', msg: '至少2个字符' });
      if (typeof data.email !== 'string' || !data.email.includes('@')) errors.push({ field: 'email', msg: '无效邮箱' });
      if (typeof data.age !== 'number' || data.age < 0 || data.age > 150) errors.push({ field: 'age', msg: '范围 0-150' });
      setResult(errors.length ? { valid: false, errors } : { valid: true, data });
    } catch {
      setResult({ valid: false, errors: [{ field: 'json', msg: 'JSON 解析错误' }] });
    }
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-[#8b98b3] mb-1 block">输入 JSON：</label>
          <textarea
            value={json}
            onChange={e => setJson(e.target.value)}
            className="w-full h-32 bg-[#0d1117] border border-[#253149] rounded-lg p-3 font-mono text-sm text-[#c9d1d9] focus:outline-none focus:border-[#38bdf8]"
          />
        </div>
        <div>
          <label className="text-sm text-[#8b98b3] mb-1 block">校验结果：</label>
          <div className={`h-32 bg-[#0d1117] border rounded-lg p-3 font-mono text-sm overflow-auto ${
            result.valid ? 'border-[#34d399]/50' : 'border-[#f87171]/50'
          }`}>
            {result.valid && result.data ? (
              <div>
                <span className="text-[#34d399]">✓ 校验通过</span>
                <pre className="mt-2 text-[#c9d1d9] text-xs">{JSON.stringify(result.data, null, 2)}</pre>
              </div>
            ) : result.errors ? (
              <div>
                <span className="text-[#f87171]">✗ 校验失败</span>
                {result.errors.map((e, i) => (
                  <div key={i} className="mt-1 text-[#f87171] text-xs">
                    {e.field}: {e.msg}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <button onClick={validate} className="px-4 py-2 rounded text-sm font-medium text-[#0b0f17]" style={{ backgroundColor: accent }}>
        校验数据
      </button>
    </div>
  );
}

// Onion Demo (Starlette middleware)
function OnionDemo({ accent }: { accent: string }) {
  const [step, setStep] = useState(-1);
  const [path, setPath] = useState('/api/data');
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);

  const layers = ['Auth 中间件', 'CORS 中间件', 'Timing 中间件', '路由处理'];

  const run = async () => {
    setStep(-1);
    setLogs([]);
    const isAdmin = path.startsWith('/admin');

    // Request in
    for (let i = 0; i < layers.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setStep(i);
      setLogs(prev => [...prev, { text: `→ 进入 ${layers[i]}`, cls: 'hl' }]);
      if (isAdmin && i === 0) {
        await new Promise(r => setTimeout(r, 500));
        setLogs(prev => [...prev, { text: '✗ 401 Unauthorized - 需要认证', cls: 'err' }]);
        // Response out
        for (let j = i - 1; j >= 0; j--) {
          await new Promise(r => setTimeout(r, 300));
          setLogs(prev => [...prev, { text: `← 离开 ${layers[j]}`, cls: 'dim' }]);
        }
        return;
      }
    }
    // Response out
    setLogs(prev => [...prev, { text: '✓ 200 OK', cls: 'ok' }]);
    for (let i = layers.length - 2; i >= 0; i--) {
      await new Promise(r => setTimeout(r, 400));
      setStep(i);
      setLogs(prev => [...prev, { text: `← 离开 ${layers[i]}`, cls: 'dim' }]);
    }
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <input
          value={path}
          onChange={e => setPath(e.target.value)}
          className="px-3 py-1.5 bg-[#0d1117] border border-[#253149] rounded text-sm text-[#c9d1d9] focus:outline-none focus:border-[#38bdf8]"
          placeholder="/api/data or /admin"
        />
        <button onClick={run} className="px-4 py-1.5 rounded text-sm font-medium text-[#0b0f17]" style={{ backgroundColor: accent }}>
          ▶ 发送请求
        </button>
      </div>
      {/* Onion rings */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {layers.map((layer, i) => (
            <div
              key={i}
              className={`absolute border-2 rounded-full flex items-center justify-center transition-all ${
                step >= i ? 'border-[#34d399] bg-[#34d399]/10' : 'border-[#253149]'
              }`}
              style={{
                width: `${200 - i * 40}px`,
                height: `${200 - i * 40}px`,
                top: `${i * 20}px`,
                left: `${i * 20}px`,
              }}
            >
              <span className="text-xs text-[#8b98b3] absolute" style={{ top: '4px' }}>{layer}</span>
            </div>
          ))}
          <div style={{ width: '200px', height: '200px' }} />
        </div>
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// Server Demo (Uvicorn)
function ServerDemo({ accent }: { accent: string }) {
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);
  const [running, setRunning] = useState(false);
  const [workerIdx, setWorkerIdx] = useState(0);

  const start = async () => {
    setLogs([]);
    setRunning(true);
    const startupLogs = [
      { text: 'INFO: Uvicorn running on http://0.0.0.0:8000', cls: 'ok' },
      { text: 'INFO: Started server process [12345]', cls: 'dim' },
      { text: 'INFO: Waiting for application startup.', cls: 'dim' },
      { text: 'INFO: Application startup complete.', cls: 'ok' },
    ];
    for (const log of startupLogs) {
      await new Promise(r => setTimeout(r, 400));
      setLogs(prev => [...prev, log]);
    }
  };

  const sendRequest = async () => {
    if (!running) return;
    const w = workerIdx % 3;
    setWorkerIdx(prev => prev + 1);
    setLogs(prev => [...prev,
      { text: `INFO: [worker-${w}] 127.0.0.1:54321 - "GET /api/data HTTP/1.1" 200`, cls: 'ok' },
    ]);
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={start} disabled={running} className="px-4 py-1.5 rounded text-sm font-medium text-[#0b0f17] disabled:opacity-50" style={{ backgroundColor: accent }}>
          ▶ 启动服务器
        </button>
        <button onClick={sendRequest} disabled={!running} className="px-4 py-1.5 rounded text-sm font-medium bg-[#253149] text-[#dce5f4] disabled:opacity-50">
          发送请求
        </button>
        {running && (
          <div className="flex items-center gap-1 ml-auto">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full ${workerIdx % 3 === i ? 'bg-[#34d399]' : 'bg-[#253149]'}`} />
            ))}
            <span className="text-xs text-[#8b98b3] ml-1">Workers</span>
          </div>
        )}
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// Request Demo (requests)
function RequestDemo({ accent }: { accent: string }) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/users');
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);

  const send = async () => {
    setLogs([]);
    setLogs(prev => [...prev, { text: `→ ${method} ${url}`, cls: 'hl' }]);
    await new Promise(r => setTimeout(r, 500));
    setLogs(prev => [...prev, { text: '→ Host: api.example.com', cls: 'dim' }]);
    setLogs(prev => [...prev, { text: '→ User-Agent: python-requests/2.31.0', cls: 'dim' }]);
    await new Promise(r => setTimeout(r, 800));

    const is404 = url.includes('missing');
    const isTimeout = url.includes('slow');

    if (is404) {
      setLogs(prev => [...prev, { text: '← 404 Not Found', cls: 'err' }]);
    } else if (isTimeout) {
      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [...prev, { text: '✗ ReadTimeout: 请求超时', cls: 'err' }]);
    } else {
      setLogs(prev => [...prev, { text: '← 200 OK (245ms)', cls: 'ok' }]);
      setLogs(prev => [...prev, { text: '← Content-Type: application/json', cls: 'dim' }]);
      setLogs(prev => [...prev, { text: '← {"users": [...], "total": 42}', cls: 'ok' }]);
    }
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={method} onChange={e => setMethod(e.target.value)} className="px-3 py-1.5 bg-[#0d1117] border border-[#253149] rounded text-sm text-[#c9d1d9]">
          <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
        </select>
        <input value={url} onChange={e => setUrl(e.target.value)} className="flex-1 min-w-[200px] px-3 py-1.5 bg-[#0d1117] border border-[#253149] rounded text-sm text-[#c9d1d9] focus:outline-none" />
        <button onClick={send} className="px-4 py-1.5 rounded text-sm font-medium text-[#0b0f17]" style={{ backgroundColor: accent }}>
          发送
        </button>
      </div>
      <div className="text-xs text-[#8b98b3] mb-3">
        试试：正常 URL | 加 "missing" 模拟 404 | 加 "slow" 模拟超时
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// Timeline Demo (httpx sync vs async)
function TimelineDemo({ accent }: { accent: string }) {
  const [mode, setMode] = useState<'sync' | 'async' | null>(null);
  const [progress, setProgress] = useState<number[]>([0, 0, 0]);

  const run = async (isAsync: boolean) => {
    setMode(isAsync ? 'async' : 'sync');
    setProgress([0, 0, 0]);

    if (isAsync) {
      // All start at once
      const duration = 800;
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const p = Math.min(100, (elapsed / duration) * 100);
        setProgress([p, p, p]);
        if (elapsed >= duration) {
          clearInterval(interval);
          setProgress([100, 100, 100]);
        }
      }, 30);
    } else {
      // Sequential
      for (let i = 0; i < 3; i++) {
        const duration = 600;
        const start = Date.now();
        await new Promise<void>(resolve => {
          const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const p = Math.min(100, (elapsed / duration) * 100);
            setProgress(prev => {
              const next = [...prev];
              next[i] = p;
              return next;
            });
            if (elapsed >= duration) {
              clearInterval(interval);
              resolve();
            }
          }, 30);
        });
      }
    }
  };

  const totalTime = mode === 'async' ? '~800ms' : '~1900ms';

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => run(false)} className={`px-3 py-1.5 rounded text-sm ${mode === 'sync' ? 'bg-[#f87171]/20 text-[#f87171]' : 'bg-[#253149] text-[#8b98b3]'}`}>
          同步 (sequential)
        </button>
        <button onClick={() => run(true)} className={`px-3 py-1.5 rounded text-sm ${mode === 'async' ? 'bg-[#34d399]/20 text-[#34d399]' : 'bg-[#253149] text-[#8b98b3]'}`}>
          异步 (concurrent)
        </button>
        {mode && <span className="ml-auto text-sm text-[#8b98b3]">总耗时: <span className="font-mono font-bold" style={{ color: accent }}>{totalTime}</span></span>}
      </div>
      <div className="space-y-3">
        {['请求 1: /api/users', '请求 2: /api/posts', '请求 3: /api/comments'].map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-[#8b98b3] w-40 shrink-0">{label}</span>
            <div className="flex-1 h-6 bg-[#0d1117] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progress[i]}%`,
                  backgroundColor: mode === 'async' ? '#34d399' : accent,
                }}
              />
            </div>
            <span className="text-xs font-mono text-[#8b98b3] w-12">{Math.round(progress[i])}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Test Demo (pytest)
function TestDemo({ accent }: { accent: string }) {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ name: string; status: 'pass' | 'fail' | 'skip' }[]>([]);
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);

  const tests = [
    { name: 'test_add', status: 'pass' as const },
    { name: 'test_subtract', status: 'pass' as const },
    { name: 'test_divide', status: 'pass' as const },
    { name: 'test_divide_zero', status: 'fail' as const },
    { name: 'test_multiply', status: 'pass' as const },
    { name: 'test_power', status: 'skip' as const },
  ];

  const run = async () => {
    setRunning(true);
    setResults([]);
    setLogs([{ text: '============================= test session starts =============================', cls: 'dim' }]);
    setLogs(prev => [...prev, { text: 'collected 6 items', cls: 'dim' }]);
    setLogs(prev => [...prev, { text: '', cls: '' }]);

    let progress = '';
    for (const test of tests) {
      await new Promise(r => setTimeout(r, 400));
      setResults(prev => [...prev, test]);
      const char = test.status === 'pass' ? '.' : test.status === 'fail' ? 'F' : 's';
      progress += char;
      setLogs(prev => [...prev, { text: `test_calc.py ${progress}`, cls: test.status === 'fail' ? 'err' : test.status === 'skip' ? 'warn' : 'ok' }]);
    }

    await new Promise(r => setTimeout(r, 300));
    setLogs(prev => [...prev, { text: '', cls: '' }]);
    setLogs(prev => [...prev, { text: '================================== FAILURES ===================================', cls: 'err' }]);
    setLogs(prev => [...prev, { text: '____________________________ test_divide_zero _____________________________', cls: 'err' }]);
    setLogs(prev => [...prev, { text: '    def test_divide_zero():', cls: '' }]);
    setLogs(prev => [...prev, { text: '>       assert divide(1, 0) == 0', cls: 'err' }]);
    setLogs(prev => [...prev, { text: 'E       ZeroDivisionError: division by zero', cls: 'err' }]);
    setLogs(prev => [...prev, { text: '', cls: '' }]);
    setLogs(prev => [...prev, { text: '=========================== 1 failed, 4 passed, 1 skipped ===========================', cls: 'warn' }]);
    setRunning(false);
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={run} disabled={running} className="px-4 py-1.5 rounded text-sm font-medium text-[#0b0f17] disabled:opacity-50" style={{ backgroundColor: accent }}>
          ▶ pytest -v
        </button>
        {results.length > 0 && (
          <div className="flex gap-2 ml-auto text-xs">
            <span className="text-[#34d399]">{results.filter(r => r.status === 'pass').length} passed</span>
            <span className="text-[#f87171]">{results.filter(r => r.status === 'fail').length} failed</span>
            <span className="text-[#fbbf24]">{results.filter(r => r.status === 'skip').length} skipped</span>
          </div>
        )}
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// CLI Demo (Click)
function CliDemo({ accent }: { accent: string }) {
  const [input, setInput] = useState('greet --name Alice --count 3');
  const [output, setOutput] = useState<{ text: string; cls?: string }[]>([]);

  const run = () => {
    const parts = input.split(/\s+/);
    const cmd = parts[0];
    const tokens: { text: string; cls: string }[] = [];

    parts.forEach(p => {
      if (p.startsWith('--')) tokens.push({ text: p, cls: 'text-[#a78bfa]' });
      else if (p === cmd) tokens.push({ text: p, cls: 'text-[#38bdf8]' });
      else tokens.push({ text: p, cls: 'text-[#34d399]' });
    });

    const lines: { text: string; cls?: string }[] = [
      { text: `$ ${input}`, cls: 'dim' },
      { text: `解析: command="${cmd}"`, cls: 'hl' },
    ];

    // Parse options
    for (let i = 1; i < parts.length; i++) {
      if (parts[i].startsWith('--')) {
        const key = parts[i].slice(2);
        const val = parts[i + 1] || 'true';
        lines.push({ text: `  option: ${key} = "${val}"`, cls: 'ok' });
      }
    }

    // Simulate output
    if (cmd === 'greet') {
      const name = parts.includes('--name') ? parts[parts.indexOf('--name') + 1] : 'World';
      const count = parts.includes('--count') ? parseInt(parts[parts.indexOf('--count') + 1]) || 1 : 1;
      lines.push({ text: '', cls: '' });
      for (let i = 0; i < count; i++) {
        lines.push({ text: `Hello, ${name}!`, cls: 'ok' });
      }
    }

    setOutput(lines);
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-[#0d1117] border border-[#253149] rounded text-sm font-mono text-[#c9d1d9] focus:outline-none"
          placeholder="greet --name Alice --count 3"
        />
        <button onClick={run} className="px-4 py-1.5 rounded text-sm font-medium text-[#0b0f17]" style={{ backgroundColor: accent }}>
          执行
        </button>
      </div>
      <Terminal lines={output} accent={accent} />
    </div>
  );
}

// Typer Demo
function TyperDemo({ accent }: { accent: string }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const code = `def hello(\n  name: str = typer.Argument(...),\n  count: int = typer.Option(1),\n  loud: bool = typer.Option(False)\n):`;

  const help = `Usage: app hello [OPTIONS] NAME\n\nArguments:\n  NAME  [required]\n\nOptions:\n  --count INTEGER  [default: 1]\n  --loud / --no-loud  [default: no-loud]`;

  const mappings: Record<string, string> = {
    'name: str': 'NAME  [required]',
    'count: int': '--count INTEGER',
    'loud: bool': '--loud / --no-loud',
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <p className="text-sm text-[#8b98b3] mb-4">悬停代码中的参数，查看对应的 --help 输出：</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#0d1117] border border-[#253149] rounded-lg p-4 font-mono text-sm">
          <div className="text-[#8b98b3] text-xs mb-2">代码</div>
          {code.split('\n').map((line, i) => {
            const matchKey = Object.keys(mappings).find(k => line.includes(k));
            const isHovered = matchKey && hovered === matchKey;
            return (
              <div
                key={i}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${isHovered ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'text-[#c9d1d9]'}`}
                onMouseEnter={() => matchKey && setHovered(matchKey)}
                onMouseLeave={() => setHovered(null)}
              >
                {line}
              </div>
            );
          })}
        </div>
        <div className="bg-[#0d1117] border border-[#253149] rounded-lg p-4 font-mono text-sm">
          <div className="text-[#8b98b3] text-xs mb-2">--help 输出</div>
          {help.split('\n').map((line, i) => {
            const matchKey = Object.entries(mappings).find(([_, v]) => line.includes(v.split('  [')[0].trim()));
            const isHovered = matchKey && hovered === matchKey[0];
            return (
              <div
                key={i}
                className={`px-2 py-0.5 rounded transition-all ${isHovered ? 'bg-[#34d399]/20 text-[#34d399]' : 'text-[#c9d1d9]'}`}
              >
                {line || ' '}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Attrs Demo
function AttrsDemo({ accent }: { accent: string }) {
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    { id: 'init', label: '__init__', desc: '自动生成构造函数' },
    { id: 'repr', label: '__repr__', desc: '自动生成字符串表示' },
    { id: 'eq', label: '__eq__', desc: '自动生成相等比较' },
    { id: 'validate', label: 'validator', desc: '属性校验' },
  ];

  const run = (feature: string) => {
    setActiveFeature(feature);
    const lines: { text: string; cls?: string }[] = [];

    switch (feature) {
      case 'init':
        lines.push({ text: '# 无需手写 __init__', cls: 'dim' });
        lines.push({ text: 'p = Point(1.0, 2.0, "origin")', cls: '' });
        lines.push({ text: '✓ __init__ 自动生成', cls: 'ok' });
        break;
      case 'repr':
        lines.push({ text: '>>> repr(p)', cls: 'dim' });
        lines.push({ text: "Point(x=1.0, y=2.0, label='origin')", cls: 'hl' });
        lines.push({ text: '✓ __repr__ 自动生成', cls: 'ok' });
        break;
      case 'eq':
        lines.push({ text: '>>> p1 == p2', cls: 'dim' });
        lines.push({ text: 'True', cls: 'ok' });
        lines.push({ text: '>>> p1 == Point(1.0, 2.0, "origin")', cls: 'dim' });
        lines.push({ text: 'True', cls: 'ok' });
        lines.push({ text: '✓ __eq__ 自动生成', cls: 'ok' });
        break;
      case 'validate':
        lines.push({ text: '>>> Config(port=-1)', cls: 'dim' });
        lines.push({ text: 'ValueError: port must be positive', cls: 'err' });
        lines.push({ text: '✓ validator 自动校验', cls: 'ok' });
        break;
    }
    setLogs(lines);
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        {features.map(f => (
          <button
            key={f.id}
            onClick={() => run(f.id)}
            className={`px-3 py-1.5 rounded text-sm ${activeFeature === f.id ? 'text-[#0b0f17] font-medium' : 'bg-[#253149] text-[#8b98b3]'}`}
            style={activeFeature === f.id ? { backgroundColor: accent } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// Rich Demo
function RichDemo({ accent }: { accent: string }) {
  const [mode, setMode] = useState<string | null>(null);

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        {['Markup', 'Table', 'Progress', 'Panel'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded text-sm ${mode === m ? 'text-[#0b0f17] font-medium' : 'bg-[#253149] text-[#8b98b3]'}`}
            style={mode === m ? { backgroundColor: accent } : {}}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="bg-[#0d1117] border border-[#253149] rounded-lg p-4 font-mono text-sm min-h-[120px]">
        {mode === 'Markup' && (
          <div>
            <span className="font-bold text-[#34d399]">Hello</span>
            <span className="text-[#c9d1d9]">, </span>
            <span className="text-[#f87171]">World</span>
            <span className="text-[#c9d1d9]">!</span>
            <br />
            <span className="text-[#484f58] text-xs mt-2 block"># [bold green]Hello[/], [red]World[/]!</span>
          </div>
        )}
        {mode === 'Table' && (
          <div>
            <div className="text-[#8b98b3] mb-2">┌──────────┬──────┐</div>
            <div className="text-[#8b98b3]">│ <span className="text-[#dce5f4] font-bold">Title</span>    │ <span className="text-[#dce5f4] font-bold">Year</span> │</div>
            <div className="text-[#8b98b3]">├──────────┼──────┤</div>
            <div className="text-[#8b98b3]">│ Inception │ 2010 │</div>
            <div className="text-[#8b98b3]">│ Interstellar │ 2014 │</div>
            <div className="text-[#8b98b3]">└──────────┴──────┘</div>
          </div>
        )}
        {mode === 'Progress' && <ProgressBars accent={accent} />}
        {mode === 'Panel' && (
          <div className="border border-[#34d399] rounded-lg p-3 inline-block">
            <span className="font-bold text-[#38bdf8]">Hello</span>
            <span className="text-[#c9d1d9]"> from </span>
            <span className="text-[#34d399]">Rich</span>
            <span className="text-[#c9d1d9]">!</span>
          </div>
        )}
        {!mode && <span className="text-[#484f58]">选择一个演示模式...</span>}
      </div>
    </div>
  );
}

function ProgressBars({ accent }: { accent: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 2);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[#8b98b3] text-xs w-24">Downloading</span>
        <div className="flex-1 h-3 bg-[#253149] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: accent }} />
        </div>
        <span className="text-[#8b98b3] text-xs w-10">{progress}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#8b98b3] text-xs w-24">Processing</span>
        <div className="flex-1 h-3 bg-[#253149] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all bg-[#34d399]" style={{ width: `${Math.min(100, progress * 0.8)}%` }} />
        </div>
        <span className="text-[#8b98b3] text-xs w-10">{Math.min(100, Math.round(progress * 0.8))}%</span>
      </div>
    </div>
  );
}

// Jinja Demo
function JinjaDemo({ accent }: { accent: string }) {
  const [template, setTemplate] = useState('Hello {{ name }}!\n{% for item in items %}\n- {{ item }}\n{% endfor %}');
  const [data, setData] = useState('{"name": "World", "items": ["Python", "Jinja", "Web"]}');
  const [output, setOutput] = useState('');

  const render = () => {
    try {
      const vars = JSON.parse(data);
      let result = template;

      // Simple for loop processing
      const forRegex = /\{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g;
      result = result.replace(forRegex, (_, varName, listName, body) => {
        const list = vars[listName];
        if (!Array.isArray(list)) return '';
        return list.map(item => {
          let line = body;
          line = line.replace(new RegExp(`\\{\\{\\s*${varName}\\s*\\}\\}`, 'g'), String(item));
          return line;
        }).join('');
      });

      // Variable substitution
      result = result.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
        return vars[key] !== undefined ? String(vars[key]) : '';
      });

      setOutput(result);
    } catch {
      setOutput('Error: 请检查 JSON 格式');
    }
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-[#8b98b3] mb-1 block">模板：</label>
          <textarea
            value={template}
            onChange={e => setTemplate(e.target.value)}
            className="w-full h-32 bg-[#0d1117] border border-[#253149] rounded-lg p-3 font-mono text-sm text-[#c9d1d9] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-[#8b98b3] mb-1 block">数据 (JSON)：</label>
          <textarea
            value={data}
            onChange={e => setData(e.target.value)}
            className="w-full h-32 bg-[#0d1117] border border-[#253149] rounded-lg p-3 font-mono text-sm text-[#c9d1d9] focus:outline-none"
          />
        </div>
      </div>
      <button onClick={render} className="px-4 py-1.5 rounded text-sm font-medium text-[#0b0f17] mb-3" style={{ backgroundColor: accent }}>
        渲染
      </button>
      <div className="bg-[#0d1117] border border-[#253149] rounded-lg p-3 font-mono text-sm text-[#c9d1d9] min-h-[60px] whitespace-pre-wrap">
        {output || '点击渲染查看结果...'}
      </div>
    </div>
  );
}

// Serial Demo
function SerialDemo({ accent }: { accent: string }) {
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);
  const [collecting, setCollecting] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const send = (cmd: string) => {
    setLogs(prev => [...prev,
      { text: `TX → ${cmd}`, cls: 'hl' },
    ]);
    setTimeout(() => {
      const responses: Record<string, string> = {
        'AT': 'OK',
        'AT+VERSION': 'v2.0',
        'AT+TEMP?': '25.3',
        'AT+HUMID?': '62.1',
      };
      const resp = responses[cmd] || 'OK';
      setLogs(prev => [...prev, { text: `RX ← ${resp}`, cls: 'ok' }]);
    }, 300);
  };

  const toggleCollect = () => {
    if (collecting) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCollecting(false);
      setLogs(prev => [...prev, { text: '--- 采集停止 ---', cls: 'warn' }]);
    } else {
      setCollecting(true);
      setLogs(prev => [...prev, { text: '--- 开始采集模式 ---', cls: 'warn' }]);
      intervalRef.current = window.setInterval(() => {
        const temp = (20 + Math.random() * 10).toFixed(1);
        const humid = (50 + Math.random() * 30).toFixed(1);
        setLogs(prev => [...prev,
          { text: `RX ← T:${temp}°C H:${humid}%`, cls: 'ok' },
        ]);
      }, 1500);
    }
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {['AT', 'AT+VERSION', 'AT+TEMP?', 'AT+HUMID?'].map(cmd => (
          <button key={cmd} onClick={() => send(cmd)} className="px-3 py-1 rounded text-xs bg-[#253149] text-[#dce5f4] hover:bg-[#253149]/80">
            {cmd}
          </button>
        ))}
        <button
          onClick={toggleCollect}
          className={`px-3 py-1 rounded text-xs ${collecting ? 'bg-[#f87171] text-white' : 'bg-[#34d399]/20 text-[#34d399]'}`}
        >
          {collecting ? '■ 停止采集' : '▶ 采集模式'}
        </button>
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// Modbus Demo
function ModbusDemo({ accent }: { accent: string }) {
  const [funcCode, setFuncCode] = useState('03');
  const [regs, setRegs] = useState<number[]>(Array(16).fill(0).map(() => Math.floor(Math.random() * 1000)));
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);
  const [selectedReg, setSelectedReg] = useState<number | null>(null);

  const execute = () => {
    setLogs([]);
    const slave = 1;
    const startReg = 0;
    const count = 16;

    // Build frame
    const addr = slave.toString(16).padStart(2, '0').toUpperCase();
    const fc = funcCode;
    const startHex = startReg.toString(16).padStart(4, '0').toUpperCase();
    const countHex = count.toString(16).padStart(4, '0').toUpperCase();

    setLogs(prev => [...prev, { text: `TX: [${addr}] [${fc}] [${startHex}] [${countHex}] [CRC]`, cls: 'hl' }]);

    setTimeout(() => {
      if (funcCode === '03') {
        const dataBytes = regs.map(r => r.toString(16).padStart(4, '0').toUpperCase()).join(' ');
        setLogs(prev => [...prev, { text: `RX: [${addr}] [${fc}] [${(count * 2).toString(16).padStart(2, '0').toUpperCase()}] [${dataBytes}] [CRC]`, cls: 'ok' }]);
        setSelectedReg(0);
      } else if (funcCode === '06') {
        const reg = Math.floor(Math.random() * 16);
        const val = Math.floor(Math.random() * 1000);
        const newRegs = [...regs];
        newRegs[reg] = val;
        setRegs(newRegs);
        setSelectedReg(reg);
        setLogs(prev => [...prev, { text: `写入寄存器 [${reg}] = ${val}`, cls: 'ok' }]);
      }
    }, 500);
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select value={funcCode} onChange={e => setFuncCode(e.target.value)} className="px-3 py-1.5 bg-[#0d1117] border border-[#253149] rounded text-sm text-[#c9d1d9]">
          <option value="03">03 - 读保持寄存器</option>
          <option value="06">06 - 写单寄存器</option>
        </select>
        <button onClick={execute} className="px-4 py-1.5 rounded text-sm font-medium text-[#0b0f17]" style={{ backgroundColor: accent }}>
          执行
        </button>
      </div>
      {/* Register grid */}
      <div className="grid grid-cols-8 gap-1 mb-4">
        {regs.map((val, i) => (
          <div
            key={i}
            className={`text-center py-2 rounded text-xs font-mono border transition-all ${
              selectedReg === i ? 'border-[#34d399] bg-[#34d399]/20 text-[#34d399]' : 'border-[#253149] bg-[#0d1117] text-[#8b98b3]'
            }`}
          >
            <div className="text-[10px] text-[#484f58]">{i}</div>
            {val}
          </div>
        ))}
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// Pymodbus Demo
function PymodbusDemo({ accent }: { accent: string }) {
  const [regs, setRegs] = useState<number[]>(Array(16).fill(0).map(() => Math.floor(Math.random() * 65535)));
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);
  const [highlight, setHighlight] = useState<number[]>([]);

  const readRegs = async () => {
    setLogs([{ text: '→ read_holding_registers(addr=0, count=16, slave=1)', cls: 'hl' }]);
    await new Promise(r => setTimeout(r, 500));
    setHighlight(Array.from({ length: 16 }, (_, i) => i));
    setLogs(prev => [...prev,
      { text: `← ${JSON.stringify(regs)}`, cls: 'ok' },
      { text: '✓ 读取成功', cls: 'ok' },
    ]);
  };

  const writeReg = async () => {
    const addr = Math.floor(Math.random() * 16);
    const val = Math.floor(Math.random() * 65535);
    setLogs([{ text: `→ write_register(addr=${addr}, value=${val}, slave=1)`, cls: 'hl' }]);
    await new Promise(r => setTimeout(r, 400));
    const newRegs = [...regs];
    newRegs[addr] = val;
    setRegs(newRegs);
    setHighlight([addr]);
    setLogs(prev => [...prev, { text: '✓ 写入成功', cls: 'ok' }]);
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={readRegs} className="px-3 py-1.5 rounded text-sm bg-[#253149] text-[#dce5f4]">读寄存器</button>
        <button onClick={writeReg} className="px-3 py-1.5 rounded text-sm bg-[#253149] text-[#dce5f4]">写寄存器</button>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-1 mb-4">
        {regs.map((val, i) => (
          <div
            key={i}
            className={`text-center py-2 rounded text-xs font-mono border transition-all ${
              highlight.includes(i) ? 'border-[#38bdf8] bg-[#38bdf8]/20 text-[#38bdf8]' : 'border-[#253149] bg-[#0d1117] text-[#8b98b3]'
            }`}
          >
            <div className="text-[10px] text-[#484f58]">{i}</div>
            <div>0x{val.toString(16).padStart(4, '0').toUpperCase()}</div>
          </div>
        ))}
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// VISA Demo
function VisaDemo({ accent }: { accent: string }) {
  const [connected, setConnected] = useState(false);
  const [value, setValue] = useState(0);
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);

  const resources = ['TCPIP0::192.168.1.100::inst0', 'USB0::0x1234::inst1', 'GPIB0::22::inst0'];

  const connect = (resource: string) => {
    setLogs([{ text: `→ open_resource("${resource}")`, cls: 'hl' }]);
    setTimeout(() => {
      setConnected(true);
      setLogs(prev => [...prev,
        { text: '← "Mock,Instrument,SN123,1.0"', cls: 'ok' },
        { text: '✓ 连接成功', cls: 'ok' },
      ]);
    }, 500);
  };

  const query = (cmd: string) => {
    if (!connected) {
      setLogs(prev => [...prev, { text: '✗ VisaIOError: 未连接仪器', cls: 'err' }]);
      return;
    }
    setLogs(prev => [...prev, { text: `→ ${cmd}`, cls: 'hl' }]);
    setTimeout(() => {
      const newVal = Math.random() * 10;
      setValue(newVal);
      setLogs(prev => [...prev, { text: `← ${newVal.toFixed(4)}`, cls: 'ok' }]);
    }, 300);
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {!connected ? (
          resources.map(r => (
            <button key={r} onClick={() => connect(r)} className="px-3 py-1 rounded text-xs bg-[#253149] text-[#dce5f4]">
              {r.split('::')[0]}
            </button>
          ))
        ) : (
          <>
            {['MEAS:VOLT?', 'MEAS:CURR?', 'MEAS:RES?'].map(cmd => (
              <button key={cmd} onClick={() => query(cmd)} className="px-3 py-1 rounded text-xs bg-[#253149] text-[#dce5f4]">
                {cmd}
              </button>
            ))}
            <button onClick={() => { setConnected(false); setLogs([]); }} className="px-3 py-1 rounded text-xs bg-[#f87171]/20 text-[#f87171]">
              断开
            </button>
          </>
        )}
      </div>
      {/* Meter display */}
      {connected && (
        <div className="bg-[#0d1117] border border-[#253149] rounded-lg p-4 mb-4 text-center">
          <div className="text-xs text-[#8b98b3] mb-1">测量值</div>
          <div className="text-3xl font-mono font-bold" style={{ color: accent }}>
            {value.toFixed(4)}
          </div>
          <div className="text-xs text-[#8b98b3] mt-1">V DC</div>
        </div>
      )}
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}

// PDF Demo
function PdfDemo({ accent }: { accent: string }) {
  const [mode, setMode] = useState<string | null>(null);
  const [output, setOutput] = useState<string[]>([]);

  const extract = (type: string) => {
    setMode(type);
    switch (type) {
      case 'text':
        setOutput([
          'Invoice #2024-001',
          'Date: 2024-01-15',
          'From: ACME Corp',
          'To: John Doe',
          '',
          'Item          Qty    Price',
          'Widget A       5    $10.00',
          'Widget B       3    $15.00',
          'Total:              $95.00',
        ]);
        break;
      case 'table':
        setOutput([
          '┌───────────┬─────┬────────┐',
          '│ Item      │ Qty │ Price  │',
          '├───────────┼─────┼────────┤',
          '│ Widget A  │  5  │ $10.00 │',
          '│ Widget B  │  3  │ $15.00 │',
          '│ Widget C  │  2  │ $20.00 │',
          '└───────────┴─────┴────────┘',
          '',
          '提取: 3行 x 3列',
        ]);
        break;
      case 'crop':
        setOutput([
          '裁剪区域: (50, 200, 550, 400)',
          '提取文本:',
          '"Total: $95.00"',
          '"Due Date: 2024-02-15"',
        ]);
        break;
    }
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        {['提取文本', '提取表格', '区域裁剪'].map((label, i) => (
          <button
            key={i}
            onClick={() => extract(['text', 'table', 'crop'][i])}
            className={`px-3 py-1.5 rounded text-sm ${mode === ['text', 'table', 'crop'][i] ? 'text-[#0b0f17] font-medium' : 'bg-[#253149] text-[#8b98b3]'}`}
            style={mode === ['text', 'table', 'crop'][i] ? { backgroundColor: accent } : {}}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Simulated PDF page */}
      <div className="bg-white rounded-lg p-4 mb-4 text-black text-sm max-h-48 overflow-auto">
        <div className="font-bold text-lg">Invoice #2024-001</div>
        <div className="text-gray-600 text-xs">Date: 2024-01-15</div>
        <table className="w-full mt-3 text-xs border-collapse">
          <thead><tr className="border-b"><th className="text-left py-1">Item</th><th className="text-right py-1">Qty</th><th className="text-right py-1">Price</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="py-1">Widget A</td><td className="text-right">5</td><td className="text-right">$10.00</td></tr>
            <tr className="border-b"><td className="py-1">Widget B</td><td className="text-right">3</td><td className="text-right">$15.00</td></tr>
            <tr className="border-b"><td className="py-1">Widget C</td><td className="text-right">2</td><td className="text-right">$20.00</td></tr>
          </tbody>
        </table>
        <div className="text-right font-bold mt-2">Total: $95.00</div>
      </div>
      <div className="bg-[#0d1117] border border-[#253149] rounded-lg p-3 font-mono text-sm text-[#c9d1d9] min-h-[60px]">
        {output.length > 0 ? output.map((line, i) => <div key={i}>{line}</div>) : <span className="text-[#484f58]">选择提取方式...</span>}
      </div>
    </div>
  );
}

// Packaging Demo
function PackagingDemo({ accent }: { accent: string }) {
  const [version, setVersion] = useState('1.2.3');
  const [specifier, setSpecifier] = useState('>=1.0,<2.0');

  const parseVersion = (v: string) => {
    const match = v.match(/^(\d+)\.(\d+)\.(\d+)(.*)?$/);
    if (!match) return null;
    return { major: match[1], minor: match[2], micro: match[3], pre: match[4] || '' };
  };

  const checkSpec = (v: string, spec: string): boolean => {
    const parsed = parseVersion(v);
    if (!parsed) return false;
    const num = parseInt(parsed.major) * 10000 + parseInt(parsed.minor) * 100 + parseInt(parsed.micro);

    const parts = spec.split(',').map(s => s.trim());
    return parts.every(part => {
      if (part.startsWith('>=')) return num >= parseInt(part.slice(2).split('.')[0]) * 10000;
      if (part.startsWith('<')) return num < parseInt(part.slice(1).split('.')[0]) * 10000;
      if (part.startsWith('==')) return v === part.slice(2);
      if (part.startsWith('!=')) return v !== part.slice(2);
      return true;
    });
  };

  const parsed = parseVersion(version);
  const matches = checkSpec(version, specifier);

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-[#8b98b3] mb-1 block">版本号：</label>
          <input
            value={version}
            onChange={e => setVersion(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#0d1117] border border-[#253149] rounded text-sm font-mono text-[#c9d1d9] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-[#8b98b3] mb-1 block">版本规范：</label>
          <input
            value={specifier}
            onChange={e => setSpecifier(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#0d1117] border border-[#253149] rounded text-sm font-mono text-[#c9d1d9] focus:outline-none"
          />
        </div>
      </div>
      {/* Version chips */}
      {parsed && (
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-[#38bdf8]/20 text-[#38bdf8] rounded text-xs font-mono">major: {parsed.major}</span>
          <span className="px-2 py-1 bg-[#a78bfa]/20 text-[#a78bfa] rounded text-xs font-mono">minor: {parsed.minor}</span>
          <span className="px-2 py-1 bg-[#34d399]/20 text-[#34d399] rounded text-xs font-mono">micro: {parsed.micro}</span>
          {parsed.pre && <span className="px-2 py-1 bg-[#fbbf24]/20 text-[#fbbf24] rounded text-xs font-mono">pre: {parsed.pre}</span>}
        </div>
      )}
      <div className={`px-4 py-2 rounded-lg text-sm font-medium ${matches ? 'bg-[#34d399]/20 text-[#34d399]' : 'bg-[#f87171]/20 text-[#f87171]'}`}>
        {matches ? `✓ Version("${version}") in SpecifierSet("${specifier}")` : `✗ Version("${version}") not in SpecifierSet("${specifier}")`}
      </div>
    </div>
  );
}

// Playwright Demo
function PlaywrightDemo({ accent }: { accent: string }) {
  const [step, setStep] = useState(-1);
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState<{ text: string; cls?: string }[]>([]);

  const steps = [
    { url: 'https://example.com', msg: '→ page.goto("https://example.com")', action: 'navigate' },
    { url: 'https://example.com', msg: '→ page.title() → "Example Domain"', action: 'read' },
    { url: 'https://example.com', msg: '→ page.click("text=More information...")', action: 'click' },
    { url: 'https://www.iana.org/', msg: '→ 导航到 IANA', action: 'navigate' },
    { url: 'https://www.iana.org/', msg: '→ page.screenshot(path="screenshot.png")', action: 'screenshot' },
  ];

  const run = async () => {
    setStep(-1);
    setLogs([]);
    setUrl('');
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setStep(i);
      setUrl(steps[i].url);
      setLogs(prev => [...prev, { text: steps[i].msg, cls: steps[i].action === 'screenshot' ? 'hl' : 'ok' }]);
    }
  };

  return (
    <div className="bg-[#141c2c] border border-[#253149] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={run} className="px-4 py-1.5 rounded text-sm font-medium text-[#0b0f17]" style={{ backgroundColor: accent }}>
          ▶ 运行测试
        </button>
      </div>
      {/* Browser mockup */}
      <div className="bg-[#0d1117] border border-[#253149] rounded-lg overflow-hidden mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] border-b border-[#253149]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#f87171]" />
            <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
            <div className="w-3 h-3 rounded-full bg-[#34d399]" />
          </div>
          <div className="flex-1 px-3 py-1 bg-[#0d1117] rounded text-xs text-[#8b98b3] font-mono truncate">
            {url || 'about:blank'}
          </div>
        </div>
        <div className="p-8 min-h-[120px] flex items-center justify-center">
          {step < 0 && <span className="text-[#484f58]">空白页</span>}
          {step >= 0 && step < 3 && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#dce5f4]">Example Domain</h3>
              <p className="text-sm text-[#8b98b3] mt-2">This domain is for use in illustrative examples...</p>
              {step >= 2 && <span className="text-[#38bdf8] text-sm underline cursor-pointer">More information...</span>}
            </div>
          )}
          {step >= 3 && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#dce5f4]">IANA</h3>
              <p className="text-sm text-[#8b98b3] mt-2">Internet Assigned Numbers Authority</p>
            </div>
          )}
          {step === 4 && (
            <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
              <span className="text-[#38bdf9] text-sm">📸 screenshot.png</span>
            </div>
          )}
        </div>
      </div>
      <Terminal lines={logs} accent={accent} />
    </div>
  );
}
