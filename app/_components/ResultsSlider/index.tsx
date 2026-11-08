import CardSlider from '../CardSlider';
import ResultCard from '@/components/ResultCard';
import type { ResultItem } from '@/types/results';

interface ResultsSliderProps {
  results: ResultItem[];
  label?: string;
  showTechnologies?: boolean;
}

export default function ResultsSlider({ results, label = "制作実績と個人開発", showTechnologies = false }: ResultsSliderProps) {
  if (results.length === 0) return null;

  return (
    <CardSlider kind="results" label={label} previous="前の実績を表示" next="次の実績を表示">
        {results.slice(0, 6).map((result, index) => (
          <li key={`${result.id}-${index}`} className="splide__slide">
            <ResultCard result={result} showTechnologies={showTechnologies} />
          </li>
        ))}
    </CardSlider>
  );
}
