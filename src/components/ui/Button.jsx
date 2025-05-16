import * as React from "react";

const Button = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none py-4 px-4 bg-[#E1F395] text-[#000000] hover:bg-[#A4CC00] ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
