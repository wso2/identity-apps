/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { SimpleUserStoreListItemInterface } from "@wso2is/admin.applications.v1/models";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { getUserStoreList } from "@wso2is/admin.userstores.v1/api";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateJITProvisioningConfigs } from "../../../api/connections";
import { JITProvisioningResponseInterface } from "../../../models/connection";
import { JITProvisioningConfigurationsForm } from "../forms";

/**
 * Proptypes for the identity provider general details component.
 */
interface JITProvisioningSettingsInterface extends TestableComponentInterface {
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
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 * Component to edit just-in time provisioning details of the identity provider.
 *
 * @param JITProvisioningSettings - Props injected to the component.
 * @returns JITProvisioningSettings component.
 */
export const JITProvisioningSettings: FunctionComponent<JITProvisioningSettingsInterface> = (
    props: JITProvisioningSettingsInterface): ReactElement => {

    const {
        idpId,
        isLoading,
        jitProvisioningConfigurations,
        onUpdate,
        isReadOnly,
        loader: Loader,
        [ "data-testid" ]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { isSuperOrganization, isFirstLevelOrganization } = useGetCurrentOrganizationType();
    const { t } = useTranslation();

    const [ userStore, setUserStore ] = useState<SimpleUserStoreListItemInterface[]>([]);

    /**
     * Handles the advanced config form submit action.
     *
     * @param values - Form values.
     */
    const handleJITProvisioningConfigFormSubmit = (values: any): void => {
        updateJITProvisioningConfigs(idpId, values)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateJITProvisioning." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:" +
                        "notifications.updateJITProvisioning.success.message")
                }));
                onUpdate(idpId);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications." +
                        "updateJITProvisioning.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications." +
                        "updateJITProvisioning.genericError.message")
                }));
            });
    };

    useEffect(() => {
        const userstore: SimpleUserStoreListItemInterface[] = [];

        userstore.push({
            id: "PRIMARY",
            name: "PRIMARY"
        });

        if (isSuperOrganization() || isFirstLevelOrganization()) {
            getUserStoreList().then((response: AxiosResponse) => {
                userstore.push(...response.data);
                setUserStore(userstore);
            }).catch(() => {
                setUserStore(userstore);
            });
        } else {
            setUserStore(userstore);
        }
    }, []);

    return (
        !isLoading
            ? (
                <EmphasizedSegment padded="very">
                    <JITProvisioningConfigurationsForm
                        idpId={ idpId }
                        initialValues={ jitProvisioningConfigurations }
                        onSubmit={ handleJITProvisioningConfigFormSubmit }
                        useStoreList={ userStore }
                        data-testid={ testId }
                        isReadOnly={ isReadOnly }
                    />
                </EmphasizedSegment>
            )
            : <Loader />
    );
};

/**
 * Default proptypes for the IDP JIT provisioning settings component.
 */
JITProvisioningSettings.defaultProps = {
    "data-testid": "idp-edit-jit-provisioning-settings"
};
