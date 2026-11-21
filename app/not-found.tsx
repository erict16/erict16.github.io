import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="lost" id="main-content">
      <h1 className="display">
        Page <em>not found</em>.
      </h1>
      <Link className="btn primary" href="/">
        Home
      </Link>
    </main>
  );
}
