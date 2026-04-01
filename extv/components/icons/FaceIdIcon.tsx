import Svg, { Path } from "react-native-svg";

interface FaceIdIconProps {
  size?: number;
  color?: string;
}

export function FaceIdIcon({ size = 28, color = "#FFFFFF" }: FaceIdIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top-left corner */}
      <Path
        d="M2 8V5C2 3.34 3.34 2 5 2H8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top-right corner */}
      <Path
        d="M16 2H19C20.66 2 22 3.34 22 5V8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom-right corner */}
      <Path
        d="M22 16V19C22 20.66 20.66 22 19 22H16"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom-left corner */}
      <Path
        d="M8 22H5C3.34 22 2 20.66 2 19V16"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left eye */}
      <Path
        d="M8 8.5V10"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {/* Right eye */}
      <Path
        d="M16 8.5V10"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {/* Nose */}
      <Path
        d="M12 8.5V12.5H13"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mouth */}
      <Path
        d="M8.5 15.5C9.2 16.4 10.5 17 12 17C13.5 17 14.8 16.4 15.5 15.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
