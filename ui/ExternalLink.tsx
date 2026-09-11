import { cn } from '@/lib/className';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

interface Props {
  arrow?: boolean;
  children: React.ReactNode;
  className?: string;
  href: string;
  underline?: boolean;
}

export default function ExternalLink({
  href,
  children,
  arrow = true,
  underline = true,
  className,
}: Props) {
  return (
    <>
      <a
        className={cn(
          underline
            ? "underline underline-offset-[3px] hover:bg-[url('/repo/static/squiggle.svg')] hover:no-underline"
            : '',
          'text-secondary',
          'inline-block',
          className ? className : '',
        )}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
      {arrow && (
        <ArrowUpRightIcon
          aria-hidden="true"
          className="ml-0.5 inline-block h-3 w-3"
        />
      )}
    </>
  );
}
