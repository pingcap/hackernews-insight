import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export type AgentLogType = {
  id: number;
  content: string;
  role: 'system';
  log_level: 'debug' | 'info' | 'error';
  status: 'loading' | 'processing' | 'task_complete' | 'wait_user_feedback';
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

  const data = await axios
    .get(`${AUTOGPT_HOST}/api/agents/${id}/logs/?start_from=0`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data as AgentLogType[]);

  res.status(200).json(data);
}
