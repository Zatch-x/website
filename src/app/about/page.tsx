import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { activeSocials, site } from "@/data/site";
import PageIntro from "@/components/ui/PageIntro";
import PortraitSpotlight from "@/components/about/PortraitSpotlight";
import AboutTabs from "@/components/about/AboutTabs";
import ProcessStepper from "@/components/about/ProcessStepper";
import VelocityMarquee from "@/components/ui/VelocityMarquee";
import NextPage from "@/components/ui/NextPage";
import SocialIcon from "@/components/ui/SocialIcon";

export const metadata: Metadata = {
  title: `About — ${site.name}`,
  description: `About ${site.name} — a developer working where technology, visual storytelling and interaction meet.`,
};

export default function AboutPage() {
  return (
    <>
      <PageIntro index="02" eyebrow="About" lines={[{ text: "Curious mind." }, { text: "Careful craft.", serif: true }]}>
        <p className="pi-lead">
          I’m a computer applications student and developer who enjoys turning complex ideas into clear, engaging digital
          experiences.
        </p>
      </PageIntro>

      <section className="section about-story" aria-label="My story">
        <div className="wrap about-story-grid">
          <div data-reveal>
            <PortraitSpotlight />
          </div>
          <div className="about-copy">
            <p data-reveal>
              I completed my BCA at St. Joseph University, Nagaland, and I’m currently pursuing an MCA in Cybersecurity and
              Networking at Galgotias University. Alongside my studies, I explore frontend engineering, AI-powered tools, and
              the details that make a website feel considered.
            </p>
            <p data-reveal>
              I also bring two years of experience with{" "}
              <a className="inline-link" href="https://www.rivyneofficial.com/" target="_blank" rel="noreferrer">
                RivyneOfficial.com
              </a>
              .
            </p>
            <div data-reveal>
              <AboutTabs />
            </div>
            {activeSocials.length > 0 && (
              <ul className="about-socials" data-reveal>
                {activeSocials.map((s) => (
                  <li key={s.label}>
                    <a className="copy-btn" href={s.url} target="_blank" rel="noreferrer">
                      <SocialIcon label={s.label} size={15} /> {s.label} <ArrowUpRight size={14} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <VelocityMarquee items={["Design", "Code", "Experiment", "Motion", "AI tools", "Cybersecurity", "Networking"]} tone="accent" />

      <ProcessStepper />

      <NextPage href="/journey" label="Journey" />
    </>
  );
}
