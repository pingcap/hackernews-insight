import * as React from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Head from 'next/head';

import { chatMessagesState } from 'src/recoil/atoms';

import { postChatMessages } from 'src/api/chat';
import { ChatMessageType } from 'src/types';

export default function ChatPage() {
  const [inputString, setInputString] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [messages, setMessages] = useRecoilState(chatMessagesState);

  const handleSubmit = async (text: string) => {
    setLoading(true);
    try {
      const question = inputString;
      setMessages((prev) => {
        return [
          ...prev,
          {
            role: 'user',
            content: question,
          },
        ];
      });
      setInputString('');
      const res = await postChatMessages(question, messages);
      const { answer } = res;
      setMessages((prev) => {
        return [...prev, answer];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ChatLayout>
        <Box
          sx={{
            height: '100vh',
            flexGrow: 1,
          }}
        >
          <ChatBubbles items={messages} />
          <AppBar
            position="fixed"
            sx={{
              top: 'auto',
              bottom: 0,
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          >
            <Container>
              <Toolbar
                sx={{
                  backgroundColor: 'hn.primary',
                  gap: '1rem',
                }}
              >
                <Input>
                  <StyledInputBase
                    placeholder="Input your question here…"
                    inputProps={{ 'aria-label': 'chat' }}
                    value={inputString}
                    onChange={(e) => {
                      setInputString(e.target.value);
                    }}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        console.log('chat message', inputString);
                        if (handleSubmit) {
                          handleSubmit(inputString);
                        }
                      }
                    }}
                  />
                </Input>
                <IconButton
                  color="inherit"
                  aria-label="restart conversation"
                  disabled={loading || inputString === ''}
                  onClick={() => {
                    if (handleSubmit) {
                      handleSubmit(inputString);
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Toolbar>
            </Container>
          </AppBar>
        </Box>
      </ChatLayout>
    </>
  );
}

function ChatBubbles(props: { items: ChatMessageType[] }) {
  const { items } = props;

  const messagesMemo = React.useMemo(() => {
    return _.reverse([...items]);
  }, [items]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '1rem',

        height: 'calc(100vh - 64px)',
        pt: '1rem',
        pb: '1rem',
        overflowY: 'auto',
      }}
    >
      {messagesMemo.map((item, idx) => {
        return <ChatBubble key={idx} item={item} />;
      })}
    </Box>
  );
}

function ChatBubble(props: { item: ChatMessageType }) {
  const { role, content } = props.item;
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: role === 'user' ? 'row-reverse' : 'row',
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            padding: '1rem',
            maxWidth: '80%',
          }}
        >
          {content}
        </Paper>
      </Box>
    </>
  );
}

function ChatLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <>
      <Head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://www.google.com/recaptcha/enterprise.js?render=6LddhhAkAAAAAK71u3xPexiZdT62i4q4PLETG47s"></script>
      </Head>
      <Box
        sx={{
          backgroundColor: '#fff',
          height: 'auto',
          minHeight: '100vh',
        }}
      >
        <Container sx={{ height: '100%' }}>
          <Box
            sx={{
              backgroundColor: 'hn.background',
              height: '100%',
              // padding: { xs: '1rem', sm: '1.5rem' },
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>
    </>
  );
}

const Input = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.95),
  marginLeft: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: alpha(theme.palette.common.black, 0.75),
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `1rem`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));
