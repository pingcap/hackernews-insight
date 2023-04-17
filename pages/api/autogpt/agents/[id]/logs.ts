import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export type AgentLogType = {
  id: number;
  content: string;
  role: 'system';
  log_level: 'loading' | 'info' | 'error';
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
      id: 138,
      content: 'Thinking...',
      role: 'system',
      log_level: 'loading',
      created_at: '2023-04-17T05:33:09.327Z',
    },
    {
      id: 139,
      content:
        '**Thoughts:** ```I need to list the tables in the database to start.```\n**Reasoning:** ```Following the standard operating procedure, the first step is to list the available tables in the database.```\n**Plan:** ```\n- List tables in the database\n- Inspect table schema\n- Write an SQL query to get the desired information\n- Shutdown\n```\n**Criticism:** ```No self-criticism at this moment, as I am following the standard operating procedure.```\n',
      role: 'system',
      log_level: 'info',
      created_at: '2023-04-17T05:33:30.558Z',
    },
    {
      id: 140,
      content:
        "NEXT ACTION: COMMAND = `tidb_query_executor`, ARARGUMENTSGS = `{'query': 'SHOW TABLES'}`",
      role: 'system',
      log_level: 'info',
      created_at: '2023-04-17T05:33:30.574Z',
    },
    {
      id: 141,
      content: 'Executing command...',
      role: 'system',
      log_level: 'loading',
      created_at: '2023-04-17T05:33:30.578Z',
    },
    {
      id: 142,
      content:
        "Command tidb_query_executor returned: Command tidb_query_executor returned: [{'Tables_in_hackernews': 'items'}, {'Tables_in_hackernews': 'users'}]",
      role: 'system',
      log_level: 'info',
      created_at: '2023-04-17T05:33:33.266Z',
    },
    {
      id: 143,
      content: 'Thinking...',
      role: 'system',
      log_level: 'loading',
      created_at: '2023-04-17T05:33:33.315Z',
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
