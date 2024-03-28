/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Divider } from "semantic-ui-react";
import { IDVPConfigPropertiesInterface, IdentityVerificationProviderInterface, InputFieldMetadata } from "../../models";
import { updateIDVP } from "../../utils";
import { ConfigurationSettingsForm } from "../forms";

/**
 * Proptypes for the identity verification provider configuration settings component.
 */
interface ConfigurationSettingsInterface extends IdentifiableComponentInterface {
    /**
     * IDVP that is being edited.
     */
    idvp: IdentityVerificationProviderInterface;
    /**
     * Is the IDVP info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to call on updating the IDVP details.
     */
    onUpdate: () => void;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
    /**
     * Metadata for the input fields.
     */
    uiMetaData: InputFieldMetadata[];
}

/**
 * Component to edit the configuration settings of the identity verification provider.
 *
 * @param props - Props injected to the component.
 * @returns Configuration Settings component.
 */
export const ConfigurationSettings: FunctionComponent<ConfigurationSettingsInterface> = (
    props: ConfigurationSettingsInterface
): ReactElement => {

    const {
        idvp,
        isLoading,
        onUpdate,
        isReadOnly,
        uiMetaData,
        loader: Loader,
        [ "data-componentid" ]: componentId
    } = props;

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Handles form submit action.
     *
     * @param updatedDetails - Form values.
     * @returns void
     */
    const handleFormSubmit = (updatedDetails: FormData): void => {

        // Replace only the relevant existing config properties with the updated values.
        for (const key in updatedDetails) {
            if (updatedDetails[key] !== undefined) {
                const updatedProperty: IDVPConfigPropertiesInterface = idvp.configProperties.find(
                    (property: IDVPConfigPropertiesInterface) => (property.key === key)
                );

                if(updatedProperty){
                    updatedProperty.value = updatedDetails[key];
                } else {
                    // If the updated config property is not found on the IDVP object, add it as a fallback measure.
                    idvp.configProperties.push({
                        isSecret: false,
                        key: key,
                        value: updatedDetails[key]
                    });
                }
            }
        }

        updateIDVP(idvp, setIsSubmitting, onUpdate);
    };

    return (
        !isLoading
            ? (
                <>
                    <ConfigurationSettingsForm
                        identityVerificationProvider={ idvp }
                        onSubmit={ handleFormSubmit }
                        onUpdate={ onUpdate }
                        data-componentid={ `${ componentId }-form` }
                        isReadOnly={ isReadOnly }
                        isSubmitting={ isSubmitting }
                        uiMetaData={ uiMetaData }
                    />
                    <Divider hidden />
                </>
            )
            : <Loader />
    );
};

/**
 * Default proptypes for the IDVP configuration settings component.
 */
ConfigurationSettings.defaultProps = {
    "data-componentid": "idvp-edit-general-settings"
};
