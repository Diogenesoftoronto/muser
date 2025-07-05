import { useSettings } from '@src/settings.mjs';
import { ChatWindow } from '@src/repl/components/chat/ChatWindow.jsx';

const { BASE_URL } = import.meta.env;
const baseNoTrailing = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export function WelcomeMuser({ context }) {
  const { fontFamily } = useSettings();

  return (
    <div className="prose dark:prose-invert min-w-full pt-2 font-sans pb-8 px-4 h-full" style={{ fontFamily }}>
      <ChatWindow />
    </div>
  );
}
