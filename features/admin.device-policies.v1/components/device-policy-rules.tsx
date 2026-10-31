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

import Typography from "@oxygen-ui/react/Typography";
import Rules from "@wso2is/admin.rules.v1/components/rules";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { RulesProvider } from "@wso2is/admin.rules.v1/providers/rules-provider";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetDevicePolicyRuleMetadata from "../api/use-get-device-policy-rule-metadata";

/**
 * Props interface of {@link DevicePolicyRules}
 */
interface DevicePolicyRulesPropsInterface extends IdentifiableComponentInterface {
    /**
     * Platform the rule applies to.
     */
    platform: string;
    /**
     * Rule of the platform.
     */
    rule: RuleWithoutIdInterface;
}

/**
 * Read-only view of the rule a device policy applies to a platform.
 *
 * @param props - Props injected to the component.
 * @returns Device policy rules component.
 */
const DevicePolicyRules: FunctionComponent<DevicePolicyRulesPropsInterface> = ({
    platform,
    rule,
    "data-componentid": componentId = "device-policy-rules"
}: DevicePolicyRulesPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: ruleMetadata,
        error: ruleMetadataFetchError,
        isLoading: isRuleMetadataLoading
    } = useGetDevicePolicyRuleMetadata(platform);

    useEffect(() => {
        if (!ruleMetadataFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("devices:assurancePolicies.view.notifications.fetchMetadata.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("devices:assurancePolicies.view.notifications.fetchMetadata.genericError.message")
        }));
    }, [ ruleMetadataFetchError ]);

    if (!(rule?.rules?.length > 0)) {
        return (
            <Typography variant="body2" data-componentid={ `${ componentId }-empty` }>
                { t("devices:assurancePolicies.view.rules.empty") }
            </Typography>
        );
    }

    if (isRuleMetadataLoading) {
        return <ContentLoader data-componentid={ `${ componentId }-loader` } />;
    }

    // The provider reads the rule only when it mounts, so it is mounted again when the rule changes.
    return (
        <RulesProvider
            key={ JSON.stringify(rule) }
            conditionExpressionsMetaData={ ruleMetadata ?? [] }
            initialData={ rule }
        >
            <Rules readonly={ true } data-componentid={ componentId } />
        </RulesProvider>
    );
};

export default DevicePolicyRules;
