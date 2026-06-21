import { View, type ViewProps } from 'react-native';

export function Card({ className = '', ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={`rounded-md bg-surface p-4 dark:bg-zinc-900 ${className}`}
      {...props}
    />
  );
}
