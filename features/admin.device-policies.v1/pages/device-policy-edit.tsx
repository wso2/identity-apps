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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    PrimaryButton,
    ResourceTab,
    ResourceTabPaneInterface,
    TabPageLayout
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import useGetDevicePolicy from "../api/use-get-device-policy";
import DevicePolicyRules from "../components/device-policy-rules";
import DevicePolicyWizard from "../components/device-policy-wizard";
import { DEVICE_POLICY_TYPE } from "../constants/device-policy-constants";
import { DevicePolicyInterface, DevicePolicyResourceInterface } from "../models/device-policy";
import { toRuleData } from "../utils/device-policy-rule-utils";

type DevicePolicyEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Page that shows a device assurance policy.
 *
 * @param props - Props injected to the component.
 * @returns Device policy page.
 */
const DevicePolicyEditPage: FunctionComponent<DevicePolicyEditPagePropsInterface> = ({
    match,
    "data-componentid": componentId = "device-policy-edit-page"
}: DevicePolicyEditPagePropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const devicePoliciesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.devicePolicies
    );
    const hasUpdatePermission: boolean = useRequiredScopes(devicePoliciesFeatureConfig?.scopes?.update);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    const policyId: string = match.params["id"]?.split("#")[0];

    const {
        data: policy,
        error: policyFetchError,
        isLoading: isPolicyLoading,
        mutate: mutatePolicy
    } = useGetDevicePolicy(policyId);

    // The policies API also holds policies of other types; only device policies are shown here.
    const devicePolicy: DevicePolicyInterface = policy?.type === DEVICE_POLICY_TYPE ? policy : undefined;
    const isOtherPolicyType: boolean = !!policy && !devicePolicy;

    useEffect(() => {
        if (!policyFetchError && !isOtherPolicyType) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:assurancePolicies.view.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:assurancePolicies.view.notifications.fetch.genericError.message")
        }));
    }, [ policyFetchError, isOtherPolicyType ]);

    const panes: ResourceTabPaneInterface[] = useMemo(() => {
        return (devicePolicy?.resources ?? []).map((resource: DevicePolicyResourceInterface) => ({
            componentId: `${ componentId }-${ resource.target }-tab`,
            menuItem: t(`devices:assurancePolicies.platforms.${ resource.target }`, {
                defaultValue: resource.target
            }),
            render: (): ReactElement => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <DevicePolicyRules
                        key={ resource.target }
                        platform={ resource.target }
                        rule={ toRuleData(resource.rule) }
                        data-componentid={ `${ componentId }-${ resource.target }-rules` }
                    />
                </ResourceTab.Pane>
            )
        }));
    }, [ devicePolicy ]);

    return (
        <TabPageLayout
            isLoading={ isPolicyLoading }
            title={ devicePolicy?.name }
            pageTitle={ t("devices:assurancePolicies.title") }
            action={ hasUpdatePermission && devicePolicy && (
                <PrimaryButton
                    onClick={ (): void => setShowWizard(true) }
                    data-componentid={ `${ componentId }-edit-button` }
                >
                    { t("devices:assurancePolicies.buttons.edit") }
                </PrimaryButton>
            ) }
            image={ (
                <AnimatedAvatar
                    name={ devicePolicy?.name ?? "" }
                    size="tiny"
                    floated="left"
                    data-componentid={ `${ componentId }-avatar` }
                />
            ) }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: (): void => history.push(AppConstants.getPaths().get("DEVICE_ASSURANCE_POLICIES")),
                text: t("devices:assurancePolicies.view.backButton")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            data-componentid={ `${ componentId }-layout` }
        >
            <ResourceTab panes={ panes } data-componentid={ `${ componentId }-tabs` } />
            { showWizard && (
                <DevicePolicyWizard
                    policy={ devicePolicy }
                    onClose={ (): void => setShowWizard(false) }
                    onSuccess={ (): void => {
                        setShowWizard(false);
                        mutatePolicy();
                    } }
                    data-componentid={ `${ componentId }-wizard` }
                />
            ) }
        </TabPageLayout>
    );
};

export default DevicePolicyEditPage;
