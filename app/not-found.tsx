import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark text-text-primary font-mono gap-4">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-text-secondary">This page doesn&apos;t exist.</p>
      <Link href="/" className="text-primary-300 hover:text-primary-200 underline underline-offset-4">
        Back home
      </Link>
    </div>
  );
}
