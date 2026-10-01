import { projects } from '@/data/projects';
import { EMAIL } from '@/lib/site';
import ExternalLink from '@/ui/ExternalLink';
import { EnvelopeLogo, GitHubLogo, LinkedInLogo } from '@/ui/Icons';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-8 text-sm sm:text-base">
      <Header />
      <Projects />
      <AboutMe />
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="relative h-12 w-12 shrink-0">
        <Image
          alt="Eric Tan"
          className="rounded-full object-cover"
          height={48}
          src="/static/images/logo.png"
          width={48}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h1>Eric Tan</h1>
        <p className="text-quaternary">Full-stack Dev</p>
      </div>
      <SocialLinks />
    </div>
  );
}

function SocialLinks() {
  return (
    <nav aria-label="Social">
      <ul className="flex items-center gap-3">
        <li>
          <a
            aria-label="GitHub"
            className="text-quaternary hover:text-primary inline-flex rounded-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            href="https://github.com/erict16"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubLogo className="h-5 w-5 fill-current" />
          </a>
        </li>
        <li>
          <a
            aria-label="LinkedIn"
            className="text-quaternary hover:text-primary inline-flex rounded-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            href="https://www.linkedin.com/in/helloerictan/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <LinkedInLogo className="h-5 w-5 fill-current" />
          </a>
        </li>
        <li>
          <a
            aria-label="Email"
            className="text-quaternary hover:text-primary inline-flex rounded-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            href={`mailto:${EMAIL}`}
          >
            <EnvelopeLogo className="h-5 w-5 fill-current" />
          </a>
        </li>
      </ul>
    </nav>
  );
}

function ContactLink({
  href,
  title,
  website,
}: {
  href: string;
  title: string;
  website?: string;
}) {
  return (
    <span className="block items-center gap-4">
      <a
        className="text-secondary hover:text-primary inline-flex items-center gap-1 transition-opacity duration-150"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {title}
        <ArrowUpRightIcon aria-hidden="true" className="h-3 w-3" />
      </a>
      {website && <p className="text-quaternary text-xs">{website}</p>}
    </span>
  );
}

function Projects() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-tertiary">Projects</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <ContactLink
            href={project.href}
            key={project.title}
            title={`${project.emoji} ${project.title}`}
            website={project.description}
          />
        ))}
      </div>
    </div>
  );
}

function AboutMe() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-tertiary">About me</p>
      <div className="text-secondary flex flex-col gap-3">
        <p>
          I build small tools: tap-changer selection, drawing translation, order
          sheets.
        </p>
        <p>
          If you have any feedback, don&apos;t hesitate to email me at{' '}
          <ExternalLink href={`mailto:${EMAIL}`}>
            <i>{EMAIL}</i>
          </ExternalLink>
          .
        </p>
      </div>
    </div>
  );
}
