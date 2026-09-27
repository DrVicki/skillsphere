import { RotateCcw, Rotate3D, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";

type CenterKey = "yellow" | "green" | "red" | "orange" | "white" | "blue";

type Center = {
  key: CenterKey;
  label: string;
  position: string;
  color: string;
  textColor?: string;
  detail: string;
};

const centers: Center[] = [
  {
    key: "yellow",
    label: "Yellow",
    position: "Up",
    color: "#f5c542",
    textColor: "#422f00",
    detail: "The yellow center defines the up face for this course's viewpoint.",
  },
  {
    key: "green",
    label: "Green",
    position: "Front",
    color: "#2f9e73",
    detail: "The green center anchors the front face. Keep it in front while you work.",
  },
  {
    key: "red",
    label: "Red",
    position: "Left",
    color: "#d94645",
    detail: "The red center identifies the left side of the fixed color frame.",
  },
  {
    key: "orange",
    label: "Orange",
    position: "Right",
    color: "#ee8a31",
    textColor: "#442102",
    detail: "The orange center identifies the right side of the fixed color frame.",
  },
  {
    key: "white",
    label: "White",
    position: "Down",
    color: "#f3f6f7",
    textColor: "#1f2937",
    detail: "The white center defines the down face, opposite yellow.",
  },
  {
    key: "blue",
    label: "Blue",
    position: "Back",
    color: "#3676bf",
    detail: "The blue center defines the back face, opposite green.",
  },
];

const visibleFaces = [
  { label: "Up", center: "yellow" as CenterKey, color: "#f5c542" },
  { label: "Front", center: "green" as CenterKey, color: "#2f9e73" },
  { label: "Right", center: "orange" as CenterKey, color: "#ee8a31" },
];

function FaceGrid({
  label,
  center,
  color,
  isSelected,
  onSelect,
}: {
  label: string;
  center: CenterKey;
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative w-[4.25rem] shrink-0 rounded-xl p-1 text-left transition duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF] focus-visible:ring-offset-2"
      style={{
        background: color,
        boxShadow: isSelected ? `0 0 0 3px ${color}, 0 12px 22px rgba(15, 23, 42, 0.2)` : "0 8px 18px rgba(15, 23, 42, 0.16)",
      }}
      aria-pressed={isSelected}
      aria-label={`Inspect the ${label.toLowerCase()} center`}
    >
      <span className="absolute -top-5 left-0 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <span className="grid grid-cols-3 gap-1 rounded-lg bg-[#16243b] p-1">
        {Array.from({ length: 9 }, (_, index) => {
          const isCenter = index === 4;
          return (
            <span
              key={index}
              className="h-4 w-4 rounded-[3px]"
              style={{
                background: color,
                boxShadow: isCenter ? "inset 0 0 0 2px rgba(255,255,255,.9), 0 0 0 2px rgba(15,23,42,.8)" : "inset 0 -2px 0 rgba(15,23,42,.16)",
                filter: isCenter && isSelected ? "brightness(1.08)" : undefined,
              }}
            />
          );
        })}
      </span>
    </button>
  );
}

export default function CubeInteractiveLab() {
  const [selectedCenter, setSelectedCenter] = useState<CenterKey>("green");
  const [moves, setMoves] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const selected = useMemo(
    () => centers.find((center) => center.key === selectedCenter) ?? centers[1],
    [selectedCenter],
  );

  const makeMove = (move: "R" | "U" | "M") => {
    setMoves((current) => [...current, move]);
    setRotation((current) => current + (move === "M" ? -7 : 7));
  };

  const undoMove = () => {
    setMoves((current) => current.slice(0, -1));
    setRotation((current) => current - 7);
  };

  const resetLab = () => {
    setMoves([]);
    setRotation(0);
    setSelectedCenter("green");
  };

  const latestMove = moves.at(-1);

  return (
    <section
      className="my-7 overflow-hidden rounded-2xl border border-[#2A63BF]/20 bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_55%,#fff9e9_100%)] shadow-[0_12px_32px_rgba(42,99,191,.10)]"
      aria-labelledby="cube-lab-title"
    >
      <div className="border-b border-[#2A63BF]/15 bg-white/80 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#2A63BF] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-white">
            <Rotate3D className="h-3.5 w-3.5" /> Interactive lab
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Hands-on orientation practice</span>
        </div>
        <h3 id="cube-lab-title" className="mt-3 text-xl font-extrabold tracking-tight text-[#163866]">
          Touch the cube. Explain what changed.
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
          Try a layer turn, then inspect a center. The move changes pieces around the center; the six centers keep the color frame that tells you where every piece belongs.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(250px,.85fr)]">
        <div className="rounded-xl border border-white bg-white/85 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2A63BF]">1 · Try a turn</p>
              <p className="mt-1 text-sm text-slate-600">Use a move, then decide what the center pieces tell you.</p>
            </div>
            <div className="flex gap-2" aria-label="Cube move controls">
              {(["R", "U", "M"] as const).map((move) => (
                <button
                  key={move}
                  type="button"
                  onClick={() => makeMove(move)}
                  className="min-w-10 rounded-lg border border-[#2A63BF]/20 bg-[#F2F7FF] px-3 py-2 text-sm font-extrabold text-[#1D529F] transition duration-150 hover:-translate-y-0.5 hover:bg-[#dbeaff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF] focus-visible:ring-offset-2 active:scale-[.97]"
                  aria-label={`Make an ${move} turn`}
                >
                  {move}
                </button>
              ))}
              <button
                type="button"
                onClick={undoMove}
                disabled={moves.length === 0}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[.97]"
                aria-label="Undo last move"
                title="Undo last move"
              >
                <Undo2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex min-h-56 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-[radial-gradient(circle_at_50%_18%,#f7fbff_0%,#edf4ff_42%,#e3ebf6_100%)] px-5 py-8">
            <div
              className="flex items-end gap-1.5"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 220ms cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              aria-label="A cube showing yellow up, green front, and orange right"
            >
              {visibleFaces.map((face) => (
                <FaceGrid
                  key={face.center}
                  {...face}
                  isSelected={selectedCenter === face.center}
                  onSelect={() => setSelectedCenter(face.center)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 px-3.5 py-3">
            <p className="text-sm text-slate-600" aria-live="polite">
              {latestMove ? (
                <><strong className="text-slate-800">{latestMove} turn complete.</strong> The layer moved; its center still defines the same face in your fixed viewpoint.</>
              ) : (
                <>No turn yet. Start with <strong className="text-slate-800">R</strong>, <strong className="text-slate-800">U</strong>, or <strong className="text-slate-800">M</strong>.</>
              )}
            </p>
            <button
              type="button"
              onClick={resetLab}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#1D529F] underline decoration-[#1D529F]/30 underline-offset-4 transition hover:text-[#163866] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF] focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        <aside className="rounded-xl border border-[#f5c542]/35 bg-[#fffdf6] p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6700]">2 · Inspect the fixed frame</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">Select a center to name its role before you make another move.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {centers.map((center) => {
              const isSelected = center.key === selectedCenter;
              return (
                <button
                  key={center.key}
                  type="button"
                  onClick={() => setSelectedCenter(center.key)}
                  aria-pressed={isSelected}
                  className="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-bold transition duration-150 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF] focus-visible:ring-offset-2 active:scale-[.98]"
                  style={{
                    background: isSelected ? "#ffffff" : "rgba(255,255,255,.72)",
                    borderColor: isSelected ? center.color : "rgba(148,163,184,.28)",
                    boxShadow: isSelected ? `0 0 0 1px ${center.color}` : undefined,
                    color: "#334155",
                  }}
                >
                  <span className="h-4 w-4 shrink-0 rounded-[4px] border border-slate-900/15" style={{ background: center.color }} />
                  <span>{center.label} <span className="font-medium text-slate-500">· {center.position}</span></span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 rounded-xl border border-[#2A63BF]/15 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-[4px] border border-slate-900/15" style={{ background: selected.color }} />
              <p className="font-bold text-[#163866]">{selected.label} center · {selected.position}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{selected.detail}</p>
          </div>
          <div className="mt-4 rounded-xl bg-[#1e3a6e] px-4 py-3 text-sm leading-6 text-white">
            <strong>Say it aloud:</strong> “I can find a piece’s home by matching its colors to the fixed centers.”
          </div>
        </aside>
      </div>
    </section>
  );
}
