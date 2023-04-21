import * as React from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import Layout from 'src/components/Layout';
// import AnswerCardsGroup from 'src/components/Card/AnswerCardsGroup';
import AutoGPTMessageGroup from 'src/components/Card/AutoGPTMessageGroup';
import { questionsState, questionLoadingState } from 'src/recoil/atoms';
import logger from 'next-pino/logger';

import { BotService } from 'src/services/bot';
import MySQLService, { initConnection } from 'src/services/mysql';
import Data2ChartTemplate from 'src/services/bot/templates/Data2ChartTemplate';
import Question2SQLTemplate from 'src/services/bot/templates/Question2SQLTemplate';
import { ChartAnswerProps } from 'src/components/Card/AnswerCard';
import HorizontalBar from '@src/components/HorizontalBar';

export interface QuestionItem {
  id: string;
  question: string;
  answer: string;
}

export interface HomeProps {
  question: string;
  rows: any[];
  sqlAnswer: string;
  chartAnswer: ChartAnswerProps;
}

export default function Home(props: HomeProps) {
  const { rows, sqlAnswer, chartAnswer, question } = props;

  // const router = useRouter();
  // const { search } = router.query;
  // // const question = decodeURIComponent(q as string);
  // const questionMemo = React.useMemo(() => {
  //   if (search) return decodeURIComponent(search as string);
  //   return null;
  // }, [search]);

  const [questions, setQuestions] = useRecoilState(questionsState);
  const [loading, setLoading] = useRecoilState(questionLoadingState);

  // const handleSearch = (q: string) => {
  //   setLoading(true);
  //   setQuestions((prev) => [...prev, q]);
  // };

  // React.useEffect(() => {
  //   const lastQuestion =
  //     questions.length > 0 ? questions[questions.length - 1] : '';
  //   if (questionMemo && questionMemo !== lastQuestion) {
  //     handleSearch(questionMemo);
  //   }
  // }, [questionMemo, questions]);

  return (
    <>
      <Layout recapcha disableSearch={loading} hideSearch>
        {/* {questions.length < 5 && <HorizontalBar />} */}
        {/* <AnswerCardsGroup
          initialData={{ rows, sqlAnswer, chartAnswer, question }}
        /> */}
        <AutoGPTMessageGroup />
      </Layout>
    </>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  return {
    props: {
      question: '',
      rows: [],
      sqlAnswer: '',
      chartAnswer: {},
    },
  };
  // if (process.env.NODE_ENV === 'development') {
  //   return {
  //     props: {
  //       question: '',
  //       rows: [],
  //       sqlAnswer: '',
  //       chartAnswer: {},
  //     },
  //   };
  // }
  // const MOCK_QUESTION = 'How many new stories and comments per month?';
  // // Call an external API endpoint to get posts.
  // // You can use any data fetching library
  // // const res = await fetch('https://.../posts');
  // // const posts = await res.json();
  // const botService = new BotService(logger, process.env.OPENAI_API_KEY || '');
  // const questionTemplate = new Question2SQLTemplate();
  // const dataTemplate = new Data2ChartTemplate();

  // const { answer: sqlAnswer } = await botService.getAnswer(
  //   MOCK_QUESTION,
  //   questionTemplate
  // );
  // if (!sqlAnswer) {
  //   throw new Error('[HOME] No answer');
  // }
  // const mysqlService = new MySQLService(await initConnection());
  // const { rows, error } = await mysqlService.execute(sqlAnswer);
  // mysqlService.cleanUp();
  // if (error) {
  //   throw new Error(error);
  // }
  // const { answer: chartAnswer } = await botService.data2Chart(
  //   MOCK_QUESTION,
  //   rows,
  //   dataTemplate
  // );
  // // By returning { props: { posts } }, the Blog component
  // // will receive `posts` as a prop at build time
  // return {
  //   props: {
  //     question: MOCK_QUESTION,
  //     rows,
  //     sqlAnswer,
  //     chartAnswer: JSON.parse(chartAnswer || ''),
  //   },
  // };
}
