import { getImageProps } from "next/image";

const common = { alt: "", fill: true, sizes: "100vw", quality: 75 } as const;

export default function Background() {
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/bg/bus-interior.webp" });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/bg/bus-interior-mobile.webp" });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="fallback-sky absolute inset-0" />

      <div className="bus-sway absolute inset-0">
        <picture>
          <source media="(max-aspect-ratio: 3/4)" srcSet={mobile} />
          <source srcSet={desktop} />
          <img
            {...rest}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="bg-art h-full w-full object-cover"
          />
        </picture>
      </div>

      <div className="absolute inset-x-0 top-0 h-[32%] bg-gradient-to-b from-deep-brown/75 via-deep-brown/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-deep-brown/85 via-deep-brown/35 to-transparent" />
      <div className="grain absolute inset-0 opacity-[0.14]" />
    </div>
  );
}
