import { useState } from "react";

interface Project {
  id: string;
  title: string;
  imageUrl?: string | null;
  views?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  userType?: "Publisher" | "Viewer";
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-9 h-9 p-2 items-center justify-center rounded-full bg-[rgba(12,17,29,0.90)] backdrop-blur-sm hover:bg-[rgba(12,17,29,0.80)] transition-colors"
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      {direction === "left" ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="#CECFD2"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="#CECFD2"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex-shrink-0 w-56 sm:w-64 rounded-xl overflow-hidden bg-ds-surface border border-ds-border">
      {/* Image placeholder */}
      <div className="w-full h-60 bg-[#1D2434] flex items-center justify-center">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#232B3D]" />
        )}
      </div>
      {/* Card content */}
      <div className="p-3 flex flex-col gap-1">
        <h3
          className="text-white font-semibold text-sm leading-5 truncate"
          style={{ fontFamily: "BankGothicBold" }}
        >
          {project.title}
        </h3>
      </div>
    </div>
  );
}

export default function ProjectsSection({
  projects,
  userType = "Publisher",
}: ProjectsSectionProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCount = 4;

  // Don't show projects section for viewers
  if (userType === "Viewer") {
    return null;
  }

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) =>
      Math.min(projects.length - visibleCount, prev + 1)
    );
  };

  return (
    <div className="px-8 flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg leading-7">Projects</h2>
        <div className="flex items-center gap-4">
          <CarouselArrow direction="left" onClick={handlePrev} />
          <CarouselArrow direction="right" onClick={handleNext} />
        </div>
      </div>

      {/* Projects carousel */}
      <div className="relative overflow-hidden">
        {projects.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-white text-sm">
            No projects yet
          </div>
        ) : (
          <div
            className="flex gap-8 transition-transform duration-300"
            style={{
              transform: `translateX(-${scrollIndex * (256 + 32)}px)`,
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
