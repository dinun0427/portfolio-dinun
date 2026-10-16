import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
      © {new Date().getFullYear()} {profile.name}. Built with Next.js,
      TypeScript and Tailwind CSS.
    </footer>
  );
}