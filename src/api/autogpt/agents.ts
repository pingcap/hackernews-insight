import { axiosWithRecaptchaToken } from 'src/utils/axios';
import { waitGRecaptchaReady } from 'src/api/question';

export async function postAutoGPTAgents(question: string) {
  await waitGRecaptchaReady();
  const grecaptchaToken = await grecaptcha.enterprise.execute(
    process.env.NEXT_PUBLIC_RECAPTCHA_KEY || '',
    {
      action: 'CHAT',
    }
  );
  const axios = axiosWithRecaptchaToken(grecaptchaToken);

  return axios
    .post('/api/autogpt/agents', {
      question,
    })
    .then((response) => response.data);
}

export async function getAutoGPTAgentLogs(id: number | string) {
  await waitGRecaptchaReady();
  const grecaptchaToken = await grecaptcha.enterprise.execute(
    process.env.NEXT_PUBLIC_RECAPTCHA_KEY || '',
    {
      action: 'CHAT',
    }
  );
  const axios = axiosWithRecaptchaToken(grecaptchaToken);

  return axios
    .get(`/api/autogpt/agents/${id}/logs?start_from=0`)
    .then((response) => response.data);
}
