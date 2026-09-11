import { projects } from '@/data/projects';
import ExternalLink from '@/ui/ExternalLink';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 text-sm sm:text-base">
      <Header />
      <Projects />
      <Contact />
      <AboutMe />
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="relative h-12 w-12">
        <Image
          alt="Eric Tan"
          className="rounded-full object-cover"
          height={48}
          src="/static/images/logo.png"
          width={48}
        />
      </div>
      <div className="flex flex-col">
        <h1>Eric Tan</h1>
        <p className="text-quaternary">Software Engineer</p>
      </div>
    </div>
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

function Contact() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-tertiary">Social</p>
      <div className="grid grid-cols-3 gap-4">
        <ContactLink
          href="https://github.com/erict16"
          title="GitHub"
          website="Code"
        />
        <ContactLink
          href="https://www.linkedin.com/in/helloerictan/"
          title="LinkedIn"
          website="Profile"
        />
        <ContactLink
          href="mailto:eric.tan@huaming.com"
          title="Email"
          website="eric.tan@huaming.com"
        />
      </div>
    </div>
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
      <div className="text-secondary flex flex-col gap-8">
        <p>
          I work overseas sales at Shanghai Huaming Power Equipment. I also
          build small tools around that work: tap-changer selection, drawing
          translation, order sheets.
        </p>
        <p>
          Reach me at{' '}
          <ExternalLink href="mailto:eric.tan@huaming.com">
            <i>eric.tan@huaming.com</i>
          </ExternalLink>
          .
        </p>
      </div>
    </div>
  );
}
