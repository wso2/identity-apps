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
import useGetPublishedFlow from "../../api/use-get-published-flow";
import { OrganizationContextConstants } from "../../constants/organization-context-constants";
import {
    ClaimAccessConfigInterface,
    FlowExtensionResponseInterface,
    FlowExtensionUpdateRequestInterface
} from "../../models/flow-extension";
import { PublishedFlowInterface } from "../../models/published-flow";
import {
    FlowContextTree,
    FlowExtensionAccessConfigInterface,
    FlowExtensionContextTreeResponseInterface,
    InitialAccessConfigInterface
} from "../flow-context-tree";
import { ContextTreeNodeMetadataInterface, NodeType } from "../flow-context-tree/models";
import {
    OrganizationAttributeEntryInterface,
    extractOrganizationAttributes
} from "../flow-context-tree/organization-attributes";

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

    // Scanned for the organization attributes it collects, so they can be offered here without
    // being typed again. Failure is not fatal — the branch still renders its core fields.
    const {
        data: publishedFlow,
        isLoading: isPublishedFlowLoading
    } = useGetPublishedFlow<PublishedFlowInterface>(OrganizationContextConstants.SOURCE_FLOW_TYPE);

    const [ accessConfig, setAccessConfig ] = useState<ClaimAccessConfigInterface>({ expose: [], modify: [] });
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    // Backend does not return the certificate value (security); presence of the
    // `encryption` object indicates a certificate is configured for this extension.
    const hasCertificate: boolean = !!flowExtension?.encryption;
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

    /**
     * Options offered when adding an entry to the attributes container from the custom keys the
     * published flow collects. Core organization fields are available at their top-level paths.
     */
    const organizationAttributes: OrganizationAttributeEntryInterface[] = useMemo(
        () => extractOrganizationAttributes(publishedFlow),
        [ publishedFlow ]
    );

    /**
     * Server tree with the Organization branch appended.
     *
     * `FlowExtensionContextTreeBuilder` does not emit an Organization node yet, so it is built
     * here. Building it as metadata rather than as tree state means every downstream mechanism —
     * state mapping, access config building, round-trip on reload — treats it exactly like a
     * server-sent node. Skipped once the backend starts sending its own.
     */
    const contextTree: ContextTreeNodeMetadataInterface[] = useMemo(() => {
        if (!contextTreeData?.context) {
            return [];
        }

        const hasServerOrganizationNode: boolean = contextTreeData.context.some(
            (node: ContextTreeNodeMetadataInterface) =>
                node.path?.replace(/\/+$/, "") === OrganizationContextConstants.ORGANIZATION_PATH_PREFIX
                    .replace(/\/+$/, "")
        );

        if (hasServerOrganizationNode) {
            return contextTreeData.context;
        }

        // The container starts empty, like `/user/claims`. Entries are added through the modal;
        // any already saved on the access config are restored by the metadata -> state mapping.
        const organizationNode: ContextTreeNodeMetadataInterface = {
            allowedOperations: [ "EXPOSE" ],
            children: [ OrganizationContextConstants.ORGANIZATION_ATTRIBUTES_NODE ],
            dataType: "",
            key: "organization",
            nodeType: NodeType.OBJECT,
            path: OrganizationContextConstants.ORGANIZATION_PATH_PREFIX,
            readOnly: true,
            title: "Organization"
        };

        return [ ...contextTreeData.context, organizationNode ];
    }, [ contextTreeData ]);

    const handleAccessConfigChange = (
        newAccessConfig: FlowExtensionAccessConfigInterface
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

    // The tree snapshots its metadata in a lazy state initialiser, so the flow scan has to have
    // settled before it mounts. SWR clears `isLoading` on failure too, so a missing or rejected
    // flow does not hold the page.
    if (isLoading || !flowExtension || isContextTreeLoading || isPublishedFlowLoading) {
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
                { !hasCertificate && (
                    <Alert
                        severity="warning"
                        sx={ { mb: 2 } }
                        data-componentid={ `${componentId}-no-certificate-info` }
                    >
                        { t("flowExtension:edit.accessConfig.noCertificateInfo") }
                    </Alert>
                ) }
                <FlowContextTree
                    key={ resetKey }
                    contextTree={ contextTree }
                    onChange={ handleAccessConfigChange }
                    initialAccessConfig={ initialAccessConfig }
                    readOnly={ isReadOnly }
                    hasCertificate={ hasCertificate }
                    allowReadOnlyClaimsModification={ contextTreeData.allowReadOnlyClaimsModification }
                    organizationAttributeOptions={ organizationAttributes }
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
