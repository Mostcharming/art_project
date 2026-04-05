declare global {
  namespace React {
    interface Attributes {
      className?: string;
    }
  }
}

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
  }
}

export {};
