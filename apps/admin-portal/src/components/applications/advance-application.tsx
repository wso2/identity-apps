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
import { updateAdvanceConfigurations } from "../../api";
import { AdvancedConfigurationsInterface } from "../../models";
import { AdvanceConfigurationsForm } from "./forms";

/**
 * Proptypes for the advance settings component.
 */
interface AdvanceSettingsPropsInterface {
    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Current advanced configurations.
     */
    advancedConfigurations: AdvancedConfigurationsInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
}

/**
 *  advance settings component.
 *
 * @param {AdvanceSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AdvanceSettings: FunctionComponent<AdvanceSettingsPropsInterface> = (
    props: AdvanceSettingsPropsInterface
): ReactElement => {

    const {
        appId,
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
        updateAdvanceConfigurations(appId, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the advanced configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch(() => {
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
