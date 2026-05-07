/* eslint-disable react-refresh/only-export-components */

import type { JSX } from "react";

// Map of countries to their flag components
const countryFlagMap: Record<string, () => JSX.Element> = {
  Nigeria: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#ng-clip)">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="#F0F0F0"
        />
        <path
          d="M-0.000366211 10.0002C-0.000366211 14.2999 2.71338 17.9653 6.52139 19.3782V0.622223C2.71338 2.03511 -0.000366211 5.70058 -0.000366211 10.0002Z"
          fill="#6DA544"
        />
        <path
          d="M19.9999 10.0002C19.9999 5.70058 17.2862 2.03511 13.4781 0.622223V19.3783C17.2862 17.9653 19.9999 14.2999 19.9999 10.0002Z"
          fill="#6DA544"
        />
      </g>
      <defs>
        <clipPath id="ng-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  "United States": () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#us-clip)">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="#3C3B6B"
        />
        <path d="M0 10C0 15.5228 4.47715 20 10 20V10H0Z" fill="#B22234" />
        <path d="M10 10V0C4.47715 0 0 4.47715 0 10H10Z" fill="#B22234" />
      </g>
      <defs>
        <clipPath id="us-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  "United Kingdom": () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#uk-clip)">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="#012169"
        />
        <path d="M0 10H20M10 0V20" stroke="white" strokeWidth="1" />
        <path d="M0 0L20 20M20 0L0 20" stroke="#C8102E" strokeWidth="0.67" />
      </g>
      <defs>
        <clipPath id="uk-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  Canada: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#ca-clip)">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="#FF0000"
        />
        <path d="M6.67 0V20M13.33 0V20" fill="white" />
        <rect x="6.67" y="0" width="6.66" height="20" fill="white" />
      </g>
      <defs>
        <clipPath id="ca-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  Germany: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#de-clip)">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="#FFCE00"
        />
        <path
          d="M0 10C0 12.21 1.08 14.15 2.73 15.27H17.27C18.92 14.15 20 12.21 20 10H0Z"
          fill="#D00"
        />
        <path
          d="M0 5.73C1.08 4.84 2.73 4.21 4.62 4.21H15.38C17.27 4.21 18.92 4.85 20 5.73V10H0V5.73Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="de-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
};

export function getCountryFlag(country: string): JSX.Element | null {
  const FlagComponent = countryFlagMap[country];
  return FlagComponent ? <FlagComponent /> : null;
}

export function CountryFlag({ country }: { country: string }) {
  return getCountryFlag(country);
}
