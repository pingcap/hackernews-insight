import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useRecoilState } from 'recoil';

import { questionsState, questionLoadingState } from 'src/recoil/atoms';

const STATIC_QUESTIONS = [
  `How many new users are there in 2022?`,
  `how many times is ChatGPT mentioned MoM`,
  `Total number of registered users?`,
  `What is the trend of new users per month?`,
  `What is the number of active users per year asc?`,
  `Users who submitted the most stories on Hacker News?`,
  `Users who got the most voted on Hacker News?`,
  `How many people on Hacker News only post comments and no stories?`,
  `What are the most shared website domains?`,
  `how many times is Serverless mentioned on hackernews per month`,
  `How many github.com urls are shared per month?`,
  `Top TLD that is most used by the shared sites?`,
  `how many times is Web3 mentioned on hackernews per month`,
  `How frequently are SQL vs Hadoop mentioned on Hacker News each month? Compare them`,
  `Stories with most comments in 2022?`,
  `Stories with most score in 2022?`,
  `how many times is hn.algolia.com mentioned each month`,
];

// default is 3000 ms
const INTERVAL = 5000;

export default function HorizontalBar() {
  const [index, setIndex] = React.useState(0);

  const [questions, setQuestions] = useRecoilState(questionsState);
  const [loading, setLoading] = useRecoilState(questionLoadingState);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % STATIC_QUESTIONS.length);
    }, INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (q: string) => () => {
    !loading &&
      setQuestions((prev) => [
        ...prev,
        {
          q,
          id: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ]);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 30,
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.2rem',
        color: '#777',
      }}
    >
      {/* <Link href={`/?search=${encodeURIComponent(STATIC_QUESTIONS[index])}`}>
        <Typography
          sx={{
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >{`${STATIC_QUESTIONS[index]}`}</Typography>
      </Link> */}
      <Typography
        sx={{
          '&:hover': {
            textDecoration: 'underline',
            cursor: loading ? 'not-allowed' : 'pointer',
          },
        }}
        onClick={handleClick(STATIC_QUESTIONS[index])}
      >{`${STATIC_QUESTIONS[index]}`}</Typography>
    </Box>
  );
}
