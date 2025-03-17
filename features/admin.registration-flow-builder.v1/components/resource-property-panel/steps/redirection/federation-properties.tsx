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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AuthenticatorInterface } from "@wso2is/admin.connections.v1/models/authenticators";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useMemo } from "react";
import useGetSocialAuthenticators from "../../../../api/use-get-social-authenticators";

/**
 * Props interface of {@link FederationProperties}
 */
export type FederationPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

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
    const { data: socialAuthenticators } = useGetSocialAuthenticators();

    const selectedValue: AuthenticatorInterface = useMemo(() => {
        return socialAuthenticators?.find(
            (authenticator: AuthenticatorInterface) =>
                authenticator?.name === resource?.data?.action?.executor?.meta?.idpName
        );
    }, [ resource?.data?.action?.executor?.meta?.idpName, socialAuthenticators ]);

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                Select a connection from the following list to link it with the registration flow.
            </Typography>
            <Autocomplete
                disablePortal
                key={ resource.id }
                options={ socialAuthenticators || [] }
                getOptionLabel={ (authenticator: AuthenticatorInterface) =>
                    authenticator.displayName || authenticator.name
                }
                sx={ { width: "100%" } }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField { ...params } label="Connection" placeholder="Select a connection" />
                ) }
                value={ selectedValue }
                onChange={ (_: ChangeEvent<HTMLInputElement>, authenticator: AuthenticatorInterface) => {
                    onChange("action.executor.meta.idpName", authenticator?.name, resource);
                } }
            />
        </Stack>
    );
};

export default FederationProperties;
