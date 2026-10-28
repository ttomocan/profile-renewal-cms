import CardSlider from '../CardSlider';
import ResultCard from '@/components/ResultCard';
import type { ResultItem } from '@/types/results';
import type { Blog } from '@/app/_libs/microcms';
import PersonalProjectCard from '@/components/PersonalProjectCard';

interface ResultsSliderProps {
  results: ResultItem[];
  personalArticle?: Blog;
}

export default function ResultsSlider({ results, personalArticle }: ResultsSliderProps) {
  if (results.length === 0 && !personalArticle) return null;

  return (
    <CardSlider kind="results" label="制作実績と個人開発" previous="前の実績を表示" next="次の実績を表示">
        {results.slice(0, personalArticle ? 5 : 6).map((result, index) => (
          <li key={`${result.id}-${index}`} className="splide__slide">
            <ResultCard result={result} showTechnologies={false} />
          </li>
        ))}
        {personalArticle && <li className="splide__slide"><PersonalProjectCard article={personalArticle} /></li>}
    </CardSlider>
  );
}
