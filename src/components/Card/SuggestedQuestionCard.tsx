import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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

export default function SuggestedQuestionCard(props: {
  onChipClick: (q: string) => () => void;
}) {
  const { onChipClick } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {/* <Chip label="Clickable" onClick={handleClick} />
      <Chip label="Clickable" variant="outlined" onClick={handleClick} /> */}
      <Box display="flex" alignItems="center">
        <Typography fontWeight="bold">Try asking me about:</Typography>
      </Box>
      {STATIC_QUESTIONS.map((q) => (
        <Chip
          key={`chip-${q}`}
          label={q}
          variant="outlined"
          onClick={onChipClick(q)}
        />
      ))}
    </Box>
  );
}
