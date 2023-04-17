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
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

import 'github-markdown-css/github-markdown-light.css';

import { questionsState } from 'src/recoil/atoms';
import { postAutoGPTAgents, getAutoGPTAgentLogs } from 'src/api/autogpt/agents';
import type { AgentLogType } from 'pages/api/autogpt/agents/[id]/logs';

export default function AutoGPTMessageGroup(props: {}) {
  const {} = props;

  const questions = useRecoilValue(questionsState);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      {questions.map((q, idx) => (
        <AutoGPTMessagePair key={`${idx}-${q}`} question={q} />
      ))}
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
    const run = async () => {
      if (agentId) {
        const res = await getAutoGPTAgentLogs(agentId);
        setLogs(res);
      }
    };

    run();

    // const interval = setInterval(run, 2000);

    // return () => clearInterval(interval);
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

  const [firstLog, ...restLogs] = logs;

  if (logs.length === 1 && firstLog.log_level === 'loading') {
    return (
      <ChatBubble role="assistant">
        <CircularProgress size={20} />
      </ChatBubble>
    );
  }

  return (
    <>
      {logs?.map((log, idx) => (
        <ChatBubble
          key={`${idx}-${log}`}
          role="assistant"
          content={log.content}
        />
      ))}
    </>
  );
}

function ChatBubble(props: {
  content?: string;
  role: 'user' | 'assistant';
  children?: React.ReactNode;
}) {
  const { role, content, children } = props;
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
            },
          }}
        >
          {content && (
            <Box className="markdown-body">
              <ReactMarkdown>{content}</ReactMarkdown>
            </Box>
          )}
          <Box>{children}</Box>
        </Paper>
      </Box>
    </>
  );
}
