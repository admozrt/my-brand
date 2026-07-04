import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PosterCta {
  label: string;
  to?: string;
  href?: string;
}

interface PosterHeroProps {
  headline: string;
  subheadline: string;
  image?: string;
  imageAlt: string;
  badgeLabel: string;
  primaryCta: PosterCta;
  secondaryCta: PosterCta;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const headlineContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Small pointer-driven magnetic wrapper. Displacement is capped and spring-damped for a compact, non-gimmicky feel. */
function MagneticButton({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  if (reduce) return <>{children}</>;

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-6, Math.min(6, relX * 0.25)));
    y.set(Math.max(-6, Math.min(6, relY * 0.25)));
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: springX, y: springY }} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      {children}
    </motion.div>
  );
}

export function PosterHero({ headline, subheadline, image, imageAlt, badgeLabel, primaryCta, secondaryCta }: PosterHeroProps) {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 20 });
  const badgeX = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 22 });
  const badgeY = useSpring(useTransform(py, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 22 });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse' || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  const words = headline.split(' ');

  return (
    <section className="px-4 md:px-10 pt-10 md:pt-20 pb-14 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="order-2 md:order-1">
          <motion.h1
            variants={reduce ? undefined : headlineContainer}
            initial={reduce ? false : 'hidden'}
            animate={reduce ? undefined : 'show'}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-neutral-text flex flex-wrap gap-x-2.5"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={reduce ? undefined : wordVariant} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            className="mt-5 text-base md:text-lg text-neutral-text/60 max-w-md leading-relaxed"
          >
            {subheadline}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton>
              <Button asChild>
                {primaryCta.to ? (
                  <Link to={primaryCta.to}>{primaryCta.label}</Link>
                ) : (
                  <a href={primaryCta.href} target="_blank" rel="noreferrer">
                    {primaryCta.label}
                  </a>
                )}
              </Button>
            </MagneticButton>
            <Button asChild variant="outline">
              {secondaryCta.to ? (
                <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
              ) : (
                <a href={secondaryCta.href} target="_blank" rel="noreferrer">
                  {secondaryCta.label}
                </a>
              )}
            </Button>
          </motion.div>
        </div>

        <motion.div
          ref={frameRef}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ perspective: 1000 }}
          className="order-1 md:order-2 relative"
        >
          <motion.div
            style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="aspect-4/5 rounded-[1.25rem] overflow-hidden bg-neutral-text/5"
          >
            {image && (
              <img src={image} alt={imageAlt} className="h-full w-full object-cover" draggable={false} />
            )}
          </motion.div>

          <motion.div
            style={reduce ? undefined : { x: badgeX, y: badgeY }}
            initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.5 }}
            className="absolute -bottom-4 -left-4 md:-left-6 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2 border border-neutral-text/8"
          >
            <Sparkle className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <span className="font-heading text-sm font-semibold text-neutral-text whitespace-nowrap">
              {badgeLabel}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
