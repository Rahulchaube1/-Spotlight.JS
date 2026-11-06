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
      <div className="border-b border-gray-200 flex items-center justify-between">
        <div className="text-right flex justify-end py-3 px-6">
          <a href="/" className="flex items-center justify-end text-xl font-bold">
            <img src="/Spotlightjs.png" alt="Spotlight.js logo" width={900} height={775} className="h-10 w-auto mr-2 rounded-lg" />
            Spotlight.js
          </a>
        </div>
        <div className="flex items-center pr-12">
          <button onClick={() => setIsActive(!isActive)} className="p-[12px] -mr-[12px] hover:bg-gray-100 rounded-md">
            <img src={isActive ? "/cross.svg" : "/burger.svg"} alt="menu" className="w-[14px] h-[14px]" />
          </button>
        </div>
      </div>
      <div className={`bg-gray-50 flex flex-col gap-5 px-6 py-6 border-b border-gray-200 ${isActive ? "block" : "hidden"}`}>
        <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-gray-200 text-sm font-semibold">
          <a href="https://github.com/Rahulchaube1/-Spotlight.JS" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black">GitHub</a>
          <span className="text-gray-300">&middot;</span>
          <a href="https://rahulchaube1.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black">Portfolio</a>
          <span className="text-gray-300">&middot;</span>
          <a href="https://www.linkedin.com/in/rahulchaube1/" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black">LinkedIn</a>
          <span className="text-gray-300">&middot;</span>
          <a href="https://buymeacoffee.com/rahulchaube" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800">☕ Sponsor</a>
        </div>
        {Object.entries(groupedGuides).map(([category, guides]) => (
          <div key={category} className="flex flex-col gap-2">
            <div className="font-bold text-gray-900 text-sm uppercase">{category}</div>
            <div className="flex flex-col">
              {guides.map(guide => (
                <a key={guide.id} href={`/docs/${guide.id}`} className={`${activeGuideTitle === guide.data.title ? 'text-black': 'text-gray-400'} hover:text-gray-900 py-1`}>
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
