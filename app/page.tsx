import { About } from "@/components/About";
import { Background } from "@/components/Background";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Now } from "@/components/Now";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { profile, socials } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import { SignatureIntro } from "@/components/SignatureIntro";
import { SmoothScroll } from "@/components/SmoothScroll";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  sameAs: socials
    .filter((social) => social.href.startsWith("https://"))
    .map((social) => social.href),
};

export default function Home() {
  return (
    <>
      <SignatureIntro />
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent-violet focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Background />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Now />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
