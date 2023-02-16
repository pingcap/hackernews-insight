import { BotService } from 'src/services/bot';
import Question2SQLTemplate from 'src/services/bot/templates/Question2SQLTemplate';

import logger from 'next-pino/logger';

export const config = {
  runtime: 'edge',
};

export default async function handler(_: any) {
  // const readable = new ReadableStream({
  //   start(controller) {
  //     controller.enqueue(
  //       encoder.encode(
  //         '<html><head><title>Vercel Edge Functions + Streaming</title></head><body>'
  //       )
  //     );
  //     controller.enqueue(encoder.encode('Vercel Edge Functions + Streaming'));
  //     controller.enqueue(encoder.encode('1Vercel Edge Functions + Streaming'));
  //     controller.enqueue(encoder.encode('</body></html>'));
  //     controller.close();
  //   },
  // });
  const botService = new BotService(logger, process.env.OPENAI_API_KEY || '');
  const template = new Question2SQLTemplate();
  const stream = await botService.getAnswerStream(
    `How many new stories and comments per month?`,
    template
  );

  return new Response(stream);
}
