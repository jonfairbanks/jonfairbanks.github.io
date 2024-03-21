import { WavyBackground } from "../components/ui/wavy-background";
import { LinkedInIcon } from "../components/ui/icons/LinkedInIcon"
import { PayPalIcon } from "../components/ui/icons/PayPalIcon"
import { GitHubIcon } from "../components/ui/icons/GitHubIcon"
import { HelmIcon } from "../components/ui/icons/HelmIcon"
import { DockerIcon } from "../components/ui/icons/DockerIcon"
import { EmailComponent } from "../components/ui/icons/EmailIcon"
import { SubtitleGenerator } from "../components/ui/subtitle-generator"

import { AR_One_Sans } from 'next/font/google'

const onesans = AR_One_Sans({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  return (
    <WavyBackground className={`max-w-4xl mx-auto pb-40 ${onesans.className}`}>
      &nbsp;
      &nbsp;
      <div>
        <p className="text-5xl md:text-6xl lg:text-7xl text-white font-bold inter-var text-center" style={{cursor: 'default'}}>
          Fairbanks.io
        </p>
        <SubtitleGenerator />
      </div>
      <br/>
      <div className="grid grid-cols-6">
        <div>
          <a
            href="https://github.com/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </a>
        </div>
        <div>
          <a
            href="https://www.linkedin.com/in/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </a>
        </div>
        <div>
          <a
            href="https://paypal.me/fairbanks"
            target="_blank"
            rel="noopener noreferrer"
          >
            <PayPalIcon />
          </a>
        </div>
        <div>
          <a
            href="https://jonfairbanks.github.io/helm-charts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HelmIcon />
          </a>
        </div>
        <div>
          <a
            href="https://hub.docker.com/u/jonfairbanks"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DockerIcon />
          </a>
        </div>
        <div>
          <EmailComponent />
        </div>
      </div>
    </WavyBackground>
  );
}
