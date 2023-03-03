import { BotService } from 'src/services/bot';
import { ChatMessageType } from 'src/types';

import pino from 'pino';

export class ChatBotService extends BotService {
  private readonly promptPrefix: string;

  constructor(logger: pino.Logger, apiKey: string) {
    super(logger, apiKey);

    this.promptPrefix = `If I ask something nothing on the SQL, MySQL tables for hackernews, please answer "You should ask sth about the hackernews!". Here's my next question:\n`;
  }

  wrapWithTemplate(question?: string) {
    return `In this conversation, you must take a SQL advisor role. No matter what I say, you should try your best to give a SQL answer, or try to refine the SQL. Now let me introduce you details about the tables:
    # MySQL tables, for hackernews, with their properties:
    # items:
    # - id(bigint) primary key
    # - title(varchar)
    # - \`by\`(varchar), foreign key, references users(id)
    # - url, nullable
    # - parent(bigint), foreign key, references items(id)
    # - descendants(integer) alias comments_count
    # - text(text)
    # - deleted(boolean)
    # - dead(boolean)
    # - type(varchar), include: story, comment, poll, job
    # - time(integer)
    # - score(integer)
    # users:
    # - id(varchar) primary key
    # - karma(integer)
    # - about(text)
    # - created(integer)
    # what is datetime item created: SELECT FROM_UNIXTIME(time) AS created_at FROM items;
    # what is datetime user created: SELECT FROM_UNIXTIME(created) AS created_at FROM users;
    # what is month item created: SELECT DATE_FORMAT(FROM_UNIXTIME(time), '%Y-%m-01') AS month FROM items;
    # what is domain for item url: SELECT SUBSTRING_INDEX(url, '/', 3) AS domain FROM items;
    # what is TLD for item:
    # SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(url, '/', 3), '://', -1), '/', 1), '?', 1), '.', -1)#{' '}
    # AS tld FROM items WHERE url IS NOT NULL;
    # what is the default limit for all queries: 100
    # what is the default limit for agg queries: 20
    # what is the default filter for items: deleted = 0 AND dead = 0
    # what is the default sort order for all queries: if contain day,month,year -> asc
    # what is score of item: the num of item voted by other users
    # what is SQL mention? SELECT COUNT(*) FROM items WHERE LOWER(CONCAT_WS(' ', title, text)) REGEXP '\\\\bsql\\\\b' from items;
    # Notice: don't use reserved word as alias name or column name in sql
    # Notice: don't output superfluous and leading double quote in sql
    
    Must append the limit to SQL!!!
    Let's think step by step, use best practice of writing SQL, use common table expression if necessary, generate only one SQL to answer follow question: "(I want you think like a god)${question}"`;
  }

  async chat(
    question: string,
    messages: { role: 'user' | 'system' | 'assistant'; content: string }[]
  ) {
    const refinedMessages: ChatMessageType[] = [
      {
        role: 'system',
        content: this.wrapWithTemplate(''),
      },
    ];
    refinedMessages.push(...messages);
    refinedMessages.push({
      role: 'user',
      content: this.promptPrefix + question,
    });

    const data = await this.openAI
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: refinedMessages,
        max_tokens: 100,
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
      `BotService.chat`
    );

    return { answer: data?.choices[0]?.message, id: data.id };
  }
}
