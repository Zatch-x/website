import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="not-found wrap">
      <p className="eyebrow">
        <span className="eyebrow-line" /> Error 404
      </p>
      <h1 className="section-title">
        This page
        <br />
        <span className="serif">doesn’t exist.</span>
      </h1>
      <Link href="/" className="btn btn--primary">
        <ArrowLeft size={16} aria-hidden /> Back home
      </Link>
    </section>
  );
}
