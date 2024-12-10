import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Input(
  props: JSX.HTMLAttributes<HTMLInputElement>,
) {
  // Base classes + classes passed via props
  const baseClass =
    "px-4 py-2 border-gray-500 border-2 rounded transition-colors";
  const combinedClass = `${baseClass} ${props.class ?? ""}`;

  return (
    <input
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={combinedClass}
    />
  );
}
