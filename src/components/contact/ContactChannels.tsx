import { ArrowUpRight, Mail } from "lucide-react";
import { activeSocials, site } from "@/data/site";
import CopyEmailButton from "@/components/ui/CopyEmailButton";
import LocalTime from "@/components/ui/LocalTime";
import SocialIcon from "@/components/ui/SocialIcon";

/** Direct ways to reach Vicky: email (copy / open), social profiles and local time. */
export default function ContactChannels() {
  return (
    <div className="channels">
      <p className="channels-lead" data-reveal>
        Have a project, an opportunity, or just want to talk about the web? My inbox is one click away.
      </p>

      <div className="channels-email" data-reveal>
        <a className="contact-email" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <div className="contact-direct-actions">
          <CopyEmailButton />
          <a className="copy-btn" href={`mailto:${site.email}`}>
            <Mail size={15} aria-hidden />
            <span>Open mail app</span>
          </a>
        </div>
      </div>

      {activeSocials.length > 0 && (
        <ul className="channel-list" data-reveal="stagger">
          {activeSocials.map((s, i) => (
            <li key={s.label}>
              <a className="channel" href={s.url} target="_blank" rel="noreferrer" data-cursor="open">
                <span className="channel-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="channel-name">
                  <SocialIcon label={s.label} size={26} />
                  {s.label}
                </span>
                <span className="channel-handle">{s.handle}</span>
                <span className="channel-arrow" aria-hidden>
                  <ArrowUpRight size={20} />
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="channels-meta" data-reveal>
        <div>
          <span className="footer-heading">Local time</span>
          <LocalTime className="channels-time" />
        </div>
        <div>
          <span className="footer-heading">Based in</span>
          <span className="channels-time">{site.location}</span>
        </div>
      </div>
    </div>
  );
}
