export type StatusType = "Active" | "Suspended" | "Banned";
export type CategoryType = "Artist" | "Collector" | "Art Gallery" | "Viewer";

const STATUS_CONFIG: Record<
  StatusType,
  { bg: string; border: string; text: string; dot: string }
> = {
  Active: {
    bg: "bg-[#053321]",
    border: "border-[#085D3A]",
    text: "text-[#75E0A7]",
    dot: "#17B26A",
  },
  Suspended: {
    bg: "bg-[#4E1D09]",
    border: "border-[#93370D]",
    text: "text-[#FEC84B]",
    dot: "#F79009",
  },
  Banned: {
    bg: "bg-[#55160C]",
    border: "border-[#912018]",
    text: "text-[#FDA29B]",
    dot: "#F04438",
  },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const { bg, border, text, dot } = STATUS_CONFIG[status];
  return (
    <div
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border ${bg} ${border}`}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <circle cx="4" cy="4" r="3" fill={dot} />
      </svg>
      <span className={`text-xs font-medium leading-[18px] ${text}`}>
        {status}
      </span>
    </div>
  );
}

export function CategoryBadge({ category }: { category: CategoryType }) {
  return (
    <div className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-[#333741]">
      <span className="text-xs font-medium leading-[18px] text-[#CECFD2]">
        {category}
      </span>
    </div>
  );
}
