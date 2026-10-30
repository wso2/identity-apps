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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Button from "@oxygen-ui/react/Button";
import Rules from "@wso2is/admin.rules.v1/components/rules";
import useRulesContext from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ConditionExpressionMetaInterface, ConditionExpressionsMetaDataInterface }
    from "@wso2is/admin.rules.v1/models/meta";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { RulesProvider } from "@wso2is/admin.rules.v1/providers/rules-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader } from "@wso2is/react-components";
import isEqual from "lodash-es/isEqual";
import React, { FunctionComponent, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useGetDevicePolicyRuleMetadata from "../api/use-get-device-policy-rule-metadata";
import { DEVICE_PLATFORM_FIELD } from "../constants/device-policy-constants";

interface DevicePolicyRuleEditorPropsInterface extends IdentifiableComponentInterface {
    /**
     * Platform the rule applies to.
     */
    platform: string;
    /**
     * Rule of the platform. When empty, the editor starts with a new rule.
     */
    rule: RuleWithoutIdInterface;
    /**
     * Callback to run when the rule changes. Receives null when the rule is cleared.
     */
    onChange: (rule: RuleWithoutIdInterface) => void;
}

/**
 * Reports changes to the rule being edited, and offers to add a rule again once it is cleared.
 */
const RuleEditor: FunctionComponent<DevicePolicyRuleEditorPropsInterface> = ({
    platform,
    rule,
    onChange,
    "data-componentid": componentId
}: DevicePolicyRuleEditorPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const { addNewRule, ruleInstance } = useRulesContext();

    useEffect(() => {
        if (!isEqual(ruleInstance ?? null, rule ?? null)) {
            onChange((ruleInstance as RuleWithoutIdInterface) ?? null);
        }
    }, [ ruleInstance ]);

    if (!ruleInstance) {
        return (
            <Alert
                icon={ false }
                sx={ { backgroundColor: "var(--oxygen-palette-grey-100)" } }
                data-componentid={ `${ componentId }-empty` }
            >
                <AlertTitle>
                    { t("devices:assurancePolicies.wizard.rules.empty.title") }
                </AlertTitle>
                { t("devices:assurancePolicies.wizard.rules.empty.description", {
                    platform: t(`devices:assurancePolicies.platforms.${ platform }`, { defaultValue: platform })
                }) }
                <div>
                    <Button
                        onClick={ (): void => addNewRule() }
                        variant="outlined"
                        size="small"
                        data-componentid={ `${ componentId }-add-rule-button` }
                    >
                        { t("devices:assurancePolicies.wizard.rules.empty.addRule") }
                    </Button>
                </div>
            </Alert>
        );
    }

    return <Rules disableLastRuleDelete={ false } data-componentid={ componentId } />;
};

/**
 * Editor for the rule of a device policy on one platform.
 *
 * @param props - Props injected to the component.
 * @returns Device policy rule editor.
 */
const DevicePolicyRuleEditor: FunctionComponent<DevicePolicyRuleEditorPropsInterface> = ({
    platform,
    rule,
    onChange,
    "data-componentid": componentId = "device-policy-rule-editor"
}: DevicePolicyRuleEditorPropsInterface): ReactElement => {

    const { data: ruleMetadata, isLoading: isRuleMetadataLoading } = useGetDevicePolicyRuleMetadata(platform);

    // The platform is already chosen by the tab the rule is edited in.
    const conditionMetadata: ConditionExpressionsMetaDataInterface = useMemo(
        () => (ruleMetadata ?? []).filter(
            (metadata: ConditionExpressionMetaInterface) => metadata.field?.name !== DEVICE_PLATFORM_FIELD
        ),
        [ ruleMetadata ]
    );

    if (isRuleMetadataLoading) {
        return <ContentLoader data-componentid={ `${ componentId }-loader` } />;
    }

    return (
        <RulesProvider conditionExpressionsMetaData={ conditionMetadata } initialData={ rule }>
            <RuleEditor
                platform={ platform }
                rule={ rule }
                onChange={ onChange }
                data-componentid={ componentId }
            />
        </RulesProvider>
    );
};

export default DevicePolicyRuleEditor;
