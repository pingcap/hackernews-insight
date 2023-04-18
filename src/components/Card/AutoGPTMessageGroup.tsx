import * as React from 'react';
import Box from '@mui/material/Box';
import { useRecoilValue } from 'recoil';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
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
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';

import 'github-markdown-css/github-markdown-light.css';

import { questionsState } from 'src/recoil/atoms';
import { postAutoGPTAgents, getAutoGPTAgentLogs } from 'src/api/autogpt/agents';
import type { AgentLogType } from 'pages/api/autogpt/agents/[id]/logs';
import { SearchInput } from 'src/components/Layout/QuestionHeader';

function AutoGPTSearchInput() {
  const [search, setSearch] = React.useState<string>('');

  const router = useRouter();

  const handleSearch = (content: string) => {
    if (content && content !== router.query?.search) {
      router.push(`/?search=${encodeURIComponent(search)}`);
    }
  };

  // React.useEffect(() => {
  //   if (router.query?.search) {
  //     setSearch(decodeURIComponent(router.query?.search as string));
  //   }
  // }, [router.query?.search]);

  return (
    <SearchInput
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSearch(search);
          setSearch('');
        }
      }}
      onClear={() => {
        setSearch('');
        handleSearch('');
      }}
    />
  );
}

export default function AutoGPTMessageGroup() {
  const questions = useRecoilValue(questionsState);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '2rem',

          height: 'calc(100vh - 200px)',
          overflowY: 'auto',
          mb: '1rem',
        }}
      >
        {questions
          .slice()
          .reverse()
          .map((q, idx) => (
            <AutoGPTMessagePair key={`${q}`} question={q} />
          ))}
      </Box>
      <AutoGPTSearchInput />
    </Box>
  );
}

export function AutoGPTMessagePair(props: { question: string }) {
  const { question } = props;

  const [agentId, setAgentId] = React.useState<number | null>(null);
  const [logs, setLogs] = React.useState<AgentLogType[] | null>(null);

  React.useEffect(() => {
    const run = async () => {
      const res = await postAutoGPTAgents(question);
      const { id } = res;
      setAgentId(id);
    };

    question && run();
  }, [question]);

  React.useEffect(() => {
    let stop = false;

    const run = async () => {
      if (stop) return;
      if (agentId) {
        const res = await getAutoGPTAgentLogs(agentId);
        setLogs(res);
        if (
          res[res.length - 1].status === 'task_complete' ||
          res[res.length - 1].log_level === 'error'
        ) {
          stop = true;
        }
      }
    };

    const interval = setInterval(run, 2000);

    return () => clearInterval(interval);
  }, [agentId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <ChatBubble role="user" content={question} />
      {logs && logs.length > 0 && <AutoGPTMessageBot logs={logs} />}
    </Box>
  );
}

export function AutoGPTMessageBot(props: { logs: AgentLogType[] }) {
  const { logs } = props;

  const lastLog = logs[logs.length - 1];

  return (
    <>
      {logs?.map((log, idx) => (
        <ChatBubble
          key={`${idx}-${log}`}
          role="assistant"
          content={log.content}
          error={log.log_level === 'error'}
        />
      ))}
      {['loading', 'processing'].includes(lastLog.status) && (
        <ChatBubble role="assistant">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={20} />
          </Box>
        </ChatBubble>
      )}
    </>
  );
}

function ChatBubble(props: {
  content?: string;
  role: 'user' | 'assistant';
  children?: React.ReactNode;
  error?: boolean;
}) {
  const { role, content, error, children } = props;
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
            px: '1rem',
            py: '0.5rem',
            maxWidth: '80%',
            borderRadius: '1rem',
            bgcolor: role === 'user' ? 'hn.primary' : 'background.paper',

            '& .markdown-body': {
              color: role === 'user' ? 'primary.contrastText' : 'text.primary',
              bgcolor: 'transparent',

              ...(error && {
                color: (theme) => theme.palette.error.main,
              }),
            },
          }}
        >
          {content && (
            <Box className="markdown-body">
              <ReactMarkdown rehypePlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </Box>
          )}
          <Box>{children}</Box>
        </Paper>
      </Box>
    </>
  );
}
