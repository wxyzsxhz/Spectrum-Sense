import React from "react";

interface DataPoint {
  name: string;
  value: number;
  fill: string;
}

interface PolarAreaChartProps {
  data: DataPoint[];
  maxValue: number;
  size?: number;
  backgroundColor?: string;
}

const PolarAreaChart: React.FC<PolarAreaChartProps> = ({
  data,
  maxValue,
  size = 320,
  backgroundColor = "#f8fafc",
}) => {
  const center = size / 2;
  const maxRadius = (size / 2) * 0.85;
  const sliceAngle = (2 * Math.PI) / data.length;
  const startAngle = -Math.PI / 2;

  const polarToCartesian = (angle: number, radius: number) => ({
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  });

  const createSlicePath = (index: number, value: number) => {
  const normalizedValue = Math.min(value / maxValue, 1);
  const outerRadius = maxRadius * normalizedValue;

  const angleStart = startAngle + index * sliceAngle;
  const angleEnd = angleStart + sliceAngle;

  const outerStart = polarToCartesian(angleStart, outerRadius);
  const outerEnd = polarToCartesian(angleEnd, outerRadius);

  const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

  return `
    M ${center} ${center}
    L ${outerStart.x} ${outerStart.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
    Z
  `;
};

  const createBackgroundSlicePath = (index: number) => {
  const angleStart = startAngle + index * sliceAngle;
  const angleEnd = angleStart + sliceAngle;

  const outerStart = polarToCartesian(angleStart, maxRadius);
  const outerEnd = polarToCartesian(angleEnd, maxRadius);

  const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

  return `
    M ${center} ${center}
    L ${outerStart.x} ${outerStart.y}
    A ${maxRadius} ${maxRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
    Z
  `;
};


  // Grid circles
  const gridCircles = [0.25, 0.5, 0.75, 1].map((fraction) => (
    <circle
      key={fraction}
      cx={center}
      cy={center}
      r={maxRadius * fraction}
      fill="none"
      stroke="#e5e7eb"
      strokeDasharray="3,3"
    />
  ));

  // Divider lines
  const dividerLines = data.map((_, index) => {
  const angle = startAngle + index * sliceAngle;
  const outerPoint = polarToCartesian(angle, maxRadius);

  return (
    <line
      key={index}
      x1={center}
      y1={center}
      x2={outerPoint.x}
      y2={outerPoint.y}
      stroke="#f1fafe"
      strokeWidth={1}
    />
  );
});

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background */}
      <circle
        cx={center}
        cy={center}
        r={maxRadius}
        fill={backgroundColor}
      />

      {/* Grid */}
      {gridCircles}
      {dividerLines}

      {/* Background slices */}
      {data.map((_, index) => (
        <path
          key={`bg-${index}`}
          d={createBackgroundSlicePath(index)}
          fill="#eef2ff"
          stroke="#e2e9fe"
        />
      ))}

      {/* Data slices */}
      {data.map((item, index) => (
        <path
          key={`slice-${index}`}
          d={createSlicePath(index, item.value)}
          fill={item.fill}
          stroke="white"
          strokeWidth={2}
          opacity={0.95}
        />
      ))}

      <circle cx={center} cy={center} r={4} fill="#f1fafe" />

    </svg>
  );
};

export default PolarAreaChart;
