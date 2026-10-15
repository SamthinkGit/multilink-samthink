/*
  The headline: a shell path in mono, the name in Alliance (the face of
  materiacore.com).
*/
export function Wordmark() {
  return (
    <h1 className="font-sans text-[clamp(2.4rem,11vw,3.25rem)] leading-none font-light tracking-[-0.03em]">
      <span
        aria-hidden
        className="text-muted-foreground mr-[0.12em] font-mono text-[0.62em] font-extralight tracking-normal"
      >
        ~/
      </span>
      samthink
    </h1>
  );
}
