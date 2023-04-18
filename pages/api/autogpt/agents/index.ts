import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

import logger from 'next-pino/logger';

export type AgentResType = {
  id: number;
  ai_name: string;
  ai_role: string;
  ai_goals: string[];
};

export type AgentErrorType = {
  error: {
    question: string[];
  };
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

  try {
    const data = await axios
      .post(
        `${AUTOGPT_HOST}/api/agents/`,
        {
          question,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => response.data as AgentResType);
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(error);

    if (!error.response) return res.status(500).json({ error: 'Server Error' });

    const { data, code } = error.response;
    if (code === 400) {
      const { error } = data as AgentErrorType;
      res.status(400).json({
        error: error.question.join(''),
      });
    }
  }
}
