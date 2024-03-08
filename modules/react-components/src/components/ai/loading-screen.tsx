import React, { useEffect, useState } from 'react';
import { Progress, Segment, Label } from 'semantic-ui-react';
import axios from 'axios';
import { ReactComponent as LoadingPlaceholder } from
    "../../../../theme/src/themes/wso2is/assets/images/branding/ai-loading-screen-placeholder.svg";

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
    try {
        const response = await axios.get('http://localhost:3000/status');
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
    }
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

      if (status.branding_generation_completed) {
        setPolling(false);
      }
    }, 1000); // Poll every 1000 ms (1 second)

    return () => clearInterval(interval);
  }, [polling]);

  return (
    <Segment>
      <LoadingPlaceholder/>
      <Progress percent={progress} indicating>
        <Label>{currentStep}</Label>
      </Progress>
    </Segment>
  );
};
