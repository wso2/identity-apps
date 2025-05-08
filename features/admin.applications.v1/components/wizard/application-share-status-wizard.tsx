import React, { useState } from "react";
import { ShareApplicationStatusResponseList } from "../share-application-status-response-list";
import { ShareApplicationStatusResponseSummary } from "../../models/application";

interface ApplicationShareStatusWizardProps {
    componentId: string;
    operationId: string;
    isSubmitting: boolean;
    isLoading: boolean;
    hasError: boolean;
}

const ApplicationShareStatusWizard: React.FC<ApplicationShareStatusWizardProps> = ({
    componentId,
    operationId,
}) => {

    const [ hasLoaded, setHasLoaded ] = useState<boolean>(false);
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ applicationShareStatusResponseSummary, setApplicationShareStatusResponseSummary ] = useState<ShareApplicationStatusResponseSummary>(initialApplicationShareStatusResponseSummary);

    return (
        <>
            <ShareApplicationStatusResponseList
                isLoading={ !hasLoaded }
                operationId={ operationId }
                data-componentid={ `${componentId}-manual-response-list` }
                hasError={ hasError }
                shareApplicationSummary={ applicationShareStatusResponseSummary }
            />
        </>
    );
};

const initialApplicationShareStatusResponseSummary: ShareApplicationStatusResponseSummary = {
    successAppShare: 0,
    failedAppShare: 0
};

export default ApplicationShareStatusWizard;


