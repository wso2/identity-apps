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
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { ExecutorConnectionInterface } from "@wso2is/admin.flow-builder-core.v1/models/metadata";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useMemo } from "react";

/**
 * Props interface of {@link FederationProperties}
 */
export type FederationPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

const IDP_NAME_PLACEHOLDER: string = "{{IDP_NAME}}";

/**
 * Federation widget properties component.
 *
 * @param props - Props injected to the component.
 * @returns FederationProperties component.
 */
const FederationProperties: FunctionComponent<FederationPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "federation-properties-component",
    onChange
}: FederationPropertiesPropsInterface): ReactElement => {
    const { metadata } = useAuthenticationFlowBuilderCore();

    /**
     * Find available connections for the current executor.
     */
    const availableConnections: string[] = useMemo(() => {
        const executorConnection: ExecutorConnectionInterface = metadata.executorConnections.find(
            (executor: ExecutorConnectionInterface) => {
                return executor.executorName === resource?.data?.action?.executor?.name;
            });

        return executorConnection?.connections || [];
    }, [ metadata, resource?.data?.action?.executor?.name ]);

    /**
     * Resolve current selected value for the connection.
     */
    const selectedValue: string = useMemo(() => {
        if (!resource?.data?.action?.executor?.meta?.idpName) {
            return "";
        }

        return availableConnections.find(
            (connection: string) =>
                connection === resource?.data?.action?.executor?.meta?.idpName
        ) || "";
    }, [ availableConnections, resource?.data?.action?.executor?.meta?.idpName ]);

    /**
     * If the IDP name is a placeholder, set the first available connection as the default.
     */
    useEffect(() => {
        if (resource?.data?.action?.executor?.meta?.idpName !== IDP_NAME_PLACEHOLDER
            || availableConnections.length < 0) {
            return;
        }

        const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
            onChange("action.executor.meta.idpName", availableConnections[0], resource);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [ resource.data?.action?.executor?.meta?.idpName, availableConnections ]);

    const handleCreateConnection = (): void => {
        history.push(AppConstants.getPaths().get("CONNECTION_TEMPLATES"));
    };

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                Select a connection from the following list to link it with the password recovery flow.
            </Typography>
            <Autocomplete
                disablePortal
                key={ resource.id }
                options={ availableConnections || [] }
                getOptionLabel={ (connection: string) => connection }
                sx={ { width: "100%" } }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField { ...params } label="Connection" placeholder="Select a connection" />
                ) }
                placeholder="Select a connection"
                value={ selectedValue }
                onChange={ (_: ChangeEvent<HTMLInputElement>, connection: string) => {
                    onChange("action.executor.meta.idpName", connection, resource);
                } }
            />
            { !availableConnections?.length && (
                <Alert severity="warning" data-componentid={ `${componentId}-no-connections-warning` }>
                    No connections available. Please create a
                    <a style={ { cursor: "pointer" } } onClick={ handleCreateConnection }> connection </a>
                    to link with the password recovery flow.
                </Alert>
            ) }
        </Stack>
    );
};

export default FederationProperties;
