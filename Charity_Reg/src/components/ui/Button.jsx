import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-brand-600 text-white hover:bg-brand-700 shadow-soft',
        secondary: 'bg-brand-100 text-brand-800 hover:bg-brand-200 dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800',
        outline: 'border-2 border-brand-500 text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/30',
        ghost: 'hover:bg-brand-100 dark:hover:bg-brand-800/50',
        link: 'text-brand-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        default: 'h-10 px-5 text-base',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof import('class-variance-authority').VariantProps<typeof buttonVariants>['variant']; size?: keyof import('class-variance-authority').VariantProps<typeof buttonVariants>['size']; asChild?: boolean } } props
 */
export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...(asChild ? {} : props)}
    />
  );
}
