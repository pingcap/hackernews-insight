import { axiosWithRecaptchaToken } from 'src/utils/axios';
import { waitGRecaptchaReady } from 'src/api/question';

export async function postAdminSQL(sql: string) {
  await waitGRecaptchaReady();
  const grecaptchaToken = await grecaptcha.enterprise.execute(
    process.env.NEXT_PUBLIC_RECAPTCHA_KEY || '',
    {
      action: 'ADMIN',
    }
  );
  const axios = axiosWithRecaptchaToken(grecaptchaToken);

  return axios
    .post('/api/playground/sql', {
      sql,
    })
    .then((response) => response.data);
}
