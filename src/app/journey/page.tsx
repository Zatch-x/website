import type { Metadata } from "next";
import { site } from "@/data/site";
import PageIntro from "@/components/ui/PageIntro";
import StatCounters from "@/components/journey/StatCounters";
import Timeline from "@/components/journey/Timeline";
import VelocityMarquee from "@/components/ui/VelocityMarquee";
import NextPage from "@/components/ui/NextPage";

export const metadata: Metadata = {
  title: `Journey — ${site.name}`,
  description: `Education and experience of ${site.name}.`,
};

export default function JourneyPage() {
  return (
    <>
      <PageIntro index="04" eyebrow="Journey" lines={[{ text: "Education &" }, { text: "experience.", serif: true }]}>
        <p className="pi-lead">
          Two years of hands-on experience with RivyneOfficial.com, a BCA behind me, and an MCA in Cybersecurity and
          Networking under way.
        </p>
      </PageIntro>
      <StatCounters />
      <Timeline />
      <VelocityMarquee items={["Experience", "RivyneOfficial.com", "MCA", "Galgotias University", "BCA", "St. Joseph University"]} />
      <NextPage href="/contact" label="Contact" />
    </>
  );
}
