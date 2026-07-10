import Image from "next/image";
import { League_Spartan } from "next/font/google";
import { TrackedLink } from "../components/analytics/TrackedLink";
import { EmailComponent } from "../components/ui/icons/EmailIcon";
import { WavyBackground } from "../components/ui/wavy-background";

const league = League_Spartan({
  subsets: ["latin"],
  variable: "--font-display",
});

const workLinks = [
  {
    eyebrow: "Open source",
    title: "Helm charts",
    detail: "Reusable Kubernetes packages",
    href: "https://jonfairbanks.github.io/helm-charts",
    analyticsTarget: "helm_charts" as const,
  },
  {
    eyebrow: "Containers",
    title: "Docker Hub",
    detail: "Published images and utilities",
    href: "https://hub.docker.com/u/jonfairbanks",
    analyticsTarget: "docker_hub" as const,
  },
];

export default function Home() {
  return (
    <WavyBackground
      backgroundFill="#080a0c"
      blur={14}
      colors={["#d6ae72", "#87a9c3", "#20384d", "#f0d3a2"]}
      containerClassName="landing-shell"
      speed="slow"
      waveOpacity={0.34}
      waveWidth={64}
    >
      <div className={`${league.variable} landing-frame`}>
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Fairbanks.io home">
            <Image
              src="/logo.svg"
              alt="Fairbanks.io"
              width={553}
              height={142}
              priority
            />
          </a>

          <nav className="top-nav" aria-label="Primary navigation">
            <TrackedLink
              href="https://github.com/jonfairbanks"
              target="_blank"
              rel="noopener noreferrer"
              analyticsTarget="github"
              analyticsLabel="GitHub profile"
            >
              GitHub <span aria-hidden="true">↗</span>
            </TrackedLink>
            <TrackedLink
              href="https://www.linkedin.com/in/jonfairbanks"
              target="_blank"
              rel="noopener noreferrer"
              analyticsTarget="linkedin"
              analyticsLabel="LinkedIn profile"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </TrackedLink>
          </nav>
        </header>

        <main id="top" className="hero-grid">
          <section className="hero-copy" aria-labelledby="hero-heading">
            <p className="kicker">Cloud infrastructure · Developer tooling</p>
            <h1 id="hero-heading">
              I build resilient platforms for teams that ship.
            </h1>
            <p className="hero-summary">
              Practical cloud systems, thoughtful automation, and tools that
              make complex work feel dependable.
            </p>

            <div className="hero-actions">
              <TrackedLink
                className="primary-action"
                href="https://github.com/jonfairbanks"
                target="_blank"
                rel="noopener noreferrer"
                analyticsTarget="github"
                analyticsLabel="Explore GitHub"
              >
                Explore GitHub <span aria-hidden="true">↗</span>
              </TrackedLink>
              <EmailComponent />
            </div>
          </section>

          <section className="selected-work" aria-labelledby="work-heading">
            <div className="section-label">
              <span id="work-heading">Selected surfaces</span>
              <span>02</span>
            </div>

            <div className="work-list">
              {workLinks.map((item, index) => (
                <TrackedLink
                  className="work-link"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  analyticsTarget={item.analyticsTarget}
                  analyticsLabel={item.title}
                  key={item.title}
                >
                  <span className="work-index">0{index + 1}</span>
                  <span className="work-copy">
                    <span className="work-eyebrow">{item.eyebrow}</span>
                    <strong>{item.title}</strong>
                    <span className="work-detail">{item.detail}</span>
                  </span>
                  <span className="work-arrow" aria-hidden="true">↗</span>
                </TrackedLink>
              ))}
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <span>Jon Fairbanks · Cloud &amp; DevOps</span>
          <TrackedLink
            href="https://paypal.me/fairbanks"
            target="_blank"
            rel="noopener noreferrer"
            analyticsTarget="paypal"
            analyticsLabel="PayPal profile"
          >
            Support <span aria-hidden="true">↗</span>
          </TrackedLink>
        </footer>
      </div>
    </WavyBackground>
  );
}
