import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilState,
} from 'recoil';

import { ChatMessageType } from 'src/types';

export const questionsState = atom<string[]>({
  key: 'questionsState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const questionLoadingState = atom<boolean>({
  key: 'questionLoadingState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const chatMessagesState = atom<ChatMessageType[]>({
  key: 'chatMessagesState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
