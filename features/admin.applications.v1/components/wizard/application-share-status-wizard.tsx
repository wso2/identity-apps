import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Button from "@oxygen-ui/react/Button";
import Tab from "@oxygen-ui/react/Tab";
import Tabs from "@oxygen-ui/react/Tabs";
import Typography from "@oxygen-ui/react/Typography";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { DropdownChild } from "@wso2is/forms";
import { ConfirmationModal, DataTable, EmptyPlaceholder, LinkButton, ListLayout, TableColumnInterface, Link } from "@wso2is/react-components";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Dropdown, DropdownItemProps, DropdownProps, Grid, Header, Label } from "semantic-ui-react";
import { ShareApplicationStatusResponseList } from "../share-application-status-response-list";
import { ShareApplicationStatusResponse, ShareApplicationStatusResponseSummary } from "../../models/application";

interface ApplicationShareStatusWizardProps {
    componentId: string;
    resolveMultipleUsersModeSelection: () => React.ReactNode;
    resolveMultipleUsersConfiguration: () => React.ReactNode;
    renderHelpPanel: () => React.ReactNode;
    isSubmitting: boolean;
    isLoading: boolean;
    hasError: boolean;
    selectedCSVFile: File | null;
    showManualInviteTable: boolean;
    setshowManualInviteTable: React.Dispatch<React.SetStateAction<boolean>>;
    setShowResponseView: React.Dispatch<React.SetStateAction<boolean>>;
    isManualInviteButtonDisabled: () => boolean;
}

const ApplicationShareStatusWizard: React.FC<ApplicationShareStatusWizardProps> = ({
    componentId,
    isLoading = false
}) => {
    const { t } = useTranslation(); // Translation hook
    const handleUserFilter = (query: string) => {};
    const advanceSearchFilterOptions: DropdownChild[] = [
        {
            key: 0,
            text: "text",
            value: "userName"
        }
    ];

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ applicationShareStatusResponse, setApplicationShareStatusResponse ] = useState<ShareApplicationStatusResponse[]>([
        {
            resourceIdentifier: "user1@example.com",
            status: "SUCCESS",
            message: "Application shared successfully with user1@example.com"
        },
        {
            resourceIdentifier: "user2@example.com",
            status: "FAILED",
            message: "Failed to share application with user2@example.com due to permissions."
        },
        {
            resourceIdentifier: "groupA",
            status: "SUCCESS",
            message: "Application shared successfully with groupA"
        },
        {
            resourceIdentifier: "user3@test.com",
            status: "SUCCESS",
            message: "Application shared successfully with user3@test.com"
        },
        {
            resourceIdentifier: "user3@test.com",
            status: "SUCCESS",
            message: "Application shared successfully with user3@test.com"
        },
        {
            resourceIdentifier: "user3@test.com",
            status: "SUCCESS",
            message: "Application shared successfully with user3@test.com"
        },
        {
            resourceIdentifier: "user3@test.com",
            status: "SUCCESS",
            message: "Application shared successfully with user3@test.com"
        },
        {
            resourceIdentifier: "user3@test.com",
            status: "SUCCESS",
            message: "Application shared successfully with user3@test.com"
        },
        {
            resourceIdentifier: "user3@test.com",
            status: "SUCCESS",
            message: "Application shared successfully with user3@test.com"
        },
        {
            resourceIdentifier: "user3@test.com",
            status: "SUCCESS",
            message: "Application shared successfully with user3@test.com"
        }

    ]);
    const [ applicationShareStatusResponseSummary, setApplicationShareStatusResponseSummary ] = useState<ShareApplicationStatusResponseSummary>({
        successAppShare: 2, // Based on the dummy data
        failedAppShare: 1   // Based on the dummy data
    });
    const [ showMultipleInviteConfirmationModal, setShowMultipleInviteConfirmationModal ] = useState<boolean>(true);

    return (
        <>
            <ShareApplicationStatusResponseList
                isLoading={ isSubmitting }
                data-componentid={ `${componentId}-manual-response-list` }
                hasError={ hasError }
                responseList={ applicationShareStatusResponse }
                shareApplicationSummary={ applicationShareStatusResponseSummary }
                successAlert={ (
                    <Alert
                        severity="success"
                        data-componentid={ `${componentId}-success-alert` }
                    >
                        <AlertTitle data-componentid={ `${componentId}-success-alert-title` }>
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
            {/* <ConfirmationModal
                data-componentid={ `${componentId}-select-multiple-invite-confirmation-modal` }
                onClose={ (): void => {
                    // setShowMultipleInviteConfirmationModal(false);
                    // setShowBulkImportWizard(false);
                } }
                type="warning"
                open={ showMultipleInviteConfirmationModal }
                primaryAction={ t("common:close") }
                onPrimaryActionClick={ (): void => {
                    // setShowMultipleInviteConfirmationModal(false);
                    // setShowBulkImportWizard(false);
                } }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("users:confirmations.addMultipleUser.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached warning>
                    { t("users:confirmations.addMultipleUser.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    <Trans i18nKey="users:confirmations.addMultipleUser.content">
                        Invite User to Set Password should be enabled to add multiple users.
                        Please enable email invitations for user password setup from.
                    </Trans>
                </ConfirmationModal.Content>
            </ConfirmationModal>   */}
        </>
    );
};

const initialApplicationShareStatusResponseSummary: ShareApplicationStatusResponseSummary = {
    successAppShare: 0,
    failedAppShare: 0
};

export default ApplicationShareStatusWizard;


