import { useState, useEffect } from 'react';
import { LIBS, CATS, getLib, getPrevLib, getNextLib, type Lib } from './data/libs';
import { IndexPage } from './pages/IndexPage';
import { LibPage } from './pages/LibPage';

function App() {
  const [currentLib, setCurrentLib] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && getLib(hash)) {
      setCurrentLib(hash);
    }
    const onHashChange = () => {
      const h = window.location.hash.slice(1);
      if (h && getLib(h)) {
        setCurrentLib(h);
      } else {
        setCurrentLib(null);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (id: string) => {
    window.location.hash = id;
    setCurrentLib(id);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    window.location.hash = '';
    setCurrentLib(null);
    window.scrollTo(0, 0);
  };

  if (!currentLib) {
    return <IndexPage libs={LIBS} cats={CATS} onSelect={navigate} />;
  }

  const lib = getLib(currentLib);
  if (!lib) {
    return <IndexPage libs={LIBS} cats={CATS} onSelect={navigate} />;
  }

  const prev = getPrevLib(currentLib);
  const next = getNextLib(currentLib);

  return (
    <LibPage
      lib={lib}
      cats={CATS}
      allLibs={LIBS}
      prev={prev}
      next={next}
      onNavigate={navigate}
      onHome={goHome}
    />
  );
}

export default App;
