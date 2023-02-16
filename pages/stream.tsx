import axios from 'axios';
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Test() {
  const [result, setResult] = React.useState<string>('');

  React.useEffect(() => {
    const func = async () => {
      // const response = await axios.get('/api/question/stream', {
      //   responseType: 'stream',
      // });
      // const stream = response.data;

      // stream.on('data', (data: any) => {
      //   console.log(data);
      // });

      // stream.on('end', () => {
      //   console.log('stream done');
      // });
      axios({
        method: 'get',
        url: '/api/question/stream',
        responseType: 'stream',
      }).then(function (response) {
        const stream = response.data;
        // console.log(stream)
        stream.on('data', (data: any) => {
          console.log(data);
        });

        stream.on('end', () => {
          console.log('stream done');
        });
      });
    };

    // func();
  }, []);

  const handleBtnClick = async () => {
    // const response = await axios.get('/api/question/stream', {
    //   responseType: 'stream',
    // });

    // const reader = response.data.getReader();
    // const decoder = new TextDecoder();
    // let done = false;

    // while (!done) {
    //   const { value, done: doneReading } = await reader.read();
    //   done = doneReading;
    //   const chunkValue = decoder.decode(value);
    //   setResult((prev) => prev + chunkValue);
    // }

    const response = await fetch('/api/question/stream', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Edge function returned.');

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResult((prev) => prev + chunkValue);
    }
  };

  return (
    <>
      <Typography variant="h2">Stream Test</Typography>
      <Button onClick={handleBtnClick}>test</Button>
      <Typography variant="h2">Result</Typography>
      <Typography>{result}</Typography>
    </>
  );
}
