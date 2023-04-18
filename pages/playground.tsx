import * as React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import Layout from 'src/components/Layout';
import { postAdminSQL } from 'src/api/admin';
import CodeBlock from 'src/components/Block/CodeBlock';
import { row2string } from 'src/utils/stringfy';

import logger from 'next-pino/logger';

const DynamicAceSQLEditor = dynamic(
  () => import('src/components/Editor/SQLEditor'),
  {
    loading: () => <>Loading...</>,
    ssr: false, // https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
  }
);

// const Ace = dynamic(
//   async () => {
//     const ace = await import('react-ace');
//     await import('ace-builds/src-noconflict/mode-mysql');
//     await import('ace-builds/src-noconflict/theme-xcode');
//     await import('ace-builds/src-noconflict/ext-language_tools');
//     return ace;
//   },
//   {
//     loading: () => <>{`Loading...`}</>,
//     ssr: false,
//   }
// );

export default function AdminPage() {
  return (
    <>
      <Layout
        recapcha
        seo={{
          page: 'Admin',
        }}
      >
        <SQLPlaygroundSection />
      </Layout>
    </>
  );
}

function SQLPlaygroundSection() {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any | null>(null);
  const [rows, setRows] = React.useState<any[] | null>(null);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setRows(null);
    try {
      const res = await postAdminSQL(value);
      logger.info(res);
      setRows(res.rows);
    } catch (error: any) {
      logger.error(
        {
          name: 'page/admin',
          error,
        },
        `SQLPlayground error`
      );
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pb: '1rem',
        }}
      >
        <Typography variant="h5">SQL Playground</Typography>
        <LoadingButton
          variant="contained"
          size="small"
          startIcon={<PlayArrowIcon fontSize="inherit" />}
          disabled={!value}
          loading={loading}
          sx={{
            backgroundColor: 'hn.primary',
            '&:hover': {
              backgroundColor: 'hn.primary',
            },
          }}
          onClick={handleRun}
        >
          Run
        </LoadingButton>
      </Box>
      <Box
        sx={{
          height: '300px',
        }}
      >
        <DynamicAceSQLEditor
          mode="mysql"
          theme="xcode"
          value={value}
          onChange={handleChange}
          name="SQL_PLAYGROUND"
          enableBasicAutocompletion
        />
      </Box>
      <Box
        sx={{
          mt: '1rem',
        }}
      >
        {error && (
          <Typography variant="body2" color="error">
            {error?.response?.data?.message || error?.message || `${error}`}
          </Typography>
        )}
        <CodeBlock
          language="bash"
          hidden={!rows}
          boxSx={{
            border: '0.5px solid #e0e0e0',
          }}
        >
          {rows && row2string(rows)}
        </CodeBlock>
      </Box>
    </>
  );
}
