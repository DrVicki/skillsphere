import { ExternalLink, Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CubeMoveLab } from "@/lib/cubeMoveLabs";
import "./CubeMoveLabs.css";

type CubeMoveLabsProps = {
  labs: CubeMoveLab[];
};

const FACE_NAMES: Record<string, string> = {
  R: "right face",
  L: "left face",
  U: "upper face",
  D: "down face",
  F: "front face",
  B: "back face",
  M: "middle slice",
};

function describeMove(move: string) {
  const face = move[0]?.toUpperCase() ?? "";
  const target = FACE_NAMES[face] ?? "layer";
  if (move.includes("2")) return `Turn the ${target} one half turn`;
  if (face === "M") return move.includes("′") || move.includes("'") ? "Move the middle slice up" : "Move the middle slice down";
  return move.includes("′") || move.includes("'") ? `Turn the ${target} counter-clockwise` : `Turn the ${target} clockwise`;
}

function faceClass(move: string) {
  const face = move[0]?.toLowerCase() ?? "u";
  const reverse = move.includes("′") || move.includes("'") ? "reverse" : "";
  const half = move.includes("2") ? "half" : "";
  return `move-lab__cube--${face} ${reverse} ${half}`.trim();
}

function CubeFace({ className, colors }: { className: string; colors: string[] }) {
  return (
    <div className={`move-lab__cube-face ${className}`}>
      {colors.map((color, index) => <span key={`${className}-${index}`} style={{ backgroundColor: color }} />)}
    </div>
  );
}

function AnimatedCube({ move, stepKey }: { move: string; stepKey: number }) {
  return (
    <div className="move-lab__cube-scene" aria-hidden="true">
      <div className={`move-lab__cube ${faceClass(move)}`} key={`${move}-${stepKey}`}>
        <CubeFace className="move-lab__cube-face--top" colors={["#ffd51f", "#f8f3e7", "#ffd51f", "#f8f3e7", "#ffd51f", "#ffd51f", "#f8f3e7", "#ffd51f", "#ffd51f"]} />
        <CubeFace className="move-lab__cube-face--front" colors={["#e84134", "#18a66b", "#e84134", "#e84134", "#e84134", "#f8f3e7", "#f8f3e7", "#f07a1f", "#e84134"]} />
        <CubeFace className="move-lab__cube-face--right" colors={["#145ad8", "#f8f3e7", "#145ad8", "#145ad8", "#f8f3e7", "#f07a1f", "#145ad8", "#f07a1f", "#18a66b"]} />
      </div>
      <div className="move-lab__orbit"><span /></div>
    </div>
  );
}

function MoveLabCard({ lab }: { lab: CubeMoveLab }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeMove = lab.moves[activeStep] ?? lab.moves[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveStep((currentStep) => {
        if (currentStep >= lab.moves.length - 1) {
          setIsPlaying(false);
          return currentStep;
        }
        return currentStep + 1;
      });
    }, 950);
    return () => window.clearInterval(timer);
  }, [isPlaying, lab.moves.length]);

  const restart = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  const nextStep = () => {
    setIsPlaying(false);
    setActiveStep((currentStep) => (currentStep + 1) % lab.moves.length);
  };

  return (
    <article className="move-lab" aria-label={`${lab.label} Move Lab`}>
      <div className="move-lab__sequence">{lab.sequence}</div>
      <div className="move-lab__stage">
        <AnimatedCube move={activeMove} stepKey={activeStep} />
        <div className="move-lab__active-move" aria-live="polite">
          <strong>{activeMove}</strong>
          <span>{describeMove(activeMove)}</span>
        </div>
      </div>

      <div className="move-lab__steps" aria-label="Move sequence steps">
        {lab.moves.map((move, index) => (
          <button
            key={`${move}-${index}`}
            type="button"
            className={index === activeStep ? "is-active" : index < activeStep ? "is-past" : ""}
            onClick={() => { setIsPlaying(false); setActiveStep(index); }}
            aria-label={`Show step ${index + 1}: ${move}`}
          >
            <span>{index + 1}</span>
            {move}
          </button>
        ))}
      </div>

      <div className="move-lab__footer">
        <div>
          <strong>{lab.label}</strong>
          <span>Step {activeStep + 1} of {lab.moves.length}</span>
        </div>
        <div className="move-lab__controls">
          <button type="button" onClick={restart} aria-label="Restart animation" title="Restart animation"><RotateCcw size={15} /></button>
          <button type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? "Pause animation" : "Play animation"} title={isPlaying ? "Pause animation" : "Play animation"} className="move-lab__play">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button type="button" onClick={nextStep} aria-label="Next move" title="Next move"><StepForward size={16} /></button>
        </div>
      </div>
      <p className="move-lab__note">{lab.note}</p>
    </article>
  );
}

export default function CubeMoveLabs({ labs }: CubeMoveLabsProps) {
  const visibleLabs = useMemo(() => labs.filter((lab) => lab.moves.length > 0), [labs]);
  if (visibleLabs.length === 0) return null;

  return (
    <section className="move-labs" aria-labelledby="move-labs-heading">
      <div className="move-labs__heading">
        <div>
          <p>Move Labs</p>
          <h3 id="move-labs-heading">Practice each move, one step at a time.</h3>
        </div>
        <a href="https://philoli.com/projects/rubiks-cube/" target="_blank" rel="noreferrer">
          Practice in 3D <ExternalLink size={14} />
        </a>
      </div>
      <div className="move-labs__grid">
        {visibleLabs.map((lab) => <MoveLabCard key={`${lab.sequence}-${lab.label}`} lab={lab} />)}
      </div>
      <p className="move-labs__credit">Interactive move lab inspired by the original Philo Li cube learning tools.</p>
    </section>
  );
}
