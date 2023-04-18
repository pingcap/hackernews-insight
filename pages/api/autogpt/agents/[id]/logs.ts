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

  res.json([
    {
      id: 390,
      content: "I'm a robot running Auto-GPT on TiDB Cloud Serverless",
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:35:17.760Z',
    },
    {
      id: 391,
      content:
        'Our goals: \n - Answer: Total number of registered users?\n - Shutdown upon achieving your goal\n',
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:35:17.767Z',
    },
    {
      id: 393,
      content:
        "**Thoughts:** ```I will list all the tables in the database, and inspect their schema to determine the table where the users are saved. After that, I will write a single SQL query to determine the total number of users in the table```\n\n**Reasoning:** ```By listing tables in the database first, I can get an overall idea about the kind of information that is being saved in the database, which can further guide my approach to determine the total number of users in the database```\n\n**Plan:** \n```\n- List all the tables in the database\n- Inspect their schema using 'SELECT * FROM <table> LIMIT 5'\n- Identify the table that contains user data\n- Use SQL to determine the total number of registered users\n```\n**Criticism:** ```I should keep in mind to write a single SQL query so that the complexity does not become too high. Also, I need to make sure not to use any table name that does not appear in the 'list tables' query to avoid errors```\n",
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:35:50.484Z',
    },
    {
      id: 394,
      content:
        "**Next action:** \nCommand = `tidb_query_executor` \nArguments = `{'query': 'SHOW TABLES;'}`",
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:36:05.912Z',
    },
    {
      id: 396,
      content:
        'Command `tidb_query_executor` returned: \n\n |Tables_in_hackernews|\n|---|\n|items|\n|users|\n',
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:36:06.479Z',
    },
    {
      id: 400,
      content:
        "**Thoughts:** ```Now that all the tables are listed, I will inspect the schema of each table by running 'SELECT * FROM <table> LIMIT 5' command to identify the table that contains user information. Once I have identified the table with user data, I will use a SQL count function to find the total number of registered users```\n\n**Reasoning:** ```By inspecting the schema of each table, I can get an insight into the information available in the database, which can further help me to narrow down my search for the table that contains user data.```\n\n**Plan:** \n```\n- Inspect schema of each table in the list of tables using 'SELECT * FROM <table> LIMIT 5'\n- Identify the table that contains user data\n- Use SQL count function to determine total number of registered users\n```\n**Criticism:** ```I should ensure that the table I have identified contains user data and not any irrelevant data. Also, I need to ensure that I provide the correct table name in the SQL count function to avoid errors```\n",
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:36:39.693Z',
    },
    {
      id: 401,
      content:
        "**Next action:** \nCommand = `tidb_query_executor` \nArguments = `{'query': 'SELECT * FROM users LIMIT 5;'}`",
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:36:55.178Z',
    },
    {
      id: 403,
      content:
        'Command `tidb_query_executor` returned: \n\n |id|about|karma|created|last_fetch_at|\n|---|---|---|---|---|\n|0-||1|1394614453|2022-12-22 06:17:22|\n|0--__-_-__--0||2|1541101771|2022-12-22 22:05:19|\n|0-0||2|1259866371|2022-12-22 12:25:51|\n|0-1|None|48|1595106199|2022-12-21 23:10:15|\n|0-4||-21|1288394173|2022-12-22 08:12:16|\n',
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:36:55.728Z',
    },
    {
      id: 405,
      content:
        '**Thoughts:** ```After inspecting the schema of the `users` table, I have identified that the column `created` contains the timestamp of user creation. I can use this column and a SQL count function to determine the total number of registered users.```\n\n**Reasoning:** ```The `created` column contains the timestamp of user creation, so I can use this column to determine the total number of registered users. By using the SQL count function, I can find the exact number of users who have created an account with HackerNews.```\n\n**Plan:** \n```\n- Use SQL count function to find the number of users in the `users` table\n```\n**Criticism:** ```I should ensure that I provide the correct column name and table name in the SQL count function to avoid errors.```\n',
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:37:08.116Z',
    },
    {
      id: 406,
      content:
        "**Next action:** \nCommand = `tidb_query_executor` \nArguments = `{'query': 'SELECT COUNT(*) FROM users;'}`",
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:37:08.133Z',
    },
    {
      id: 408,
      content:
        'Command `tidb_query_executor` returned: \n\n |COUNT(*)|\n|---|\n|969866|\n',
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:37:08.475Z',
    },
    {
      id: 410,
      content:
        '**Thoughts:** ```Based on the result of the SQL query, the total number of registered users is 969,866. This will be my final response to the initial question.```\n\n**Reasoning:** ```The SQL query using the count function has returned a single value, which represents the total number of registered users on HackerNews. Since the query returned no errors, the result is the final answer to the question about the total number of registered users.```\n\n**Plan:** \n```\n- Finalize the response to the initial question\n```\n**Criticism:** ```None```\n',
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:37:19.230Z',
    },
    {
      id: 411,
      content:
        "**Next action:** \nCommand = `task_complete` \nArguments = `{'reason': 'Total number of registered users on HackerNews is 969,866'}`",
      role: 'system',
      log_level: 'info',
      status: 'processing',
      created_at: '2023-04-18T01:37:19.246Z',
    },
    {
      id: 413,
      content: 'Task complete',
      role: 'system',
      log_level: 'info',
      status: 'task_complete',
      created_at: '2023-04-18T01:37:19.261Z',
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
