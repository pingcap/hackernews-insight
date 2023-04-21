import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilState,
} from 'recoil';

import { ChatMessageType, QuestionType } from 'src/types';

export const questionsState = atom<
  (QuestionType & {
    feedback?: Omit<QuestionType, 'agentId'>[];
  })[]
>({
  key: 'questionsState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const questionLoadingState = atom<boolean>({
  key: 'questionLoadingState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const questionDisableInputState = atom<boolean>({
  key: 'questionDisableInputState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const questionIsInputingState = atom<boolean>({
  key: 'questionIsInputingState',
  default: false,
});

export const chatMessagesState = atom<ChatMessageType[]>({
  key: 'chatMessagesState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
