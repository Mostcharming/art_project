import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface TouchableHighlightProps {
    className?: string;
  }
  interface FlatListProps<ItemT> {
    className?: string;
    contentContainerStyle?: any;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerStyle?: any;
  }
  interface ImageProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
}
