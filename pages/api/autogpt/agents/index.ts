import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export type AgentResType = {
  id: number;
  ai_name: string;
  ai_role: string;
  ai_goals: string[];
};

const AUTOGPT_HOST = process.env.AUTOGPT_HOST || `http://localhost:8000`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AgentResType | { error: string }>
) {
  const { question } = req.body;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!question) {
    res.status(400).json({ error: 'Bad Request' });
    return;
  }

  res.status(200).json({
    id: 30,
    ai_name: 'HackerNews-DBA-GPT',
    ai_role: 'an AI designed to answer questions about HackerNews',
    ai_goals: [
      'Answer: Total number of registered users?',
      'Shutdown upon achieving your goal',
    ],
  });

  // const data = await axios
  //   .post(`${AUTOGPT_HOST}/api/agents`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: {
  //       question,
  //     },
  //   })
  //   .then((response) => response.data as AgentResType);

  // res.status(200).json(data);
}
