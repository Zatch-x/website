import type { Metadata } from "next";
import { site } from "@/data/site";
import PageIntro from "@/components/ui/PageIntro";
import ContactChannels from "@/components/contact/ContactChannels";
import ContactForm from "@/components/contact/ContactForm";
import NextPage from "@/components/ui/NextPage";

export const metadata: Metadata = {
  title: `Contact — ${site.name}`,
  description: `Get in touch with ${site.name} about a project, an opportunity, or the web.`,
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        index="05"
        eyebrow="Contact"
        lines={[{ text: "Let’s make" }, { text: "something matter.", serif: true }]}
        aside={<span className="pi-hint">Have a good idea?</span>}
      />
      <section className="section contact-page" aria-label="Contact options">
        <div className="wrap contact-grid">
          <ContactChannels />
          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </section>
      <NextPage href="/#work" label="Back to the work" kicker="While you’re here" />
    </>
  );
}
