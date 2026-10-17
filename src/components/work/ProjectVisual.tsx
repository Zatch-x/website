import type { ProjectVisualKind } from "@/data/portfolio";

interface ProjectVisualProps {
  kind: ProjectVisualKind;
  number: string;
  category: string;
  status: string;
  /** Compact version for hover previews and small cards. */
  compact?: boolean;
  className?: string;
}

/**
 * Illustrative, code-drawn artwork for each project. These are NOT screenshots —
 * every instance carries an "Illustrative" label. Swap in real images on the case study pages.
 */
export default function ProjectVisual({ kind, number, category, status, compact, className }: ProjectVisualProps) {
  return (
    <div className={`pv pv--${kind} ${compact ? "pv--compact" : ""} ${className ?? ""}`} aria-hidden="true">
      <div className="pv-top">
        <span>{number} / Selected project</span>
        <span>{category}</span>
      </div>

      {kind === "video" && (
        <div className="pv-video">
          <div className="pv-orbit pv-orbit--one" />
          <div className="pv-orbit pv-orbit--two" />
          <div className="pv-core">
            <span>AI</span>
            <small>to motion</small>
          </div>
          <div className="pv-frames">
            <i />
            <i />
            <i />
          </div>
          <div className="pv-tag">Prompt → Story → Video</div>
        </div>
      )}

      {kind === "tadkaa" && (
        <div className="pv-tadkaa">
          <span>TA</span>
          <span>DK</span>
          <span>
            AA<em>✳</em>
          </span>
        </div>
      )}

      {kind === "deepfake" && (
        <div className="pv-deepfake">
          <div className="pv-face">
            <span className="pv-face-grid" />
            <span className="pv-scan" />
          </div>
          <span className="pv-df-caption">Authenticity / under review</span>
          <b>Real / Synthetic</b>
        </div>
      )}

      {kind === "registration" && (
        <div className="pv-registration">
          <div className="pv-reg-window">
            <div className="pv-reg-top">
              <i />
              <i />
              <i />
              <span>Student / portal</span>
            </div>
            <div className="pv-reg-title">
              Registration
              <br />
              <em>made simple.</em>
            </div>
            <div className="pv-reg-lines">
              <i />
              <i />
              <i />
            </div>
            <div className="pv-reg-button">Submit form ↗</div>
          </div>
        </div>
      )}

      <div className="pv-bottom">
        <span className="pv-status">{status}</span>
        <span className="pv-illustrative">Illustrative</span>
      </div>
    </div>
  );
}
