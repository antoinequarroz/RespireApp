import { Pressable, type PressableProps,Text } from 'react-native';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'sos' | 'ghost';
}

export function Button({ label, variant = 'primary', ...props }: ButtonProps) {
  const classes = {
    primary: 'bg-primary',
    secondary: 'bg-surface dark:bg-zinc-800',
    sos: 'bg-sos',
    ghost: 'bg-transparent',
  }[variant];

  const textClasses = {
    primary: 'text-white',
    secondary: 'text-ink dark:text-white',
    sos: 'text-white',
    ghost: 'text-primary',
  }[variant];

  return (
    <Pressable
      className={`min-h-12 items-center justify-center rounded-md px-4 ${classes}`}
      {...props}
    >
      <Text className={`text-base font-semibold ${textClasses}`}>{label}</Text>
    </Pressable>
  );
}
