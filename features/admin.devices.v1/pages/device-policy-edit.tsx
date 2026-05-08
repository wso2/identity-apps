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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Grid, Label } from "semantic-ui-react";
import useGetDevicePolicyById from "../hooks/use-get-device-policy-by-id";

type DevicePolicyEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

const DevicePolicyEditPage: FunctionComponent<DevicePolicyEditPagePropsInterface> = ({
    match,
    "data-componentid": componentId = "device-policy-edit-page"
}: DevicePolicyEditPagePropsInterface): ReactElement => {
    const policyId: string = match.params["id"]?.split("#")[0];

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        data: policy,
        isLoading: isPolicyLoading,
        error: policyFetchError
    } = useGetDevicePolicyById(policyId, !isEmpty(policyId));

    useEffect((): void => {
        if (!policyFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:assurancePolicies.edit.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:assurancePolicies.edit.notifications.fetch.genericError.message")
        }));
    }, [ policyFetchError ]);

    return (
        <PageLayout
            isLoading={ isPolicyLoading }
            title={ policy?.name ?? policyId }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: (): void => history.push(AppConstants.getPaths().get("DEVICE_ASSURANCE_POLICIES")),
                text: t("devices:assurancePolicies.edit.backButton")
            } }
            data-componentid={ `${ componentId }-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 8 }>
                        <div className="main-content-inner">
                            <div className="form-container with-max-width">
                                <div className="field">
                                    <label>
                                        { t("devices:assurancePolicies.edit.fields.name.label") }
                                    </label>
                                    <p data-componentid={ `${ componentId }-name` }>
                                        { policy?.name }
                                    </p>
                                </div>
                                { policy?.ruleId && (
                                    <div className="field">
                                        <label>
                                            { t("devices:assurancePolicies.edit.fields.ruleId.label") }
                                        </label>
                                        <Label
                                            data-componentid={ `${ componentId }-rule-id` }
                                        >
                                            { policy.ruleId }
                                        </Label>
                                    </div>
                                ) }
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </PageLayout>
    );
};

export default DevicePolicyEditPage;
