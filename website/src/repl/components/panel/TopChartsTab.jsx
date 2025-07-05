import { useSettings } from '@src/settings.mjs';
import { ch } from '@strudel/core';
import { useState } from 'react';

const { BASE_URL } = import.meta.env;

const ChartResult = ({ name, artist, link, index }) => {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{index + 1}.</span>
      <div className="flex flex-row">
        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{name} by {artist}</a>
      </div>
    </div>
  )
}

const sampleCharts = [
  {
    name: 'die for you',
    artist: 'weeknd',
    link: 'https://www.billboard.com/charts/hot-100/'
  },
  {
    name: 'save your tears',
    artist: 'weeknd',
    link: 'https://www.billboard.com/charts/hot-100/'
  }
]

export function TopChartsTab({ context }) {
  const { fontFamily } = useSettings();
  const [chartResults, setChartResults] = useState(sampleCharts);

  return (
    <div className="prose dark:prose-invert min-w-full pt-2 font-sans pb-8 px-4 h-full" style={{ fontFamily }}>
      <h3>top charts</h3>
      <div className="flex flex-col gap-2">
        {chartResults.map((chart, index) => (
          <ChartResult key={chart.name} {...chart} index={index} />
        ))}
      </div>
    </div>
  );
}
