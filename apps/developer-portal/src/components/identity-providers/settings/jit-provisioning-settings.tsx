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
import {
    getUserStoreList,
    updateJITProvisioningConfigs
} from "../../../api";
import {
    JITProvisioningResponseInterface,
    SimpleUserStoreListItemInterface
} from "../../../models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { ContentLoader } from "@wso2is/react-components";
import { JITProvisioningConfigurationsForm } from "../forms";
import { useDispatch } from "react-redux";

/**
 * Proptypes for the identity provider general details component.
 */
interface JITProvisioningSettingsInterface {
    /**
     * Currently editing idp id.
     */
    idpId?: string;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Just-in time provisioning configurations.
     */
    jitProvisioningConfigurations: JITProvisioningResponseInterface;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 * Component to edit just-in time provisioning details of the identity provider.
 *
 * @param {JITProvisioningSettings} props - Props injected to the component.
 * @return {ReactElement}
 */
export const JITProvisioningSettings: FunctionComponent<JITProvisioningSettingsInterface> = (
    props: JITProvisioningSettingsInterface): ReactElement => {

    const {
        idpId,
        isLoading,
        jitProvisioningConfigurations,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [userStore, setUserStore] = useState<SimpleUserStoreListItemInterface[]>([]);


    /**
     * Handles the advanced config form submit action.
     *
     * @param values - Form values.
     */
    const handleJITProvisioningConfigFormSubmit = (values: any): void => {
        updateJITProvisioningConfigs(idpId, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated JIT provisioning configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));
                onUpdate(idpId);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: "An error occurred while the updating JIT provisioning configurations.",
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
        !isLoading
            ? (
                <JITProvisioningConfigurationsForm
                    initialValues={ jitProvisioningConfigurations }
                    onSubmit={ handleJITProvisioningConfigFormSubmit }
                    useStoreList={ userStore }
                />
            )
            : <ContentLoader/>
    );
};
