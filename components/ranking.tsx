import { Score } from "../lib/score"

type Data = {
  scores: Score[]
  stageId: number
}

const RankingList = ({ data }: { data: Data }) => {
  return (
    <div>
      <ol className="flex flex-col items-center py-2 max-w-xl text-center">
        {data.scores.map((score, index) => (
          <li key={index} className="py-1">
            {index <= 2 ? (
              <p className="font-bold border-b border-y-blue-300 sm:text-xl md:mb-2 md:text-2xl">
                {index + 1}th {score.user_name} : {score.clear_time} sec
              </p>
            ) : (
              <p className="border-b border-y-blue-300 sm:text-xl md:mb-2 md:text-xl">
                {index + 1}th {score.user_name} : {score.clear_time} sec
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default RankingList
