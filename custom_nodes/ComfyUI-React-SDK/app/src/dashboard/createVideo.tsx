
import React, { useEffect, useState } from 'react';
import { useComfy } from '../comfy/ComfyProvider';
import {
  Box,
  Button,
  Stack,
  TextField,
  LinearProgress,
} from '@mui/material';
import { Subscribe, UnSubscribe, WS_MESSAGE_TYPE_EXECUTED, WS_MESSAGE_TYPE_PROGRESS } from '../comfy/api';
import { base } from './image';

interface DashboardProps {
}

const CreateVideo: React.FC<DashboardProps> = () => {
  const { createVideoPrompt, uploadImage } = useComfy();

  const [rand, setRand] = useState<number>(Math.random());
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [inputAudio, setInputAudio] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);

  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    Subscribe('dashboard', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === WS_MESSAGE_TYPE_EXECUTED && message.data?.output?.gifs && message.data?.output?.gifs[0]?.type === "output") {
        setRand(Math.random());
        setOutputImage(message.data.output.gifs[0].filename);
        setInProgress(false);
        setProgress(0);
      } else if (message.type === WS_MESSAGE_TYPE_PROGRESS) {
        setProgress(Math.floor((message.data.value / message.data.max) * 100));
      }
    });
    return () => {
      UnSubscribe('dashboard');
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const res: any = await uploadImage(file);
        if (res) {
          console.log(`Prompt Submitted: ${res.name}`);

          const viewResponse = await fetch(`/view?filename=${res.name}&subfolder=${res.subfolder}&type=input&rand=${Math.random()}`);

          if (viewResponse.ok) {
            setInputImage(res.name);
          } else {
            console.error('File view failed');
          }
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };
  
  const handleAudioFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const res: any = await uploadImage(file);
        if (res) {
          console.log(`Prompt Submitted: ${res.name}`);
          
          const viewResponse = await fetch(`/view?filename=${res.name}&subfolder=${res.subfolder}&type=input&rand=${Math.random()}`);

          if (viewResponse.ok) {
            setInputAudio(res.name);
          } else {
            console.error('File view failed');
          }
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const generate = () => {
    if (!inputImage) {
      console.error('No input image available');
      return;
    }
    if (!inputAudio) {
      console.error('No input audio available');
      return;
    }

    createVideoPrompt(inputImage, inputAudio).then((res: { prompt_id: any; }) => {
      if (res.prompt_id) {
        alert(`Prompt Submitted: ${res.prompt_id}`);
        setInProgress(true);
      }
    });
  };

  return (
      <div>
        <Stack direction="row" spacing={2} style={{ width: '100%' }}>
          <Box flex="1" style={{ padding: '20px' }}>
            <Stack direction="column" spacing={6} style={{marginTop: '5vh'}}>
              <img src='../SoulxLogo.png'/>
              <Box
                  component="div"
                  minWidth="80%"
                  maxWidth="80%"
                  border="2px solid black"
                  p="4"
                  borderRadius="md"
                  style={{aspectRatio: '1/1'}}
              >
                {inputImage ? (
                    <img
                        src={`/view?filename=${inputImage}&type=input&rand=${rand}`}
                        alt=""
                        style={{width: '100%', height: '100%', objectFit: 'contain'}}
                    />
                ) : (
                    <img src={base} alt="Red dot" style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                )}
              </Box>
              <input
                  accept="image/*"
                  style={{display: 'none'}}
                  id="upload-button"
                  type="file"
                  onChange={handleFileUpload}
              />
              <label htmlFor="upload-button">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
              <Box
                  component="div"
                  minWidth="80%"
                  maxWidth="80%"
                  border="2px solid black"
                  p="4"
                  borderRadius="md"
                  style={{aspectRatio: '1/1'}}
              >
                  {inputAudio ? (
                      <audio controls style={{width: '100%', height: '100%'}}>
                          <source src={`/view?filename=${inputAudio}&type=input&rand=${rand}`} type="audio/mpeg"/>
                          Your browser does not support the audio element.
                      </audio>
                  ) : (
                      <p>No audio file selected</p>
                  )}
              </Box>
              <input
                  accept="audio/*"
                  style={{display: 'none'}}
                  id="upload-audio-button"
                  type="file"
                  onChange={handleAudioFileUpload}
              />
              <label htmlFor="upload-audio-button">
                <Button variant="contained" component="span">
                  Upload Audio
                </Button>
              </label>
              <Button variant="contained" color="primary" onClick={generate}>Generate</Button>
              {inProgress && <LinearProgress variant="determinate" value={progress}/>}
            </Stack>
          </Box>
          <Box flex="2" display="flex" alignItems="center" justifyContent="center" height="100vh">
            <Box
                component="div"
                minWidth="80%"
                maxWidth="80%"
                border="2px solid black"
                p="4"
                borderRadius="md"
                style={{aspectRatio: '1/1'}}
            >
              {outputImage ? (
                  <>
                    <img
                        src={`/view?filename=${outputImage}&type=output&rand=${rand}`}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        component="a"
                        href={`/view?filename=${outputImage}&type=output&rand=${rand}`}
                        download
                        style={{ marginTop: '10px' }}
                    >
                      Download
                    </Button>
                  </>
              ) : (
                  <img src={base} alt="Red dot" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
            </Box>
          </Box>
          <Box flex="1"></Box>
        </Stack>
      </div>
  );
};

export default CreateVideo;
