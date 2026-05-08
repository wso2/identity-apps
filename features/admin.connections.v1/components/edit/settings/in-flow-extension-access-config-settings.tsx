/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import updateInFlowExtension from "@wso2is/admin.flow-builder-core.v1/api/update-in-flow-extension";
import {
    AccessConfigInterface,
    InFlowExtensionResponseInterface,
    InFlowExtensionUpdateRequestInterface
} from "@wso2is/admin.flow-builder-core.v1/models/in-flow-extension";
import useInFlowExtensionContextTree
    from "@wso2is/admin.flow-builder-core.v1/api/use-in-flow-extension-context-tree";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AccessConfigOutput,
    EncryptionOutput,
    FlowContextTree,
    InFlowExtensionContextTreeResponse,
    InitialAccessConfig
} from "@wso2is/common.ui.shared-access.v1/components/flow-context-tree";
import { ConfirmationModal, EmphasizedSegment, LinkButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

interface InFlowExtensionAccessConfigSettingsPropsInterface extends IdentifiableComponentInterface {
    "data-componentid"?: string;
    action: InFlowExtensionResponseInterface;
    isLoading: boolean;
    isReadOnly: boolean;
    onUpdate: () => void;
    loader: () => ReactElement;
}

export const InFlowExtensionAccessConfigSettings: FunctionComponent<
    InFlowExtensionAccessConfigSettingsPropsInterface
> = ({
    action,
    isLoading,
    isReadOnly,
    onUpdate,
    loader: Loader,
    ["data-componentid"]: componentId = "in-flow-extension-access-config-settings"
}: InFlowExtensionAccessConfigSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    // Connection-level (action-level) access config editor — not bound to a specific flow.
    // The hook is called with no flowType so the server returns the *default* tree, which
    // already has the deployment.toml whitelist applied.
    const {
        data: contextTreeData,
        error: contextTreeError,
        isLoading: isContextTreeLoading
    } = useInFlowExtensionContextTree<InFlowExtensionContextTreeResponse>();

    const [ accessConfig, setAccessConfig ] = useState<AccessConfigInterface>({
        expose: [],
        modify: []
    });
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showResetConfirmation, setShowResetConfirmation ] = useState<boolean>(false);
    const [ resetKey, setResetKey ] = useState<number>(0);

    const initialAccessConfig: InitialAccessConfig | undefined = useMemo(() => {
        if (action?.accessConfig) {
            return {
                expose: action.accessConfig.expose ?? [],
                modify: action.accessConfig.modify ?? []
            };
        }

        return undefined;
    }, [ action ]);

    // Backend does not return the certificate value (security); presence of the
    // `encryption` object indicates a certificate is configured.
    const hasCertificate: boolean = !!action?.encryption;

    const handleAccessConfigChange = (
        newAccessConfig: AccessConfigOutput,
        _newEncryption: EncryptionOutput
    ): void => {
        setAccessConfig(newAccessConfig as AccessConfigInterface);
    };

    const handleUpdate = (): void => {
        setIsSubmitting(true);

        const updateBody: InFlowExtensionUpdateRequestInterface = {
            accessConfig
        };

        updateInFlowExtension(action.id, updateBody)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.updateIDP.success.message")
                }));
                onUpdate();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("authenticationProvider:notifications.updateIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.updateIDP.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleReset = (): void => {
        setIsSubmitting(true);

        const updateBody: InFlowExtensionUpdateRequestInterface = {
            accessConfig: { expose: [], modify: [] }
        };

        updateInFlowExtension(action.id, updateBody)
            .then(() => {
                dispatch(addAlert({
                    description: "Access configuration has been reset successfully.",
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.updateIDP.success.message")
                }));
                setResetKey((prev: number) => prev + 1);
                onUpdate();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("authenticationProvider:notifications.updateIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.updateIDP.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
                setShowResetConfirmation(false);
            });
    };

    if (isLoading || !action || isContextTreeLoading) {
        return <Loader />;
    }

    if (contextTreeError || !contextTreeData) {
        // Hard error — the editor cannot render without the tree. Surface a clear message
        // rather than falling back to a stale/static schema, which could let an admin save
        // an access config that references paths the deployment has switched off.
        return (
            <Box className="in-flow-extension-access-config-tab">
                <EmphasizedSegment padded="very" data-componentid={ `${componentId}-section` }>
                    <Alert
                        severity="error"
                        sx={ { mb: 2 } }
                        data-componentid={ `${componentId}-tree-load-error` }
                    >
                        Failed to load the In-Flow Extension context tree from the server.
                        Refresh the page to retry. If the problem persists, ensure the
                        flow-management API is reachable and the deployment is up to date.
                    </Alert>
                </EmphasizedSegment>
            </Box>
        );
    }

    return (
        <Box className="in-flow-extension-access-config-tab">
            <EmphasizedSegment
                padded="very"
                data-componentid={ `${componentId}-section` }
            >
                { !hasCertificate && (
                    <Alert
                        severity="warning"
                        sx={ { mb: 2 } }
                        data-componentid={ `${componentId}-cert-warning` }
                    >
                        No encryption certificate provided. You cannot mark fields to be sent
                        encrypted. You can upload a certificate in the Settings tab.
                    </Alert>
                ) }
                { !initialAccessConfig && (
                    <Alert
                        severity="info"
                        sx={ { mb: 2 } }
                        data-componentid={ `${componentId}-empty-access-config-info` }
                    >
                        No access configuration has been set. The extension will not send any data
                        and will not allow any modifications until you configure access here.
                    </Alert>
                ) }
                <FlowContextTree
                    key={ resetKey }
                    contextTree={ contextTreeData.contextTree }
                    onChange={ handleAccessConfigChange }
                    initialAccessConfig={ initialAccessConfig }
                    hasCertificate={ hasCertificate }
                    readOnly={ isReadOnly }
                    allowReadOnlyClaimsModification={ contextTreeData.allowReadOnlyClaimsModification }
                    redirectionEnabled={ contextTreeData.redirectionEnabled }
                    data-componentid={ `${componentId}-tree` }
                />
                { !isReadOnly && (
                    <Box sx={ { display: "flex", gap: 1, mt: 3 } }>
                        <Button
                            size="medium"
                            variant="contained"
                            onClick={ handleUpdate }
                            loading={ isSubmitting }
                            data-componentid={ `${componentId}-update-button` }
                        >
                            { t("actions:buttons.update") }
                        </Button>
                        { initialAccessConfig && (
                            <LinkButton
                                onClick={ () => setShowResetConfirmation(true) }
                                data-componentid={ `${componentId}-reset-button` }
                            >
                                Reset
                            </LinkButton>
                        ) }
                    </Box>
                ) }
            </EmphasizedSegment>
            { showResetConfirmation && (
                <ConfirmationModal
                    primaryActionLoading={ isSubmitting }
                    onClose={ (): void => setShowResetConfirmation(false) }
                    type="negative"
                    open={ showResetConfirmation }
                    assertionType="checkbox"
                    assertionHint="Please confirm your understanding that this action is irreversible."
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowResetConfirmation(false) }
                    onPrimaryActionClick={ handleReset }
                    data-componentid={ `${componentId}-reset-confirmation` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${componentId}-reset-confirmation-header` }
                    >
                        Reset Access Configuration
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-reset-confirmation-message` }
                    >
                        This will clear all expose and modify annotations.
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${componentId}-reset-confirmation-content` }
                    >
                        The extension will no longer send any data and will not allow any
                        modifications until you reconfigure access here. This action cannot
                        be undone.
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </Box>
    );
};
