import { useSettings } from '@src/settings.mjs';

const { BASE_URL } = import.meta.env;
const baseNoTrailing = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export function WelcomeMuser({ context }) {
  const { fontFamily } = useSettings();
  return (
    <div className="prose dark:prose-invert min-w-full pt-2 font-sans pb-8 px-4 " style={{ fontFamily }}>
      <h3>welcome to muser</h3>
      <p>
        You have found <span className="underline">muser</span>, a new vibe coding music platform to generate music.
        Chat to get started.
      </p>
    </div>
  );
}
