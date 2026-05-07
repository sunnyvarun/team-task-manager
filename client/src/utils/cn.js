// Simple class name utility that replaces clsx
export const cn = (...classes) => {
          return classes.filter(Boolean).join(' ');
        };