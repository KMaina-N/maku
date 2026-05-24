import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS } from "@/lib/projects";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for build performance
export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

// Added async here to allow awaiting params
export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  // Unwrapping the params Promise as required by newer Next.js versions
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-[#080808] text-zinc-400 min-h-screen py-24 px-6 md:px-12 lg:px-24 font-mono antialiased">
      <div className="max-w-[1280px] mx-auto space-y-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-label text-xs tracking-widest text-zinc-400 hover:text-maku-green transition-colors duration-300 uppercase select-none outline-none group"
        >
          <svg
            className="w-3 h-3 transform transition-transform duration-300 group-hover:-translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Home</span>
        </Link>
        {/* HERO TITLE BLOCK */}
        <header className="border-b border-zinc-900 pb-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            {/* <span>INDEX PATH // {project.id}</span> */}
            <span className="uppercase font-label text-maku-green">
              {project.type}
            </span>
          </div>
          <h1 className="font-label text-[clamp(2rem,5vw,3.5rem)] font-bold text-white uppercase tracking-tight leading-none">
            {project.title}
          </h1>
        </header>

        {/* DETAILS LAYOUT SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content (Left) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="relative aspect-video w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-900">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                className="object-cover mix-blend-luminosity opacity-60"
                sizes="(max-w-1100px) 100vw, 700px"
              />
            </div>

            <div className="space-y-4">
              <h2 className="font-label text-xs font-bold text-maku-green uppercase tracking-wider">
                // Project Overview
              </h2>
              <p className="font-body text-zinc-200 text-sm leading-relaxed font-light">
                {project.description}
              </p>
            </div>
          </div>

          {/* Metadata Specifications Sidebar (Right) */}
          <div className="lg:col-span-5 space-y-8 bg-zinc-950/20 border border-zinc-900 p-6 rounded-xl">
            {/* Technical Specifications Block */}
            <div className="space-y-4">
              <h3 className="font-label text-[0.65rem] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                Technical Data
              </h3>
              <div className="space-y-3">
                {project.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start text-xs font-body"
                  >
                    <span className="text-zinc-600">{spec.label}:</span>
                    <span className="text-zinc-300 text-right max-w-[200px]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Personnel Credits Block */}
            <div className="space-y-4">
              <h3 className="font-label text-[0.65rem] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                Credits Index
              </h3>
              <div className="space-y-3">
                {project.credits.map((credit, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start text-xs font-body"
                  >
                    <span className="text-zinc-600">{credit.role}:</span>
                    <span className="text-zinc-300">{credit.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
