const environment = import.meta.env.VITE_APP_ENV || 'local';
const apiUrl = import.meta.env.VITE_API_URL || 'Not configured';
const version = import.meta.env.VITE_APP_VERSION || 'local-dev';

const checks = [
  { name: 'Lint', description: 'ESLint checks code quality' },
  { name: 'Typecheck', description: 'TypeScript validates the project' },
  { name: 'Unit tests', description: 'Vitest runs React component tests' },
  { name: 'Build', description: 'Vite generates production assets' },
];

export default function App() {
  return (
    <main className="container">
      <header className="header"><div className="logo">⚡</div><span>FRONTEND T / CI-CD DEMO</span><span className="pill">GitHub Actions</span></header>
      <section className="hero"><div className="eyebrow">DEPLOYMENT OVERVIEW</div><h1>Ship confidently.<br /><span>Automate everything.</span></h1><p>A minimal React project demonstrating automated checks, deployment, and environment configuration.</p><div className="status"><span className="dot"/>Application running <strong>{environment}</strong></div></section>
      <section className="grid" aria-label="Deployment details test"><article className="card"><div className="card-label">ENVIRONMENT</div><div className="value">{environment}</div><p>Configured with GitHub Environment variables</p></article><article className="card"><div className="card-label">APP VERSION</div><div className="value mono" title={version}>{version.slice(0, 12)}</div><p>Derived from the deployment commit</p></article><article className="card"><div className="card-label">API ENDPOINT</div><div className="value small" title={apiUrl}>{apiUrl}</div><p>Public frontend configuration only</p></article></section>
      <section className="checks"><div className="section-heading"><h2>CI quality gates</h2><span>4 checks</span></div><div className="check-grid">{checks.map((check, index) => <article className="check" key={check.name}><div className="check-number">0{index + 1}</div><div><h3>{check.name}</h3><p>{check.description}</p></div><span className="check-icon" aria-hidden="true">✓</span></article>)}</div><p className="note">These are configured pipeline steps, not live GitHub Actions results. Check the Actions tab for actual run status.</p></section>
      <footer>Built with React, TypeScript, Vite and GitHub Actions.</footer>
    </main>
  );
}
