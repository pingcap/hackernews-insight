import dynamic from 'next/dynamic';

export const DynamicSQLEditor = dynamic(
  import('src/components/Editor/SQLEditor'),
  {
    ssr: false,
  }
);
