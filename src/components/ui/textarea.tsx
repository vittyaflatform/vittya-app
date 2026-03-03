"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    const adjustHeight = React.useCallback(() => {
      const textarea = internalRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, []);

    React.useEffect(() => { adjustHeight(); }, [props.value, adjustHeight]);

    return (
      <textarea
        {...props}
        ref={internalRef}
        value={props.value ?? ""}
        onChange={(e) => {
          props.onChange?.(e);
          adjustHeight();
        }}
        className={cn(
          "flex min-h-30 w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl",
          "text-slate-900 placeholder:text-slate-300 font-medium transition-all",
          "focus:border-slate-900 focus:ring-0 outline-none resize-none overflow-hidden",
          className
        )}
      />
    );
  }
);
Textarea.displayName = "Textarea";
export { Textarea };