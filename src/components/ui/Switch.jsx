import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={`relative h-6 w-11 rounded-full bg-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-500 ${className}`}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb 
      className="block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5"
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = "Switch";

export { Switch };