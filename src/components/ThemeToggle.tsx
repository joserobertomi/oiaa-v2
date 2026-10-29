"use client";

export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("tema", dark ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10"
    >
      Alternar tema
    </button>
  );
}
