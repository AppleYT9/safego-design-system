interface Props {
  score: number;
  label?: string;
  color?: string;
}

export const SafetyScoreBar = ({ score, label = "Safety Score", color = "hsl(var(--teal))" }: Props) => (
  <div>
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold" style={{ color }}>{score}% Safe</span>
    </div>
    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  </div>
);
