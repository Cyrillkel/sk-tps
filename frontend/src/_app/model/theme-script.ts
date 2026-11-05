import { themeStorageKey } from "@/shared/config";

export const themeScript = `(function(){var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;try{var saved=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(saved==='light'||saved==='dark')dark=saved==='dark';}catch{}document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';})();`;
