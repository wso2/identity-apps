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
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Link from "@oxygen-ui/react/Link";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import useGetInFlowExtensionById from "../../api/use-get-in-flow-extension-by-id";
import { InFlowExtensionResponseInterface } from "../../models/in-flow-extension";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import loadStaticResource from "@wso2is/admin.core.v1/utils/load-static-resource";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node, useReactFlow } from "@xyflow/react";
import React, { ChangeEvent, FunctionComponent, ReactElement, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useAuthenticationFlowBuilderCore
    from "../../hooks/use-authentication-flow-builder-core-context";
import { InFlowExtensionConnectionInterface } from "../../models/metadata";
import {
    CommonResourcePropertiesPropsInterface
} from "../resource-property-panel/resource-properties";
import AccessConfigOverrideDialog from "./access-config-override-dialog";

const DEFAULT_ICON: string = "assets/images/icons/in-flow-extension.svg";

/**
 * Props interface of {@link InFlowExtensionProperties}
 */
interface InFlowExtensionPropertiesPropsInterface extends CommonResourcePropertiesPropsInterface,
    IdentifiableComponentInterface {
    flowType: string;
}

interface GetHelpConfigInterface {
    /**
     * URL of the help center.
     */
    helpCenterURL?: string;
}

interface ExtensionConfigInterface {
    /**
     * Help dropdown configurations.
     */
    getHelp?: GetHelpConfigInterface;
}

/**
 * In-Flow Extension properties component for the flow builder.
 * Shows a dropdown to select an in-flow extension action, connection details, and access config button.
 *
 * @param props - Props injected to the component.
 * @returns InFlowExtensionProperties component.
 */
const InFlowExtensionProperties: FunctionComponent<InFlowExtensionPropertiesPropsInterface> = ({
    resource,
    flowType,
    ["data-componentid"]: componentId = "in-flow-extension-properties",
    onChange
}: InFlowExtensionPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const [ isAccessConfigDialogOpen, setIsAccessConfigDialogOpen ] = useState<boolean>(false);
    const [ isNavConfirmOpen, setIsNavConfirmOpen ] = useState<boolean>(false);

    const actionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.actions);
    const showNoInFlowConnectionSupportMessage: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.features?.flows?.showNoInFlowConnectionSupportMessage ?? false);
    const isFlowLevelOverridesEnabled: boolean = isFeatureEnabled(
        actionsFeatureConfig, "actions.types.list.inFlowExtension.flowLevelOverrides");
    const supportURL: string = (
        window["AppUtils"].getConfig().extensions as ExtensionConfigInterface
    )?.getHelp?.helpCenterURL ?? "";

    const { metadata, isFlowMetadataLoading } = useAuthenticationFlowBuilderCore();
    const { getNodes } = useReactFlow();

    const connections: InFlowExtensionConnectionInterface[] = useMemo(() => {
        const allConnections: InFlowExtensionConnectionInterface[] =
            metadata?.inflowExtensionConnections ?? [];

        // Filter out connections already used by other in-flow extension nodes.
        const nodes: Node[] = getNodes();
        const usedActionIds: Set<string> = new Set(
            nodes
                .filter((node: Node) => node.id !== resource?.id)
                .map((node: Node) => (node.data as any)?.action?.executor?.meta?.actionId)
                .filter(Boolean)
        );

        return allConnections.filter(
            (c: InFlowExtensionConnectionInterface) => !usedActionIds.has(c.actionId)
        );
    }, [ metadata?.inflowExtensionConnections, getNodes, resource?.id ]);

    const selectedConnection: InFlowExtensionConnectionInterface | null = useMemo(() => {
        const actionId: string = resource?.data?.action?.executor?.meta?.actionId;

        if (!actionId || !connections?.length) {
            return null;
        }

        return connections.find(
            (connection: InFlowExtensionConnectionInterface) => connection.actionId === actionId
        ) || null;
    }, [ connections, resource?.data?.action?.executor?.meta?.actionId ]);

    const {
        data: actionResponse,
        isLoading: isActionLoading,
        mutate: mutateAction
    } = useGetInFlowExtensionById<InFlowExtensionResponseInterface>(
        selectedConnection?.actionId
    );

    const handleConnectionChange = useCallback((_: ChangeEvent<HTMLInputElement>,
        connection: InFlowExtensionConnectionInterface | null) => {
        if (connection) {
            onChange("action.executor.meta.actionId", connection.actionId, resource);
        } else {
            onChange("action.executor.meta.actionId", "", resource);
        }
    }, [ onChange, resource ]);

    const handleEditAccessConfig = (): void => {
        if (isFlowLevelOverridesEnabled) {
            setIsAccessConfigDialogOpen(true);
        } else {
            setIsNavConfirmOpen(true);
        }
    };

    const handleNavigateToConnectionAccessConfig = (): void => {
        setIsNavConfirmOpen(false);
        const editPath: string = AppConstants.getPaths().get("IN_FLOW_EXTENSION_EDIT")
            .replace(":id", selectedConnection.actionId);

        history.push(`${editPath}#tab=access-configuration`);
    };

    const handleCreateConnection = (): void => {
        history.push(AppConstants.getPaths().get("CONNECTION_TEMPLATES"));
    };

    const renderConnectionIcon = (iconUrl?: string, size: number = 24): ReactElement => (
        <img
            src={ iconUrl || loadStaticResource(DEFAULT_ICON) }
            alt="connection"
            width={ size }
            height={ size }
            style={ { objectFit: "contain" } }
        />
    );

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                { t("inFlowExtension:properties.description") }
            </Typography>
            <Autocomplete
                disablePortal
                key={ resource.id }
                options={ connections }
                getOptionLabel={ (connection: InFlowExtensionConnectionInterface) => connection.name }
                loading={ isFlowMetadataLoading }
                fullWidth
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        label={ t("inFlowExtension:properties.connectionLabel") }
                        placeholder={ t("inFlowExtension:properties.connectionPlaceholder") }
                        size="small"
                    />
                ) }
                renderOption={ (props: React.HTMLAttributes<HTMLLIElement>,
                    connection: InFlowExtensionConnectionInterface) => (
                    <li { ...props } key={ connection.actionId }>
                        <Stack direction="row" spacing={ 1 } alignItems="center">
                            { renderConnectionIcon(connection.iconUrl, 20) }
                            <Typography variant="body2">{ connection.name }</Typography>
                        </Stack>
                    </li>
                ) }
                value={ selectedConnection }
                onChange={ handleConnectionChange }
                isOptionEqualToValue={
                    (option: InFlowExtensionConnectionInterface,
                        value: InFlowExtensionConnectionInterface) =>
                        option.actionId === value.actionId
                }
            />
            { selectedConnection && (
                <Box>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={ handleEditAccessConfig }
                        data-componentid={ `${componentId}-edit-access-config-btn` }
                    >
                        { t("inFlowExtension:properties.editAccessConfig") }
                    </Button>
                </Box>
            ) }
            { showNoInFlowConnectionSupportMessage && !isFlowMetadataLoading && !connections?.length && (
                <Alert severity="warning" data-componentid={ `${componentId}-no-actions-warning` }>
                    <Typography
                        variant="body2"
                        sx={ { maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere", wordBreak: "break-word" } }
                    >
                        { t("inFlowExtension:properties.noConnectionsSupportWarning") }
                        {
                            supportURL
                                ? (
                                    <Link
                                        href={ supportURL }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={ { overflowWrap: "anywhere" } }
                                    >
                                        { t("inFlowExtension:properties.noConnectionsSupportWarningLink") }
                                    </Link>
                                )
                                : t("inFlowExtension:properties.noConnectionsSupportWarningLink")
                        }
                        { t("inFlowExtension:properties.noConnectionsSupportWarningSuffix") }
                    </Typography>
                </Alert>
            ) }
            { !showNoInFlowConnectionSupportMessage && !isFlowMetadataLoading && !connections?.length && (
                <Alert severity="warning" data-componentid={ `${componentId}-no-actions-warning` }>
                    <Typography
                        variant="body2"
                        sx={ { maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere", wordBreak: "break-word" } }
                    >
                        { t("inFlowExtension:properties.noConnectionsWarning") }
                        <Link component="button" onClick={ handleCreateConnection }>
                            { t("inFlowExtension:properties.noConnectionsWarningLink") }
                        </Link>
                        { t("inFlowExtension:properties.noConnectionsWarningSuffix") }
                    </Typography>
                </Alert>
            ) }
            { isFlowLevelOverridesEnabled && isAccessConfigDialogOpen && selectedConnection && (
                <AccessConfigOverrideDialog
                    actionId={ selectedConnection.actionId }
                    actionResponse={ actionResponse }
                    isActionLoading={ isActionLoading }
                    mutateAction={ mutateAction }
                    flowType={ flowType }
                    open={ isAccessConfigDialogOpen }
                    onClose={ () => setIsAccessConfigDialogOpen(false) }
                />
            ) }
            <Dialog
                open={ isNavConfirmOpen }
                onClose={ () => setIsNavConfirmOpen(false) }
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>{ t("inFlowExtension:properties.navConfirmDialog.title") }</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        { t("inFlowExtension:properties.navConfirmDialog.description") }
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={ () => setIsNavConfirmOpen(false) }
                        color="secondary"
                    >
                        { t("inFlowExtension:properties.navConfirmDialog.actions.cancel") }
                    </Button>
                    <Button
                        onClick={ handleNavigateToConnectionAccessConfig }
                        variant="contained"
                        color="primary"
                    >
                        { t("inFlowExtension:properties.navConfirmDialog.actions.continue") }
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default InFlowExtensionProperties;
