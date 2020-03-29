/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useDispatch } from "react-redux";
import { Divider } from "semantic-ui-react";
import { updateIdentityProviderDetails } from "../../api";
import { IdentityProviderAdvanceInterface } from "../../models";
import { AdvanceConfigurationsForm } from "./forms/advanced-configurations-form";

/**
 * Proptypes for the advance settings component.
 */
interface AdvanceSettingsPropsInterface {
    /**
     * Currently editing idp id.
     */
    idpId: string;
    /**
     * Current advanced configurations.
     */
    advancedConfigurations: IdentityProviderAdvanceInterface;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 *  Advance settings component.
 *
 * @param {AdvanceSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AdvanceSettings: FunctionComponent<AdvanceSettingsPropsInterface> = (
    props: AdvanceSettingsPropsInterface
): ReactElement => {

    const {
        idpId,
        advancedConfigurations,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    /**
     * Handles the advanced config form submit action.
     *
     * @param values - Form values.
     */
    const handleAdvancedConfigFormSubmit = (values: any): void => {
        updateIdentityProviderDetails({ id: idpId, ...values } )
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully updated the advanced configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(idpId);
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while the advanced configurations.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    return (
        <>
            <div className="advanced-configuration-section">
                <Heading as="h4">Advanced Configurations</Heading>
                <Divider hidden/>
                <AdvanceConfigurationsForm
                    config={ advancedConfigurations }
                    onSubmit={ handleAdvancedConfigFormSubmit }
                />
            </div>
        </>
    );
};
