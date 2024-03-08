import React, { useEffect, useState } from 'react';
import { Progress, Segment, Label } from 'semantic-ui-react';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [polling, setPolling] = useState(true);

  const steps = [
    { key: 'render_webpage', label: 'Rendering Webpage', value: 20 },
    { key: 'extract_webpage_content', label: 'Extracting Content', value: 40 },
    { key: 'webpage_extraction_completed', label: 'Content Extracted', value: 60 },
    { key: 'generate_branding', label: 'Generating Branding', value: 80 },
    { key: 'branding_generation_completed', label: 'Branding Completed', value: 100 },
  ];

  const fetchProgress = async () => {
    const response = await fetch('https://your-api-endpoint.com/status');
    const data = await response.json();
    return data;
  };

  const updateProgress = (status) => {
    steps.forEach(step => {
      if (status[step.key]) {
        setProgress(step.value);
        setCurrentStep(step.label);
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!polling) return;
      
      const status = await fetchProgress();
      updateProgress(status.status);

      if (status.status.branding_generation_completed) {
        setPolling(false);
      }
    }, 1000); // Poll every 1000 ms (1 second)

    return () => clearInterval(interval);
  }, [polling]);

  return (
    <Segment>
      <img src="path/to/your/loading-image.png" alt="Loading..." />
      <Progress percent={progress} indicating>
        <Label>{currentStep}</Label>
      </Progress>
    </Segment>
  );
};
