import { projects, ragdoll } from '@/data/projects';
import { EMAIL, GITHUB, LINKEDIN } from '@/lib/site';
import { EnvelopeLogo, GitHubLogo, LinkedInLogo } from '@/ui/Icons';
import RagdollDemo from '@/ui/RagdollDemo';
import SearchDemo from '@/ui/SearchDemo';
import Terminal from '@/ui/Terminal';
import TypeCode from '@/ui/TypeCode';
import TypingBook from '@/ui/TypingBook';
import UndoSend from '@/ui/UndoSend';
import { ArrowDownIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { CSSProperties, ReactNode } from 'react';

const NAME = 'Eric Tan';
const DAYS_DONE = 17;

const delay = (step: number) => ({ '--d': `${step * 90}ms` } as CSSProperties);

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <Ragdoll />
        <Work />
      </main>
      <Contact />
    </>
  );
}

function Nav() {
  return (
    <header className="nav" data-nav>
      <div className="wrap">
        <a className="nav-me" href="#top">
          <Image alt="" height={28} src="/static/images/logo.png" width={28} />
          {NAME}
        </a>
        <nav aria-label="Main">
          <a href="#ragdoll">Ragdoll Mail</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <a aria-label="GitHub" className="nav-icon" href={GITHUB}>
            <GitHubLogo className="icon" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div aria-hidden="true" className="hero-cat" data-cat>
        <Image
          alt=""
          height={256}
          src="/static/home/ragdoll-icon.webp"
          width={256}
        />
      </div>
      <div className="wrap">
        <div className="hero-copy">
          <p className="eyebrow">Full-stack dev</p>
          <h1 aria-label={NAME}>
            {[...NAME].map((letter, index) => (
              <span
                aria-hidden="true"
                key={index}
                style={{ '--i': index } as CSSProperties}
              >
                {letter === ' ' ? ' ' : letter}
              </span>
            ))}
          </h1>
          <p className="lead">I build small tools that do one job well.</p>
          <a className="btn primary" href="#ragdoll">
            See my work
            <ArrowDownIcon aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Ragdoll() {
  return (
    <section className="section" id="ragdoll">
      <div className="wrap">
        <div className="rag-head">
          <p className="rag-name" data-reveal>
            <Image
              alt=""
              height={44}
              src="/static/home/ragdoll-icon.webp"
              width={44}
            />
            {ragdoll.title}
          </p>
          <h2 className="display" data-reveal style={delay(1)}>
            The mail app your <em>AI agent</em> can use.
          </h2>
          <p className="intro" data-reveal style={delay(2)}>
            A free mail app for Mac and Windows with a command line built in.
            Claude Code, Codex and other agents can search your mail and write
            replies. Nothing is sent until you press Send.
          </p>
          <div className="actions" data-reveal style={delay(3)}>
            <a className="btn primary" href={ragdoll.href}>
              Get Ragdoll Mail
              <ArrowUpRightIcon aria-hidden="true" />
            </a>
            <a className="btn" href={ragdoll.github}>
              <GitHubLogo className="icon" />
              Source
            </a>
          </div>
        </div>

        <RagdollDemo />

        <div className="rag-grid">
          <Card className="rag-term" step={0}>
            <Terminal />
            <CardText text="Each reply is saved as a draft and checked. It goes out only after you say yes.">
              Agents draft. You send.
            </CardText>
          </Card>
          <Card className="rag-side" step={1}>
            <SearchDemo />
            <CardText text="The index is on your own computer. Results show while you type, with no internet too.">
              Search that finds the mail.
            </CardText>
          </Card>
          <Card className="rag-side" step={2}>
            <UndoSend />
            <CardText text="You have up to 30 seconds to take a mail back.">
              Hard to send a mistake.
            </CardText>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const { anatomy, selector, tavern, typebooks, words } = projects;
  return (
    <section className="section" id="work">
      <div className="wrap">
        <h2 className="display" data-reveal>
          More things <em>I made</em>.
        </h2>
        <div className="work-grid">
          <Card className="work-tavern" href={tavern.href} step={0} tilt>
            <Image
              alt="The Drunken Dragon title screen: a dwarf, an elf, a goblin, a wizard, a bard and a red dragon at a poker table in a tavern"
              className="shot"
              height={1000}
              src="/static/home/tavern.webp"
              width={1600}
            />
            <CardText arrow text={tavern.description}>
              {tavern.title}
            </CardText>
          </Card>
          <Card className="work-anatomy" href={anatomy.href} step={1} tilt>
            <Image
              alt="A tap changer shown as a 3D model, with its parts in different colours"
              className="shot"
              height={1030}
              src="/static/home/anatomy.webp"
              width={800}
            />
            <CardText arrow text={anatomy.description}>
              {anatomy.title}
            </CardText>
          </Card>
          <Card className="work-selector" href={selector.href} step={0}>
            <div className="visual">
              <TypeCode />
            </div>
            <CardText arrow text={selector.description}>
              {selector.title}
            </CardText>
          </Card>
          <Card className="work-typebooks" href={typebooks.href} step={1}>
            <div className="visual">
              <TypingBook />
            </div>
            <CardText arrow text={typebooks.description}>
              {typebooks.title}
            </CardText>
          </Card>
          <Card className="work-words" href={words.href} step={2}>
            <div className="visual">
              <div aria-hidden="true" className="days">
                {Array.from({ length: 28 }, (_, day) => (
                  <i
                    className={
                      day < DAYS_DONE
                        ? 'done'
                        : day === DAYS_DONE
                        ? 'today'
                        : ''
                    }
                    key={day}
                    style={{ '--i': day } as CSSProperties}
                  >
                    {day < DAYS_DONE && <CheckIcon />}
                  </i>
                ))}
              </div>
            </div>
            <CardText arrow text={words.description}>
              {words.title}
            </CardText>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="wrap">
        <div aria-hidden="true" className="contact-sphere" data-sphere />
        <h2 className="display" data-reveal>
          Say <em>hello</em>.
        </h2>
        <a
          className="mail"
          data-reveal
          href={`mailto:${EMAIL}`}
          style={delay(1)}
        >
          {EMAIL}
        </a>
        <div className="foot">
          <p>“What invisible creates visible.”</p>
          <ul>
            <li>
              <a aria-label="GitHub" href={GITHUB}>
                <GitHubLogo className="icon" />
              </a>
            </li>
            <li>
              <a aria-label="LinkedIn" href={LINKEDIN}>
                <LinkedInLogo className="icon" />
              </a>
            </li>
            <li>
              <a aria-label="Email" href={`mailto:${EMAIL}`}>
                <EnvelopeLogo className="icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function Card({
  children,
  className,
  href,
  step,
  tilt,
}: {
  children: ReactNode;
  className: string;
  href?: string;
  step: number;
  tilt?: boolean;
}) {
  const props = {
    className: `card ${className}`,
    'data-reveal': true,
    'data-spot': tilt ? 'tilt' : 'glow',
    style: delay(step),
  };
  return href ? (
    <a {...props} href={href}>
      {children}
    </a>
  ) : (
    <div {...props}>{children}</div>
  );
}

function CardText({
  arrow,
  children,
  text,
}: {
  arrow?: boolean;
  children: ReactNode;
  text: string;
}) {
  return (
    <div className="card-text">
      <h3>
        {children}
        {arrow && <ArrowUpRightIcon aria-hidden="true" />}
      </h3>
      <p>{text}</p>
    </div>
  );
}
