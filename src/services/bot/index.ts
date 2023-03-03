import { Configuration, OpenAIApi } from 'openai';
import pino from 'pino';

import Question2SQLTemplate from 'src/services/bot/templates/Question2SQLTemplate';
import Data2ChartTemplate from 'src/services/bot/templates/Data2ChartTemplate';

export class BotService {
  private readonly openAI: OpenAIApi;

  constructor(
    private readonly log: pino.Logger,
    private readonly apiKey: string
  ) {
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });
    this.openAI = new OpenAIApi(configuration);
  }

  async getAnswer(question: string, template: Question2SQLTemplate) {
    const prompt = template.getTemplate(question);

    const data = await this.openAI
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0,
        n: 1,
        stream: false,
        stop: ['#', '---'],
      })
      .then((response) => response.data);

    this.log.info(
      {
        name: 'services/bot',
        data: data,
      },
      `BotService.getAnswer`
    );

    return { answer: data?.choices[0]?.message?.content, id: data.id };
  }

  async data2Chart(question: string, data: any, template: Data2ChartTemplate) {
    if (!data) {
      return {};
    }
    const dataSilce = data.slice(2);

    const prompt = template.getTemplate(question, dataSilce);
    const res = await this.openAI
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
        stop: ['#', '---'],
        temperature: 0,
        max_tokens: 100,
        // top_p: 0.4,
        n: 1,
      })
      .then((response) => response.data);

    this.log.info(
      {
        name: 'services/bot',
        data: res,
      },
      `BotService.data2Chart`
    );

    return { answer: res?.choices[0]?.message?.content, id: res.id };
  }
}
