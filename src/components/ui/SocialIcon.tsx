import { Github, Linkedin } from "lucide-react";

/** Brand mark for a social profile label; renders nothing for unknown labels. */
export default function SocialIcon({ label, size = 16 }: { label: string; size?: number }) {
  const key = label.toLowerCase();
  if (key === "github") return <Github size={size} aria-hidden strokeWidth={1.75} />;
  if (key === "linkedin") return <Linkedin size={size} aria-hidden strokeWidth={1.75} />;
  return null;
}
