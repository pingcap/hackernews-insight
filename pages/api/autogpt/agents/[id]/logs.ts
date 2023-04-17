import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export type AgentLogType = {
  id: number;
  content: string;
  role: 'system';
  log_level: 'debug' | 'info' | 'error';
  status: 'loading' | 'processing' | 'task_complete';
  created_at: string;
};

const AUTOGPT_HOST = process.env.AUTOGPT_HOST || `http://localhost:8000`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AgentLogType[] | { error: string }>
) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  res.status(200).json([
    {
      id: 232,
      content: 'Thoughts: 。。。。。',
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-17T08:42:40.570Z',
    },
    {
      id: 251,
      content: 'Task complete',
      role: 'system',
      log_level: 'info',
      status: 'task_complete',
      created_at: '2023-04-17T08:44:06.905Z',
    },
  ]);

  // const data = await axios
  //   .get(`${AUTOGPT_HOST}/api/agents/${id}/logs/?start_from=0`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   .then((response) => response.data as AgentLogType[]);

  // res.status(200).json(data);
}
