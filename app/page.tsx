import Image from "next/image";
import { TrackedLink } from "../components/analytics/TrackedLink";
import { WavyBackground } from "../components/ui/wavy-background";
import { LinkedInIcon } from "../components/ui/icons/LinkedInIcon"
import { PayPalIcon } from "../components/ui/icons/PayPalIcon"
import { GitHubIcon } from "../components/ui/icons/GitHubIcon"
import { HelmIcon } from "../components/ui/icons/HelmIcon"
import { DockerIcon } from "../components/ui/icons/DockerIcon"
import { EmailComponent } from "../components/ui/icons/EmailIcon"
import { SubtitleGenerator } from "../components/ui/subtitle-generator"

import { League_Spartan } from 'next/font/google'

const league = League_Spartan({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  return (
    <WavyBackground className={`w-full max-w-4xl mx-auto px-4 pb-16 sm:pb-24 md:pb-40 ${league.className}`}>
      <div>
        {/* <p className="text-5xl md:text-6xl lg:text-7xl text-white font-bold inter-var text-center" style={{cursor: 'default'}}>
          Fairbanks.io
        </p> */}
        <div id="logo" className="flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Fairbanks.io"
            width={553}
            height={142}
            className="h-auto w-[min(72vw,553px)]"
            priority
          />
        </div>
        <div>
          <SubtitleGenerator />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-6 gap-3 sm:gap-4">
        <div className="icon-container">
          <TrackedLink
            href="https://github.com/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            analyticsTarget="github"
            analyticsLabel="GitHub profile"
          >
            <GitHubIcon />
          </TrackedLink>
        </div>
        <div className="icon-container">
          <TrackedLink
            href="https://www.linkedin.com/in/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            analyticsTarget="linkedin"
            analyticsLabel="LinkedIn profile"
          >
            <LinkedInIcon />
          </TrackedLink>
        </div>
        <div className="icon-container">
          <TrackedLink
            href="https://paypal.me/fairbanks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PayPal profile"
            analyticsTarget="paypal"
            analyticsLabel="PayPal profile"
          >
            <PayPalIcon />
          </TrackedLink>
        </div>
        <div className="icon-container">
          <TrackedLink
            href="https://jonfairbanks.github.io/helm-charts"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Helm charts"
            analyticsTarget="helm_charts"
            analyticsLabel="Helm charts"
          >
            <HelmIcon />
          </TrackedLink>
        </div>
        <div className="icon-container">
          <TrackedLink
            href="https://hub.docker.com/u/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Docker Hub profile"
            analyticsTarget="docker_hub"
            analyticsLabel="Docker Hub profile"
          >
            <DockerIcon />
          </TrackedLink>
        </div>
        <div className="icon-container">
          <EmailComponent />
        </div>
      </div>
    </WavyBackground>
  );
}
