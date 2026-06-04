import { ChevronDown } from "lucide-react";
import type { InstitutionalPageContent } from "../data/institutionalPages";

type InstitutionalPageProps = {
  page: InstitutionalPageContent;
  eyebrow?: string;
};

const InstitutionalPage = ({
  page,
  eyebrow = "Institucional",
}: InstitutionalPageProps) => {
  return (
    <section className="container !mx-auto !px-4 !py-10 sm:!px-6 lg:!px-0 lg:!py-14">
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
          {eyebrow}
        </span>

        <h1 className="!mt-3 font-[family-name:var(--font-bebas)] text-5xl leading-none sm:text-6xl">
          {page.title}
        </h1>

        <p className="!mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
          {page.description}
        </p>
      </div>

      <div className="!mt-10 grid gap-4">
        {page.sections.map((section, index) => (
          <details
            key={section.title}
            className="group rounded-lg border border-zinc-200 bg-white !p-5"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <h2 className="text-base font-bold sm:text-lg">
                {section.title}
              </h2>

              <ChevronDown
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>

            <div className="!mt-4 space-y-4 border-t border-zinc-100 !pt-4 text-sm leading-7 text-zinc-600">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.items && (
                <ul className="list-disc space-y-2 !pl-5">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default InstitutionalPage;
