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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LoadingButton from '@mui/lab/LoadingButton';

import 'github-markdown-css/github-markdown-light.css';

import { chatMessagesState } from 'src/recoil/atoms';

import { postChatMessages, postRunSql } from 'src/api/chat';
import { ChatMessageType } from 'src/types';
import { retrieveCodeFromMdString } from 'src/utils/chat';
import { row2string } from 'src/utils/stringfy';
import CodeBlock from 'src/components/Block/CodeBlock';

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
          className="markdown-body"
        >
          {role === 'user' && (
            <ReactMarkdown rehypePlugins={[remarkGfm]}>{content}</ReactMarkdown>
          )}
          {role === 'assistant' && <AssistantBubbleContent content={content} />}
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

const AssistantBubbleContent = (props: { content: string }) => {
  const { content } = props;
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [result, setResult] = React.useState<null | { rows: any; fields: any }>(
    null
  );

  const SqlStrMemo = React.useMemo(() => {
    return retrieveCodeFromMdString(content);
  }, [content]);

  const handleRunSql = async () => {
    if (!SqlStrMemo) {
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResult(null);
    try {
      const res = await postRunSql(SqlStrMemo);
      setResult(res);
      console.log('res', res);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error?.response?.data?.error?.message ||
          error?.message ||
          `Unknown error`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ReactMarkdown rehypePlugins={[remarkGfm]}>{content}</ReactMarkdown>
      {SqlStrMemo && (
        <LoadingButton
          loading={loading}
          onClick={handleRunSql}
          variant="contained"
          sx={{
            backgroundColor: 'hn.primary',
            '&:hover': {
              backgroundColor: 'hn.primary',
            },
          }}
        >
          Run SQL
        </LoadingButton>
      )}
      {errorMsg && (
        <Typography color="error" variant="body2">
          {errorMsg}
        </Typography>
      )}
      {result && (
        <Box pt={2}>
          <CodeBlock
            language="bash"
            boxSx={{
              border: '0.5px solid #e0e0e0',
            }}
          >
            {row2string(result.rows)}
          </CodeBlock>
        </Box>
      )}
    </>
  );
};
