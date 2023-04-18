import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export type AgentFeedbackErrorType = {
  error: {
    continuous_num: string[];
    content: string[];
  };
};

const AUTOGPT_HOST = process.env.AUTOGPT_HOST || `http://localhost:8000`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AgentFeedbackErrorType | { error: string }>
) {
  const { content = '' } = req.body;
  const { id } = req.query;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const data = await axios.post(
      `${AUTOGPT_HOST}/api/agents/${id}/feedback/`,
      {
        continuous_num: 1,
        content, // max length 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).end();
  } catch (error: any) {
    const { data, code } = error.response;
    res.status(code || 400).json(data as AgentFeedbackErrorType);
  }
}
