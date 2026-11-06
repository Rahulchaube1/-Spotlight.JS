import { useState } from "react";
import type { CollectionEntry } from "astro:content";

type DocsHeaderProps = {
  groupedGuides: Record<string, CollectionEntry<"guides">[]>;
  activeGuideTitle: string;
};

export function DocsHeader(props: DocsHeaderProps) {
  const { groupedGuides, activeGuideTitle } = props;
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className="border-b border-border bg-card flex items-center justify-between">
        <div className="text-right flex justify-end py-3 px-6">
          <a href="/" className="flex items-center justify-end" aria-label="Spotlight.js Home">
            <img src="/Spotlightjs.png" alt="Spotlight.js" width={900} height={775} className="h-9 w-auto rounded-lg object-contain" />
          </a>
        </div>
        <div className="flex items-center pr-12">
          <button onClick={() => setIsActive(!isActive)} className="p-[12px] -mr-[12px] hover:bg-muted rounded-md text-foreground">
            <img src={isActive ? "/cross.svg" : "/burger.svg"} alt="menu" className="w-[14px] h-[14px]" />
          </button>
        </div>
      </div>
      <div className={`bg-card flex flex-col gap-5 px-6 py-6 border-b border-border text-foreground ${isActive ? "block" : "hidden"}`}>
        <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-border text-sm font-semibold">
          <a href="https://github.com/Rahulchaube1/-Spotlight.JS" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">GitHub</a>
          <span className="text-muted-foreground">&middot;</span>
          <a href="https://rahulchaube1.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">Portfolio</a>
          <span className="text-muted-foreground">&middot;</span>
          <a href="https://www.linkedin.com/in/rahulchaube1/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">LinkedIn</a>
          <span className="text-muted-foreground">&middot;</span>
          <a href="https://buymeacoffee.com/rahulchaube" target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80 transition-colors">Sponsor</a>
        </div>
        {Object.entries(groupedGuides).map(([category, guides]) => (
          <div key={category} className="flex flex-col gap-2">
            <div className="font-bold text-foreground text-sm uppercase">{category}</div>
            <div className="flex flex-col">
              {guides.map(guide => (
                <a key={guide.id} href={`/docs/${guide.id}`} className={`${activeGuideTitle === guide.data.title ? 'text-primary font-semibold': 'text-muted-foreground'} hover:text-foreground py-1 transition-colors`}>
                  {guide.data.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
