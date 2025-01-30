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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import Rules from "@wso2is/admin.rules.v1/components/rules";
import useRulesContext from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading } from "@wso2is/react-components";
import isEqual from "lodash-es/isEqual";
import React, { Dispatch, FunctionComponent, ReactElement, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";

interface RuleConfigFormInterface extends IdentifiableComponentInterface {
    readonly: boolean;
    rule: RuleWithoutIdInterface;
    isHasRule : boolean;
    setIsHasRule: (value: boolean) => void;
    setRule: Dispatch<React.SetStateAction<RuleWithoutIdInterface>>;
}

const RuleConfigForm: FunctionComponent<RuleConfigFormInterface> = ({
    readonly,
    rule,
    isHasRule,
    setIsHasRule,
    setRule,
    ["data-componentid"]: _componentId = "action-rule-config-form"
}: RuleConfigFormInterface): ReactElement => {

    const { addNewRule, ruleInstance } = useRulesContext();
    const { t } = useTranslation();

    useEffect(() => {
        if (!ruleInstance) {
            setIsHasRule(false);
            setRule(null);
        }

        if (ruleInstance && !isEqual(ruleInstance, rule)) {
            setRule(ruleInstance as RuleWithoutIdInterface);
        }
    }, [ ruleInstance ]);

    useEffect(() => {
        if (isHasRule && !ruleInstance) {
            addNewRule();
        }
    }, [ isHasRule ]);

    return (
        <>
            <Divider className="divider-container" />
            <Heading className="heading-container" as="h5">
                <Trans i18nKey={ t("actions:fields.rules.label") }>
                    Execution Rule
                </Trans>
            </Heading>
            { isHasRule ? (
                <Rules disableLastRuleDelete={ false } readonly={ readonly } />
            ) : (
                <Alert className="alert-nutral" icon={ false }>
                    <AlertTitle
                        className="alert-title"
                        data-componentid={ `${ _componentId }-rule-info-box-title` }
                    >
                        <Trans i18nKey={ t("actions:fields.rules.info.title") }>
                            No execution rule is configured.
                        </Trans>
                    </AlertTitle>
                    <Trans
                        i18nKey={ t("actions:fields.authentication.info.message") }
                    >
                        This action will be executed without any conditions.
                    </Trans>
                    <div>
                        <Button
                            onClick={ () => setIsHasRule(true) }
                            variant="outlined"
                            size="small"
                            className={ "secondary-button" }
                            data-componentid={ `${ _componentId }-configure-rule-button` }
                        >
                            { t("actions:fields.rules.button") }
                        </Button>
                    </div>
                </Alert>
            ) }
        </>
    );
};

export default RuleConfigForm;
