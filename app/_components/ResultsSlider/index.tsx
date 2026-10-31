import CardSlider from '../CardSlider';
import ResultCard from '@/components/ResultCard';
import type { ResultItem } from '@/types/results';

interface ResultsSliderProps {
  results: ResultItem[];
}

export default function ResultsSlider({ results }: ResultsSliderProps) {
  if (results.length === 0) return null;

  return (
    <CardSlider kind="results" label="制作実績と個人開発" previous="前の実績を表示" next="次の実績を表示">
        {results.slice(0, 6).map((result, index) => (
          <li key={`${result.id}-${index}`} className="splide__slide">
            <ResultCard result={result} showTechnologies={false} />
          </li>
        ))}
    </CardSlider>
  );
}
