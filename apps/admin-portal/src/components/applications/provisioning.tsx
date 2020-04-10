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

import { AlertLevels, CRUDPermissionsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Divider } from "semantic-ui-react";
import { getUserStoreList, updateApplicationConfigurations } from "../../api";
import {
    AdvancedConfigurationsInterface,
    ProvisioningConfigurationInterface,
    SimpleUserStoreListItemInterface
} from "../../models";
import { AdvanceConfigurationsForm, ProvisioningConfigurationsForm } from "./forms";

/**
 * Proptypes for the provision settings component.
 */
interface ProvisioningSettingsPropsInterface {
    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Current advanced configurations.
     */
    provisioningConfigurations: ProvisioningConfigurationInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * CRUD permissions,
     */
    permissions?: CRUDPermissionsInterface;
}

/**
 *  Provisioning component.
 *
 * @param {ProvisioningSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const ProvisioningSettings: FunctionComponent<ProvisioningSettingsPropsInterface> = (
    props: ProvisioningSettingsPropsInterface
): ReactElement => {

    const {
        appId,
        provisioningConfigurations,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [userStore, setUserStore] = useState<SimpleUserStoreListItemInterface[]>([]);

    /**
     * Handles the provisioning config form submit action.
     *
     * @param values - Form values.
     */
    const handleProvisioningConfigFormSubmit = (values: any): void => {
        updateApplicationConfigurations(appId, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the provisioning configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: "An error occurred while the provisioning configurations.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };


    useEffect(() => {
        const userstore: SimpleUserStoreListItemInterface[] = [];
        userstore.push({
            id: "PRIMARY",
            name: "PRIMARY"
        });
        getUserStoreList().then((response) => {
            userstore.push(...response.data);
            setUserStore(userstore);
        }).catch(() => {
            setUserStore(userstore);
        });
    }, []);

    return (
        <>
            {
                userStore &&
                <ProvisioningConfigurationsForm
                    config={ provisioningConfigurations }
                    onSubmit={ handleProvisioningConfigFormSubmit }
                    useStoreList={ userStore }
                />
            }
        </>
    );
};
