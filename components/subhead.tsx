"use client";

type SubheadingProps = {
  name: string;
};

export default function Subheading({ name }: SubheadingProps) {
  return (
    <h2
      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide text-foreground select-none`}
    >
      {name}
    </h2>
  );
}
