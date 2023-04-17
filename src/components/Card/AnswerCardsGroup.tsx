import * as React from 'react';
import Box from '@mui/material/Box';
import { useRecoilValue } from 'recoil';

import { questionsState } from 'src/recoil/atoms';
import AnswerCard, { CommonAnswerCard } from 'src/components/Card/AnswerCard';

import { HomeProps } from 'pages/index';

export default function AnswerCardsGroup(props: { initialData: HomeProps }) {
  const {
    initialData: { rows, sqlAnswer, chartAnswer, question },
  } = props;

  // const questions = useRecoilValue(questionsState);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '2rem',
      }}
    >
      {question && (
        <CommonAnswerCard
          question={question}
          sqlAnswer={sqlAnswer}
          chartAnswer={chartAnswer}
          rows={rows}
          answerError={null}
          chartError={null}
        />
      )}
      {/* {questions.map((q, idx) => (
        <AnswerCard key={`${idx}-${q}`} question={q} />
      ))} */}
    </Box>
  );
}
