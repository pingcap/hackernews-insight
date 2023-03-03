import { axiosWithRecaptchaToken } from 'src/utils/axios';
import { waitGRecaptchaReady } from 'src/api/question';
import { ChatMessageType } from 'src/types';

export async function postChatMessages(
  question: string,
  messages: ChatMessageType[]
) {
  await waitGRecaptchaReady();
  const grecaptchaToken = await grecaptcha.enterprise.execute(
    process.env.NEXT_PUBLIC_RECAPTCHA_KEY || '',
    {
      action: 'CHAT',
    }
  );
  const axios = axiosWithRecaptchaToken(grecaptchaToken);

  return axios
    .post('/api/chat', {
      question,
      messages,
    })
    .then((response) => response.data);
}
