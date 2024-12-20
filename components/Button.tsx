import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const baseClass =
    "px-2 py-1 border-gray-500 border-2 rounded transition-colors";
  const combinedClass = `${baseClass} ${props.class ?? ""}`;
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={combinedClass}
    />
  );
}
