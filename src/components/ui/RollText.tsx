/** Text that rolls up to a duplicate on hover/focus of its closest `.roll-host` parent. Pure CSS. */
export default function RollText({ children }: { children: string }) {
  return (
    <span className="roll" data-text={children}>
      <span className="roll-inner">{children}</span>
    </span>
  );
}
