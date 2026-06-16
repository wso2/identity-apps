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
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { RuleConditionWithoutIdInterface, RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StyledReviewPlatformCard, StyledRuleSummaryCode } from "../device-policy-wizard-styles";
import { DevicePlatformType, PlatformDefinitionInterface } from "../../models/device-policy";
import { countConditions } from "../../utils/device-policy-rule-utils";

interface PolicyReviewStepPropsInterface extends IdentifiableComponentInterface {
    platforms: PlatformDefinitionInterface[];
    selectedPlatforms: DevicePlatformType[];
    policyName: string;
    platformRules: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>;
    platformConfigured: Partial<Record<DevicePlatformType, boolean>>;
    onEditPolicy?: () => void;
    onEditRules: () => void;
    showAssignHint?: boolean;
}

/**
 * Shared "Review" step for the device policy create/edit wizards.
 * Summarizes the policy name, selected platforms and per-platform rules.
 */
const PolicyReviewStep: FunctionComponent<PolicyReviewStepPropsInterface> = (
    props: PolicyReviewStepPropsInterface
): ReactElement => {
    const {
        "data-componentid": componentId = "policy-review-step",
        platforms,
        selectedPlatforms,
        policyName,
        platformRules,
        platformConfigured,
        onEditPolicy,
        onEditRules,
        showAssignHint
    } = props;

    const { t } = useTranslation();

    const selectedPlatformDefs: PlatformDefinitionInterface[] = platforms.filter(
        (p: PlatformDefinitionInterface) => selectedPlatforms.includes(p.key)
    );

    return (
        <Box>
            <Stack
                direction="row"
                alignItems="baseline"
                justifyContent="space-between"
                sx={ { mb: 1.5 } }
            >
                <Typography
                    variant="overline"
                    sx={ { fontWeight: 700, letterSpacing: "0.06em", color: "text.secondary" } }
                >
                    { t("devices:assurancePolicies.wizard.steps.review.sectionPolicy") }
                </Typography>
                { onEditPolicy && (
                    <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={ onEditPolicy }
                    >
                        { t("devices:assurancePolicies.wizard.steps.review.edit") }
                    </Button>
                ) }
            </Stack>
            <Box
                sx={ {
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    gap: "14px 20px",
                    mb: 3.5
                } }
            >
                <Typography variant="body2" sx={ { color: "text.secondary", fontWeight: 600, pt: 0.5 } }>
                    { t("devices:assurancePolicies.wizard.steps.review.policyName") }
                </Typography>
                <Typography variant="body1" sx={ { fontWeight: 600 } }>
                    { policyName || <span style={ { color: "var(--text-disabled)" } }>(not set)</span> }
                </Typography>
                <Typography variant="body2" sx={ { color: "text.secondary", fontWeight: 600, pt: 0.5 } }>
                    { t("devices:assurancePolicies.wizard.steps.review.platforms") }
                </Typography>
                <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
                    { selectedPlatformDefs.map((p: PlatformDefinitionInterface) => (
                        <Chip
                            key={ p.key }
                            label={ p.label }
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )) }
                </Stack>
            </Box>

            <Stack
                direction="row"
                alignItems="baseline"
                justifyContent="space-between"
                sx={ { mb: 1.5 } }
            >
                <Typography
                    variant="overline"
                    sx={ { fontWeight: 700, letterSpacing: "0.06em", color: "text.secondary" } }
                >
                    { t("devices:assurancePolicies.wizard.steps.review.sectionRules") }
                </Typography>
                <Button
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={ onEditRules }
                >
                    { t("devices:assurancePolicies.wizard.steps.review.edit") }
                </Button>
            </Stack>

            { selectedPlatformDefs.map((p: PlatformDefinitionInterface) => {
                const rule: RuleWithoutIdInterface | null | undefined = platformRules[p.key];
                const isConfigured: boolean = platformConfigured[p.key] === true;
                const condCount: number = isConfigured && rule ? countConditions(rule) : 0;
                const groupCount: number = isConfigured && rule ? (rule.rules?.length ?? 0) : 0;

                return (
                    <StyledReviewPlatformCard key={ p.key }>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={ { mb: 1.25 } }
                        >
                            <Chip
                                label={ p.label }
                                size="small"
                                variant="outlined"
                                sx={ { color: "text.secondary", borderColor: "divider" } }
                            />
                            <Typography variant="caption" sx={ { color: "text.secondary" } }>
                                { !isConfigured
                                    ? <span>Applies to <strong>all { p.label } devices</strong></span>
                                    : `${ condCount } condition(s) across ${ groupCount } group(s)`
                                }
                            </Typography>
                        </Stack>
                        { isConfigured && rule && (
                            <StyledRuleSummaryCode>
                                { (rule.rules ?? []).map(
                                    (
                                        group: RuleConditionWithoutIdInterface,
                                        gi: number
                                    ): ReactElement => (
                                        <React.Fragment key={ gi }>
                                            { gi > 0 && (
                                                <Box
                                                    component="div"
                                                    sx={ {
                                                        color: "primary.main",
                                                        fontWeight: 700,
                                                        my: 0.75
                                                    } }
                                                >
                                                    OR
                                                </Box>
                                            ) }
                                            <div>
                                                (
                                                { (group.expressions ?? []).map(
                                                    (
                                                        expr: {
                                                            field: string;
                                                            operator: string;
                                                            value: string;
                                                        },
                                                        ei: number
                                                    ): ReactElement => (
                                                        <span key={ ei }>
                                                            { ei > 0 && (
                                                                <Typography
                                                                    component="span"
                                                                    sx={ {
                                                                        color: "text.secondary",
                                                                        fontWeight: 700,
                                                                        fontFamily: "inherit",
                                                                        fontSize: "inherit"
                                                                    } }
                                                                >
                                                                    { " AND " }
                                                                </Typography>
                                                            ) }
                                                            <Typography
                                                                component="span"
                                                                sx={ {
                                                                    fontWeight: 600,
                                                                    fontFamily: "inherit",
                                                                    fontSize: "inherit"
                                                                } }
                                                            >
                                                                { expr.field }
                                                            </Typography>
                                                            <Typography
                                                                component="span"
                                                                sx={ {
                                                                    color: "text.secondary",
                                                                    fontFamily: "inherit",
                                                                    fontSize: "inherit"
                                                                } }
                                                            >
                                                                { " " }{ expr.operator }{ " " }
                                                            </Typography>
                                                            <Typography
                                                                component="span"
                                                                sx={ {
                                                                    color: "primary.main",
                                                                    fontWeight: 600,
                                                                    fontFamily: "inherit",
                                                                    fontSize: "inherit"
                                                                } }
                                                            >
                                                                &ldquo;{ expr.value || "?" }&rdquo;
                                                            </Typography>
                                                        </span>
                                                    )
                                                ) }
                                                )
                                            </div>
                                        </React.Fragment>
                                    )
                                ) }
                            </StyledRuleSummaryCode>
                        ) }
                    </StyledReviewPlatformCard>
                );
            }) }

            { showAssignHint && (
                <Alert severity="info" sx={ { mt: 3 } } data-componentid={ `${ componentId }-assign-hint` }>
                    <AlertTitle>
                        { t("devices:assurancePolicies.wizard.steps.review.assignHint.title") }
                    </AlertTitle>
                    <ul style={ { margin: "4px 0 0", paddingLeft: 20 } }>
                        <li
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={ {
                                __html: t("devices:assurancePolicies.wizard.steps.review.assignHint.loginFlow")
                            } }
                        />
                        <li
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={ {
                                __html: t("devices:assurancePolicies.wizard.steps.review.assignHint.otherFlows")
                            } }
                        />
                    </ul>
                </Alert>
            ) }
        </Box>
    );
};

export default PolicyReviewStep;
