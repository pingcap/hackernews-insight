import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatBotService } from 'src/services/chatGPT';
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

  const { question, messages } = req.body;
  if (!question) {
    res.status(400).end();
    return;
  }

  const botService = new ChatBotService(
    logger,
    process.env.OPENAI_API_KEY || ''
  );

  const answer = await botService.chat(question, messages);

  res.status(200).json({ ...answer });
}
