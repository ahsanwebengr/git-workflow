import './App.css';

export default function DevFeature() {
  return (
    <div className='dev-feature'>
      <div className='dev-banner'>DEV FEATURE (visible on dev branch)</div>
      <h4>Experimental: Quick Preview</h4>
      <p>
        This area contains a feature currently active on the <strong>dev</strong> branch
        only.
      </p>
      <ul>
        <li>Try it while developing locally.</li>
        <li>Merge to main when ready for release.</li>
      </ul>
    </div>
  );
}
