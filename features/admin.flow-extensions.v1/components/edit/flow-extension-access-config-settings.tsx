/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, EmphasizedSegment, LinkButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import updateFlowExtension from "../../api/update-flow-extension";
import useFlowExtensionContextTree from "../../api/use-flow-extension-context-tree";
import {
    ClaimAccessConfigInterface,
    FlowExtensionResponseInterface,
    FlowExtensionUpdateRequestInterface
} from "../../models/flow-extension";
import {
    AccessConfigOutputInterface,
    FlowContextTree,
    FlowExtensionContextTreeResponseInterface,
    InitialAccessConfigInterface
} from "../flow-context-tree";


/**
 * Props for the Flow Extension access config settings tab.
 */
interface FlowExtensionAccessConfigSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * The Flow Extension being edited.
     */
    flowExtension: FlowExtensionResponseInterface;
    /**
     * Whether the parent resource is still loading.
     */
    isLoading?: boolean;
    /**
     * Whether the form is read-only.
     */
    isReadOnly: boolean;
    /**
     * Callback to refresh the Flow Extension after an update.
     */
    mutateFlowExtension: () => void;
}

/**
 * Access configuration tab of the Flow Extension edit page. Renders the connection-level
 * expose/modify context tree and persists it via the Flow Extension update API.
 *
 * @param props - Props injected to the component.
 * @returns Flow Extension access config settings component.
 */
const FlowExtensionAccessConfigSettings: FunctionComponent<FlowExtensionAccessConfigSettingsPropsInterface> = ({
    flowExtension,
    isLoading,
    isReadOnly,
    mutateFlowExtension,
    ["data-componentid"]: componentId = "flow-extension-access-config-settings"
}: FlowExtensionAccessConfigSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    // Connection-level access config editor — not bound to a specific flow, so the hook is called
    // with no flowType and the server returns the default (whitelist-filtered) tree.
    const {
        data: contextTreeData,
        error: contextTreeError,
        isLoading: isContextTreeLoading
    } = useFlowExtensionContextTree<FlowExtensionContextTreeResponseInterface>();

    const [ accessConfig, setAccessConfig ] = useState<ClaimAccessConfigInterface>({ expose: [], modify: [] });
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showResetConfirmation, setShowResetConfirmation ] = useState<boolean>(false);
    const [ resetKey, setResetKey ] = useState<number>(0);

    const initialAccessConfig: InitialAccessConfigInterface | undefined = useMemo(
        (): InitialAccessConfigInterface | undefined => {
            if (flowExtension?.accessConfig) {
                return {
                    expose: flowExtension.accessConfig.expose ?? [],
                    modify: flowExtension.accessConfig.modify ?? []
                };
            }

            return undefined;
        },
        [ flowExtension ]
    );

    const handleAccessConfigChange = (
        newAccessConfig: AccessConfigOutputInterface
    ): void => {
        setAccessConfig(newAccessConfig as ClaimAccessConfigInterface);
    };

    const handleUpdate = (): void => {
        setIsSubmitting(true);

        const updateBody: FlowExtensionUpdateRequestInterface = { accessConfig };

        updateFlowExtension(flowExtension.id, updateBody)
            .then((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flowExtension:notifications.updateSuccess.message")
                }));
                mutateFlowExtension();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flowExtension:notifications.updateError.message")
                }));
            })
            .finally((): void => setIsSubmitting(false));
    };

    const handleReset = (): void => {
        setIsSubmitting(true);

        const updateBody: FlowExtensionUpdateRequestInterface = {
            accessConfig: { expose: [], modify: [] }
        };

        updateFlowExtension(flowExtension.id, updateBody)
            .then((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.resetSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flowExtension:notifications.resetSuccess.message")
                }));
                setResetKey((prev: number) => prev + 1);
                mutateFlowExtension();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flowExtension:notifications.updateError.message")
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
                setShowResetConfirmation(false);
            });
    };

    if (isLoading || !flowExtension || isContextTreeLoading) {
        return <ContentLoader />;
    }

    if (contextTreeError || !contextTreeData) {
        return (
            <EmphasizedSegment padded="very" data-componentid={ `${componentId}-section` }>
                <Alert severity="error" data-componentid={ `${componentId}-tree-load-error` }>
                    { t("flowExtension:edit.accessConfig.treeLoadError") }
                </Alert>
            </EmphasizedSegment>
        );
    }

    return (
        <Box>
            <EmphasizedSegment padded="very" data-componentid={ `${componentId}-section` }>
                { !initialAccessConfig && (
                    <Alert
                        severity="info"
                        sx={ { mb: 2 } }
                        data-componentid={ `${componentId}-empty-access-config-info` }
                    >
                        { t("flowExtension:edit.accessConfig.emptyInfo") }
                    </Alert>
                ) }
                <FlowContextTree
                    key={ resetKey }
                    contextTree={ contextTreeData.context }
                    onChange={ handleAccessConfigChange }
                    initialAccessConfig={ initialAccessConfig }
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
                            { t("common:update") }
                        </Button>
                        { initialAccessConfig && (
                            <LinkButton
                                onClick={ (): void => setShowResetConfirmation(true) }
                                data-componentid={ `${componentId}-reset-button` }
                            >
                                { t("flowExtension:edit.accessConfig.resetButton") }
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
                    assertionHint={ t("flowExtension:edit.confirmations.reset.assertionHint") }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowResetConfirmation(false) }
                    onPrimaryActionClick={ handleReset }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${componentId}-reset-confirmation` }
                >
                    <ConfirmationModal.Header data-componentid={ `${componentId}-reset-confirmation-header` }>
                        { t("flowExtension:edit.confirmations.reset.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-reset-confirmation-message` }
                    >
                        { t("flowExtension:edit.confirmations.reset.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${componentId}-reset-confirmation-content` }>
                        { t("flowExtension:edit.confirmations.reset.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </Box>
    );
};

export default FlowExtensionAccessConfigSettings;
