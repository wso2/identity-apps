import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ShareApplicationStatusResponseList } from "../share-application-status-response-list";
import { ApplicationShareUnitStatusResponse, ShareApplicationStatusResponseSummary } from "../../models/application";
import { getApplicationUnitShares } from "../../api/application";

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
    const { t } = useTranslation(); 

    const [ hasLoaded, setHasLoaded ] = useState<boolean>(false);
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ applicationShareStatusResponse, setApplicationShareStatusResponse ] = useState<ApplicationShareUnitStatusResponse[]>([]);
    const [ applicationShareStatusResponseSummary, setApplicationShareStatusResponseSummary ] = useState<ShareApplicationStatusResponseSummary>(initialApplicationShareStatusResponseSummary);

    useEffect(() => {
    
        getApplicationUnitShares(operationId)
            .then((response: any) => {
                console.log(response);
                setApplicationShareStatusResponse(response.data.unitOperations);
                setHasLoaded(true);
            })
            .catch(() => {
                console.log("error");
            })
            .finally(() => {
                setHasLoaded(true); 
            });
    }, []);
    

    return (
        <>
            <ShareApplicationStatusResponseList
                isLoading={ !hasLoaded }
                data-componentid={ `${componentId}-manual-response-list` }
                hasError={ hasError }
                responseList={ applicationShareStatusResponse }
                shareApplicationSummary={ applicationShareStatusResponseSummary }
                successAlert={ (
                    <Alert severity="success">
                        <AlertTitle>
                            {
                                t("user:modals.bulkImportUserWizard." +
                                "wizardSummary.manualCreation.alerts.creationSuccess.message")
                            }
                        </AlertTitle>
                        {
                            t("user:modals.bulkImportUserWizard." +
                            "wizardSummary.manualCreation.alerts.creationSuccess.description")
                        }
                    </Alert>
                ) }
            />
        </>
    );
};

const initialApplicationShareStatusResponseSummary: ShareApplicationStatusResponseSummary = {
    successAppShare: 0,
    failedAppShare: 0
};

export default ApplicationShareStatusWizard;


