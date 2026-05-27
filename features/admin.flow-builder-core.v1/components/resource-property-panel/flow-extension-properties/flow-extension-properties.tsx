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
import Link from "@oxygen-ui/react/Link";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import loadStaticResource from "@wso2is/admin.core.v1/utils/load-static-resource";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node, useReactFlow } from "@xyflow/react";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useAuthenticationFlowBuilderCore
    from "../../../hooks/use-authentication-flow-builder-core-context";
import { FlowExtensionConnectionInterface } from "../../../models/metadata";
import {
    CommonResourcePropertiesPropsInterface
} from "../resource-properties";

const DEFAULT_ICON: string = "assets/images/icons/flow-extension.svg";

/**
 * Props interface of {@link FlowExtensionProperties}
 */
type FlowExtensionPropertiesPropsInterface = CommonResourcePropertiesPropsInterface & IdentifiableComponentInterface;

/**
 * Flow Extension properties component for the flow builder.
 *
 * @param props - Props injected to the component.
 * @returns FlowExtensionProperties component.
 */
const FlowExtensionProperties: FunctionComponent<FlowExtensionPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "flow-extension-properties",
    onChange
}: FlowExtensionPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const supportURL: string = useSelector(
        (state: AppState) => state.config.deployment.helpCenterURL
    ) ?? "";

    const { metadata, isFlowMetadataLoading } = useAuthenticationFlowBuilderCore();
    const { getNodes } = useReactFlow();

    const connections: FlowExtensionConnectionInterface[] = useMemo(() => {
        const allConnections: FlowExtensionConnectionInterface[] =
            metadata?.inflowExtensionConnections ?? [];

        // Filter out connections already used by other flow extension nodes.
        const nodes: Node[] = getNodes();
        const usedActionIds: Set<string> = new Set(
            nodes
                .filter((node: Node) => node.id !== resource?.id)
                .map((node: Node) => (node.data as any)?.action?.executor?.meta?.actionId)
                .filter(Boolean)
        );

        return allConnections.filter(
            (c: FlowExtensionConnectionInterface) => !usedActionIds.has(c.actionId)
        );
    }, [ metadata?.inflowExtensionConnections, getNodes, resource?.id ]);

    const selectedConnection: FlowExtensionConnectionInterface | null = useMemo(() => {
        const actionId: string = resource?.data?.action?.executor?.meta?.actionId;

        if (!actionId || !connections?.length) {
            return null;
        }

        return connections.find(
            (connection: FlowExtensionConnectionInterface) => connection.actionId === actionId
        ) || null;
    }, [ connections, resource?.data?.action?.executor?.meta?.actionId ]);

    const handleConnectionChange = (_: React.SyntheticEvent,
        connection: FlowExtensionConnectionInterface | null) => {
        if (connection) {
            onChange("action.executor.meta.actionId", connection.actionId, resource);
        } else {
            onChange("action.executor.meta.actionId", "", resource);
        }
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
                { t("flowExtension:properties.description") }
            </Typography>
            <Autocomplete
                disablePortal
                key={ resource.id }
                options={ connections }
                getOptionLabel={ (connection: FlowExtensionConnectionInterface) => connection.name }
                loading={ isFlowMetadataLoading }
                fullWidth
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        label={ t("flowExtension:properties.connectionLabel") }
                        placeholder={ t("flowExtension:properties.connectionPlaceholder") }
                        size="small"
                    />
                ) }
                renderOption={ (props: React.HTMLAttributes<HTMLLIElement>,
                    connection: FlowExtensionConnectionInterface) => (
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
                    (option: FlowExtensionConnectionInterface,
                        value: FlowExtensionConnectionInterface) =>
                        option.actionId === value.actionId
                }
            />
            { !isFlowMetadataLoading && !connections?.length && (
                <Alert severity="warning" data-componentid={ `${componentId}-no-actions-warning` }>
                    <Typography
                        variant="body2"
                        sx={ { maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere", wordBreak: "break-word" } }
                    >
                        { t("flowExtension:properties.noConnectionsSupportWarning") }
                        {
                            supportURL
                                ? (
                                    <Link
                                        href={ supportURL }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={ { overflowWrap: "anywhere" } }
                                    >
                                        { t("flowExtension:properties.noConnectionsSupportWarningLink") }
                                    </Link>
                                )
                                : t("flowExtension:properties.noConnectionsSupportWarningLink")
                        }
                        { t("flowExtension:properties.noConnectionsSupportWarningSuffix") }
                    </Typography>
                </Alert>
            ) }
        </Stack>
    );
};

export default FlowExtensionProperties;
