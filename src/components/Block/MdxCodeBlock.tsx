import * as React from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore /* tslint:disable-next-line */
import { stackoverflowLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export default function Code(props: any) {
  const { node, inline, className, children, ...rest } = props;

  const matchMemo = React.useMemo(() => {
    return /language-(\w+)/.exec(className || '');
  }, [className]);

  const language = matchMemo && matchMemo[1];

  if (!inline && matchMemo) {
    return (
      <SyntaxHighlighter
        {...props}
        // eslint-disable-next-line react/no-children-prop
        children={String(children).replace(/\n$/, '')}
        style={stackoverflowLight}
        language={language}
        PreTag="div"
        customStyle={{
          backgroundColor: 'transparent',
        }}
      />
    );
  }

  return (
    <code className={className} {...rest}>
      {children}
    </code>
  );
}
