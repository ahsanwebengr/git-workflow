import './App.css';

function App() {
  return (
    <div className='landing'>
      <header className='hero'>
        <h1 className='title'>Welcome to Git Workflow</h1>
        <p className='subtitle'>Simple, fast starter for your React projects.</p>
        <div className='cta-row'>
          <a className='btn primary' href='#get-started'>
            Get Started
          </a>
          <a className='btn ghost' href='#learn-more'>
            Learn more
          </a>
        </div>
      </header>

      <section id='features' className='features'>
        <div className='feature'>
          <h3>Fast</h3>
          <p>Vite-powered dev server for instant feedback.</p>
        </div>
        <div className='feature'>
          <h3>Minimal</h3>
          <p>Minimal boilerplate so you can focus on code.</p>
        </div>
        <div className='feature'>
          <h3>Extensible</h3>
          <p>Easily add libraries and components as needed.</p>
        </div>
      </section>

      <footer className='footer'>
        <p>Made with ♥ — modify `src/App.jsx` to customize.</p>
      </footer>
    </div>
  );
}

export default App;
