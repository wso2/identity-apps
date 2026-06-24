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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { ConnectionInterface } from "../../../models/connection";
import { AttributeSettings } from "./attribute-settings";

interface DigitalCredentialsClaimMappingSettingsPropsInterface extends TestableComponentInterface {
    identityProvider: ConnectionInterface;
    isLoading?: boolean;
    isReadOnly: boolean;
    loader: () => ReactElement;
    onUpdate: (id: string) => void;
}

/**
 * Claim mapping settings for Digital Credentials connection.
 *
 * @param props - Component props.
 * @returns React element.
 */
export const DigitalCredentialsClaimMappingSettings: FunctionComponent<
    DigitalCredentialsClaimMappingSettingsPropsInterface
> = (
    props: DigitalCredentialsClaimMappingSettingsPropsInterface
): ReactElement => {

    const {
        identityProvider,
        isLoading,
        isReadOnly,
        loader,
        onUpdate,
        [ "data-testid" ]: testId = "digital-credentials-claim-mapping-settings"
    } = props;

    return (
        <AttributeSettings
            idpId={ identityProvider?.id }
            initialClaims={ identityProvider?.claims }
            initialRoleMappings={ identityProvider?.roles?.mappings }
            isLoading={ isLoading }
            onUpdate={ onUpdate }
            hideIdentityClaimAttributes={ false }
            isRoleMappingsEnabled={ true }
            data-testid={ `${ testId }-attribute-settings` }
            provisioningAttributesEnabled={ true }
            isReadOnly={ isReadOnly }
            loader={ loader }
            isOIDC={ false }
            isSaml={ false }
        />
    );
};

export default DigitalCredentialsClaimMappingSettings;
