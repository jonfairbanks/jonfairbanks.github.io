import Image from "next/image";
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
    <WavyBackground className={`max-w-4xl mx-auto pb-40 ${league.className}`}>
      <div>
        {/* <p className="text-5xl md:text-6xl lg:text-7xl text-white font-bold inter-var text-center" style={{cursor: 'default'}}>
          Fairbanks.io
        </p> */}
        <div id="logo" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image src="/logo.svg" alt="Fairbanks.io" width={553} height={142} priority />
        </div>
        <div>
          <SubtitleGenerator />
        </div>
      </div>
      <br/>
      <div className="grid grid-cols-6">
        <div className="icon-container">
          <a
            href="https://github.com/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <GitHubIcon />
          </a>
        </div>
        <div className="icon-container">
          <a
            href="https://www.linkedin.com/in/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <LinkedInIcon />
          </a>
        </div>
        <div className="icon-container">
          <a
            href="https://paypal.me/fairbanks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PayPal profile"
          >
            <PayPalIcon />
          </a>
        </div>
        <div className="icon-container">
          <a
            href="https://jonfairbanks.github.io/helm-charts"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Helm charts"
          >
            <HelmIcon />
          </a>
        </div>
        <div className="icon-container">
          <a
            href="https://hub.docker.com/u/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Docker Hub profile"
          >
            <DockerIcon />
          </a>
        </div>
        <div className="icon-container">
          <EmailComponent />
        </div>
      </div>
    </WavyBackground>
  );
}
