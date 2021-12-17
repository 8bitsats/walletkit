interface Props {
  value: number;
  max: number;
  barColor: string;
  className?: string;
}

export const Meter: React.FC<Props> = ({
  value,
  max,
  barColor,
  className,
}: Props) => {
  return (
    <div className={className} tw="flex-grow bg-warmGray-700 h-1 rounded">
      <div
        style={{
          width: `${Math.min(value / max, 1) * 100}%`,
          backgroundColor: barColor,
        }}
        tw="bg-primary h-1 rounded transition-all"
      />
    </div>
  );
};
