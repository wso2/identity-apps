/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Code from "@oxygen-ui/react/Code";
import IconButton from "@oxygen-ui/react/IconButton";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ActionVersionInfo } from "../hooks/use-action-versioning";
import { useSelector } from "react-redux";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";

/**
 * Props for the Action Version Warning Banner component.
 */
interface ActionVersionWarningBannerProps extends IdentifiableComponentInterface {
    /**
     * Version information from the useActionVersioning hook.
     */
    versionInfo: ActionVersionInfo;
    /**
     * Callback function when the update button is clicked.
     */
    onUpdate?: () => void;
    /**
     * Whether to show the upgrade button.
     */
    showUpgradeButton?: boolean;
    /**
     * Callback function when the banner is dismissed.
     */
    onDismiss?: () => void;
    /**
     * Whether to show the dismiss button.
     */
    showDismissButton?: boolean;
    /**
     * Whether to show detailed version information.
     */
    showDetails?: boolean;
    /**
     * Whether the update operation is in progress.
     */
    isUpdateLoading?: boolean;
}

/**
 * Component to display a warning banner for outdated actions.
 * Shows when an action version is outdated and prompts user to update.
 */
const ActionVersionWarningBanner: FunctionComponent<ActionVersionWarningBannerProps> = ({
    versionInfo,
    onUpdate,
    onDismiss,
    showDismissButton = true,
    showDetails = true,
    isUpdateLoading = false,
    ["data-componentid"]: componentId = "action-version-warning-banner"
}: ActionVersionWarningBannerProps): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const actionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.actions
    );
    const hasActionUpdatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.update);

    const [ showBanner, setShowBanner ] = useState<boolean>(true);
    const [ viewBannerDetails, setViewBannerDetails ] = useState<boolean>(false);
    const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);

    if (!versionInfo.isOutdated || !hasActionUpdatePermissions) {
        return null;
    }

    const renderBannerViewDetails = (): ReactElement => {
        return (
            <Box>
                <Box sx={ { paddingLeft: "30px" } }>
                    <List dense>
                        <ListItem
                            sx={ {
                                display: "list-item",
                                listStyleType: "disc"
                            } }
                        >
                            <ListItemText>
                                <Typography variant="body2">
                                    <Trans
                                        i18nKey="actions:versioning.outdated.warning.details.title"
                                        tOptions={ {
                                            currentVersion: versionInfo.displayVersion,
                                            latestVersion: versionInfo.latestDisplayVersion
                                        } }
                                    >
                                        You are currently using
                                        <Code filled={ false } sx={ { fontWeight: 600 } }>
                                            version { versionInfo.displayVersion }
                                        </Code>
                                        of this action which will be deprecated soon. Please update to the latest
                                        <Code filled={ false } sx={ { fontWeight: 600 } }>
                                            version { versionInfo.latestDisplayVersion }
                                        </Code>
                                        to continue receiving support and updates.
                                    </Trans>
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    </List>
                </Box>
                <Typography variant="body2">
                    <Trans i18nKey="actions:versioning.outdated.warning.details.preRequisite">
                        Before updating, please ensure that you have read the
                        <DocumentationLink
                            link={ getLink(
                                "develop.applications.editApplication.outdatedApplications." +
                                    "versions.version100.useClientIdAsSubClaimOfAppTokens." +
                                    "documentationLink"
                            ) }
                            showEmptyLinkText={ true }
                            showEmptyLink={ false }
                        >
                            documentation
                        </DocumentationLink>
                        for any breaking changes.
                    </Trans>
                </Typography>
                { onUpdate && (
                    <Button
                        sx={ { marginTop: "var(--oxygen-spacing-2)" } }
                        variant="contained"
                        onClick={ () => setShowConfirmationModal(true) }
                        data-componentid={ `${componentId}-upgrade-button` }
                    >
                        { t("actions:versioning.outdated.warning.updateButton") }
                    </Button>
                ) }
            </Box>
        );
    };

    /**
     * Renders the confirmation modal for the update action.
     *
     * @returns Confirmation modal.
     */
    const renderConfirmationModal = (): ReactElement => {
        return (
            <ConfirmationModal
                primaryActionLoading={ isUpdateLoading }
                data-componentid={ `${componentId}-update-confirmation-modal` }
                onClose={ (): void => setShowConfirmationModal(false) }
                type="negative"
                open={ showConfirmationModal }
                assertionHint={ t("actions:versioning.outdated.warning.confirmationModal.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setShowConfirmationModal(false);
                } }
                onPrimaryActionClick={ (): void => {
                    setShowConfirmationModal(false);
                    onUpdate && onUpdate();
                } }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${componentId}-update-confirmation-modal-header` }>
                    { t("actions:versioning.outdated.warning.confirmationModal.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    data-componentid={ `${componentId}-update-confirmation-modal-message` }
                    attached
                    negative
                >
                    { t("actions:versioning.outdated.warning.confirmationModal.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${componentId}-update-confirmation-modal-content` }
                >
                    { t("actions:versioning.outdated.warning.confirmationModal.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    if (!showBanner) {
        return null;
    };

    return (
        <Alert
            severity="warning"
            sx={ { marginBottom: 2 } }
            action={
                (<Box sx={ { alignItems: "center", display: "flex", marginRight: "var(--oxygen-spacing)" } }>
                    { showDetails && (
                        <Button
                            className="banner-view-hide-details"
                            data-componentid={ `${componentId}-view-details-button` }
                            onClick={ () => setViewBannerDetails(!viewBannerDetails) }
                        >
                            { !viewBannerDetails
                                ? t("actions:versioning.outdated.warning.viewDetailsButton")
                                : t("actions:versioning.outdated.warning.hideDetailsButton") }
                        </Button>
                    ) }
                    { showDismissButton && (
                        <IconButton
                            size="small"
                            onClick={ () => {
                                setShowBanner(false);
                                onDismiss && onDismiss();
                            } }
                            className="ignore-once-button"
                            data-componentid={ `${componentId}-dismiss-button` }
                        >
                            <XMarkIcon />
                        </IconButton>
                    ) }
                </Box>)
            }
            data-componentid={ componentId }
        >
            <AlertTitle className="alert-title">
                <Trans components={ { strong: <strong /> } }>{ t("actions:versioning.outdated.warning.title") }</Trans>
            </AlertTitle>
            <Trans
                i18nKey="actions:versioning.outdated.warning.message"
                tOptions={ { latestVersion: versionInfo.latestDisplayVersion } }
            >
                A new
                <Code filled={ false } sx={ { fontWeight: 600 } }>
                    version { versionInfo.latestDisplayVersion }
                </Code>
                of this action is available now. Please update to the latest version.
            </Trans>
            { viewBannerDetails && renderBannerViewDetails() }
            { showConfirmationModal && renderConfirmationModal() }
        </Alert>
    );
};

export default ActionVersionWarningBanner;
