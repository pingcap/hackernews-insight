import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import ClearIcon from '@mui/icons-material/Clear';
import TerminalIcon from '@mui/icons-material/Terminal';

import { TiDBCloudLogo, WebsiteLogo } from 'src/components/Icons';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.85),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.95),
  },
  marginLeft: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.hn.primary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: alpha(theme.palette.common.black, 0.75),
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export interface SearchAppBarProps {
  handleSearch?: (question: string) => void;
  disableSearch?: boolean;
  hideSearch?: boolean;
}

export default function SearchAppBar(props: SearchAppBarProps) {
  const { disableSearch = false, hideSearch = true } = props;

  const [search, setSearch] = React.useState('');

  const router = useRouter();

  const handleSearch = (content: string) => {
    if (content && content !== router.query?.search) {
      router.push(`/?search=${encodeURIComponent(search)}`);
    }
  };

  React.useEffect(() => {
    if (router.query?.search) {
      setSearch(decodeURIComponent(router.query?.search as string));
    }
  }, [router.query?.search]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          // backgroundColor: 'hn.primary',
          backgroundColor: '#fff',
          boxShadow: 'none',
        }}
      >
        <Container>
          <Toolbar
            sx={{
              gap: '1rem',
              backgroundColor: 'hn.primary',
              justifyContent: 'space-between',
            }}
          >
            <Link href="/">
              <Box
                sx={{
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <WebsiteLogo
                  sx={{
                    width: '3rem',
                    height: '3rem',
                    fill: 'transparent',
                  }}
                />
                <Typography
                  variant="body1"
                  noWrap
                  overflow="visible"
                  sx={{
                    lineHeight: 1.2,
                    color: '#222',
                    fontSize: { xs: '16px', md: '20px' },
                  }}
                >
                  Chat2Query
                  <br />
                  Hacker News
                </Typography>
              </Box>
            </Link>
            {!hideSearch && (
              <SearchInput
                disabled={disableSearch}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(search);
                  }
                }}
                onClear={() => {
                  setSearch('');
                  handleSearch('');
                }}
              />
            )}
            <IconButton
              aria-label="admin"
              disableRipple
              onClick={() => {
                router && router.push('/playground');
              }}
            >
              <TerminalIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export function SearchInput(props: {
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}) {
  const { disabled = false, value, onChange, onKeyDown, onClear } = props;

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Input your question here…"
        inputProps={{ 'aria-label': 'search' }}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <IconButton
        size="small"
        aria-label="clear"
        disableRipple
        disabled={disabled}
        onClick={onClear}
        sx={{
          display: value ? 'inline-flex' : 'none',
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
      <Box
        display="flex"
        alignItems="center"
        gap="0.5rem"
        pl="0.5rem"
        pr="0.5rem"
      >
        <Typography variant="body2" color="text.secondary" whiteSpace="nowrap">
          Powered by
        </Typography>
        <Box
          component="a"
          target="_blank"
          href="https://tidbcloud.com/channel?utm_source=chat2query-hackernews&utm_medium=referral"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <TiDBCloudLogo />
          <Typography
            variant="body2"
            fontWeight="bold"
            color="#444"
            whiteSpace="nowrap"
          >
            TiDB Cloud
          </Typography>
        </Box>
      </Box>
    </Search>
  );
}
