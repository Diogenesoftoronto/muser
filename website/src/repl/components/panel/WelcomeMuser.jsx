import { useSettings } from '@src/settings.mjs';
import { ChatWindow } from '@src/repl/components/chat/ChatWindow.jsx';
// import { tavily } from '@tavily/core';


const { BASE_URL } = import.meta.env;
const baseNoTrailing = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export function WelcomeMuser({ context }) {
  const { fontFamily } = useSettings();

  const tavilyTest = async () => {
    try {
      const response = await fetch('https://api.tavily.com/crawl', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer <add your api key>',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: "docs.tavily.com", // TODO: change this to billboard
          max_depth: 1,
          max_breadth: 20,
          limit: 50,
          instructions: "Python SDK", // TODO: change instructions
          select_paths: null,
          select_domains: null,
          exclude_paths: null,
          exclude_domains: null,
          allow_external: false,
          include_images: false,
          categories: null,
          extract_depth: "basic",
          format: "markdown",
          include_favicon: false
        })
      });
      // TODO: return structured output with top songs

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Tavily crawl response:', data);
    } catch (error) {
      console.error('Error making Tavily request:', error);
    }
  }

  return (
    <div className="prose dark:prose-invert min-w-full pt-2 font-sans pb-8 px-4 h-full" style={{ fontFamily }}>
      <button onClick={tavilyTest}>tavility placeholder test button</button>
      <ChatWindow />
    </div>
  );
}
