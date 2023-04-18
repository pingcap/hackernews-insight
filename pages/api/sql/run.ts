import type { NextApiRequest, NextApiResponse } from 'next';

import MySQLService, { initConnection } from 'src/services/mysql';
import RecaptchaService from 'src/services/recaptcha';

import logger from 'next-pino/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  if (process.env.NODE_ENV !== 'development') {
    const recaptchaService = new RecaptchaService();
    const result = await recaptchaService.verifyRequest(req, res, 'CHAT');

    if (!result) return;
  }

  const { sql } = req.body;
  if (!sql) {
    res.status(400).end();
    return;
  }

  logger.info(sql);

  try {
    const mysqlService = new MySQLService(await initConnection());
    const { rows, fields, error } = await mysqlService.execute(sql);
    mysqlService.cleanUp();
    if (error) {
      logger.error(error);
      res.status(500).json({ error });
      return;
    }
    logger.info(rows);
    res.status(200).json({ fields, rows });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ error });
  }
}
