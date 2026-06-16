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
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { TrashIcon } from "@oxygen-ui/react-icons";
import RulesComponent from "@wso2is/admin.rules.v1/components/rules-component";
import { ConditionExpressionsMetaDataInterface } from "@wso2is/admin.rules.v1/models/meta";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
    StyledPlatformTab,
    StyledPlatformTabBar,
    StyledTabBadge
} from "../device-policy-wizard-styles";
import { DevicePlatformType, PlatformDefinitionInterface } from "../../models/device-policy";
import { countConditions, renderPlatformLogo } from "../../utils/device-policy-rule-utils";

interface PolicyRulesStepPropsInterface extends IdentifiableComponentInterface {
    platforms: PlatformDefinitionInterface[];
    selectedPlatforms: DevicePlatformType[];
    activeTabIndex: number;
    platformRules: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>;
    platformConfigured: Partial<Record<DevicePlatformType, boolean>>;
    activeConditionsMeta: ConditionExpressionsMetaDataInterface;
    isMetadataLoading: boolean;
    rulesValidationError?: string;
    onTabChange: (index: number) => void;
    onConfigureRule: () => void;
    onClearRule: () => void;
    onRemovePlatform?: (platform: DevicePlatformType) => void;
}

/**
 * Shared "Execution rules" step for the device policy create/edit wizards.
 * Renders the per-platform tab bar and the rule builder for the active platform.
 */
const PolicyRulesStep: FunctionComponent<PolicyRulesStepPropsInterface> = (
    props: PolicyRulesStepPropsInterface
): ReactElement => {
    const {
        "data-componentid": componentId = "policy-rules-step",
        platforms,
        selectedPlatforms,
        activeTabIndex,
        platformRules,
        platformConfigured,
        activeConditionsMeta,
        isMetadataLoading,
        rulesValidationError,
        onTabChange,
        onConfigureRule,
        onClearRule,
        onRemovePlatform
    } = props;

    const { t } = useTranslation();

    const activePlatform: DevicePlatformType | null = selectedPlatforms[activeTabIndex] ?? null;
    const activePlatformDef: PlatformDefinitionInterface | undefined =
        platforms.find((p: PlatformDefinitionInterface) => p.key === activePlatform);

    const renderRuleEmptyState = (): ReactElement => {
        const pname: string = activePlatformDef?.label ?? (activePlatform ?? "");

        return (
            <Alert
                sx={ { backgroundColor: "var(--oxygen-palette-grey-100)" } }
                icon={ false }
                data-componentid={ `${ componentId }-no-rule-info-box` }
            >
                <AlertTitle data-componentid={ `${ componentId }-rule-info-box-title` }>
                    { t("devices:assurancePolicies.wizard.steps.executionRules.emptyState.heading") }
                </AlertTitle>
                { t(
                    "devices:assurancePolicies.wizard.steps.executionRules.emptyState.description",
                    { platform: pname }
                ) }
                <Box sx={ { mt: 1.5 } }>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={ onConfigureRule }
                        data-componentid={ `${ componentId }-configure-rule-btn` }
                    >
                        { t("devices:assurancePolicies.wizard.steps.executionRules.configureRule") }
                    </Button>
                </Box>
            </Alert>
        );
    };

    const renderRuleBuilder = (): ReactElement => {
        if (isMetadataLoading) {
            return (
                <Box sx={ { pt: 3, color: "text.secondary" } }>
                    <Typography variant="body2">
                        { t("devices:assurancePolicies.wizard.steps.executionRules.loadingMetadata") }
                    </Typography>
                </Box>
            );
        }

        if (activeConditionsMeta.length === 0) {
            return (
                <Box sx={ { pt: 3, color: "text.secondary" } }>
                    <Typography variant="body2">
                        { t("devices:assurancePolicies.wizard.steps.executionRules.noMetadata") }
                    </Typography>
                </Box>
            );
        }

        return (
            <RulesComponent
                key={ `rules-${ activePlatform }` }
                conditionExpressionsMetaData={ activeConditionsMeta }
                initialData={ platformRules[activePlatform] ?? null }
                data-componentid={ `${ componentId }-${ activePlatform }-rules` }
            />
        );
    };

    return (
        <Box>
            <StyledPlatformTabBar>
                { selectedPlatforms.map((platform: DevicePlatformType, index: number) => {
                    const pDef: PlatformDefinitionInterface | undefined =
                        platforms.find((p: PlatformDefinitionInterface) => p.key === platform);
                    const isActive: boolean = activeTabIndex === index;
                    const condCount: number = platformRules[platform]
                        ? countConditions(platformRules[platform])
                        : 0;
                    const isConfigured: boolean = platformConfigured[platform] === true;

                    return (
                        <StyledPlatformTab
                            key={ platform }
                            type="button"
                            isActive={ isActive }
                            onClick={ (): void => onTabChange(index) }
                            data-componentid={ `${ componentId }-${ platform }-tab` }
                        >
                            { pDef?.logo ? renderPlatformLogo(pDef.logo, 18) : null }
                            { pDef?.label ?? platform }
                            { isConfigured ? (
                                <StyledTabBadge isActive={ isActive }>
                                    { condCount }
                                </StyledTabBadge>
                            ) : (
                                <StyledTabBadge isActive={ isActive }
                                    sx={ { fontSize: 14, lineHeight: 1, px: "5px", py: 0 } }
                                >
                                    ·
                                </StyledTabBadge>
                            ) }
                            { onRemovePlatform && (
                                <Box
                                    component="span"
                                    onClick={ (e: React.MouseEvent): void => {
                                        e.stopPropagation();
                                        onRemovePlatform(platform);
                                    } }
                                    aria-label={ `Remove ${ pDef?.label ?? platform }` }
                                    sx={ {
                                        alignItems: "center",
                                        borderRadius: "50%",
                                        color: "inherit",
                                        display: "inline-flex",
                                        fontSize: 16,
                                        fontWeight: 400,
                                        height: 18,
                                        justifyContent: "center",
                                        lineHeight: 1,
                                        ml: 0.75,
                                        opacity: 0.6,
                                        width: 18,
                                        "&:hover": { opacity: 1 }
                                    } }
                                >
                                    ×
                                </Box>
                            ) }
                        </StyledPlatformTab>
                    );
                }) }
            </StyledPlatformTabBar>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={ { mb: 1.5 } }>
                <Heading as="h5">
                    { t("devices:assurancePolicies.wizard.steps.executionRules.sectionLabel") }
                    { " " }
                    <Typography
                        component="span"
                        variant="body2"
                        sx={ { color: "text.secondary", fontWeight: 400 } }
                    >
                        — { activePlatformDef?.label }
                    </Typography>
                </Heading>
                { platformConfigured[activePlatform] && (
                    <Button
                        variant="text"
                        color="error"
                        size="small"
                        startIcon={ <TrashIcon /> }
                        onClick={ onClearRule }
                        data-componentid={ `${ componentId }-clear-rule-btn` }
                    >
                        { t("devices:assurancePolicies.wizard.steps.executionRules.clearRule") }
                    </Button>
                ) }
            </Stack>

            { rulesValidationError && (
                <Typography
                    variant="caption"
                    sx={ { color: "error.main", display: "block", mb: 1.5 } }
                >
                    { rulesValidationError }
                </Typography>
            ) }

            { !platformConfigured[activePlatform]
                ? renderRuleEmptyState()
                : renderRuleBuilder()
            }
        </Box>
    );
};

export default PolicyRulesStep;
