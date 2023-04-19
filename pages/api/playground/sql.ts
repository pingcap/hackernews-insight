// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import MySQLService, { initConnection } from 'src/services/mysql';
import RecaptchaService from 'src/services/recaptcha';

import logger from 'next-pino/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ [x: string]: any }>
) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  if (process.env.NODE_ENV !== 'development') {
    const recaptchaService = new RecaptchaService();
    const result = await recaptchaService.verifyRequest(req, res, 'ADMIN');

    if (!result) return;
  }

  const { sql } = req.body;
  if (!sql) {
    res.status(400).end();
    return;
  }

  const mysqlService = new MySQLService(await initConnection());
  const { rows, error } = await mysqlService.execute(sql);
  mysqlService.cleanUp();
  if (error) {
    // throw new Error(error);
    logger.error(
      {
        name: 'api/playground/sql',
        error,
      },
      `execute SQL error`
    );
    res.status(500).json({ error });
  }

  res.status(200).json({ rows, sql });
}
