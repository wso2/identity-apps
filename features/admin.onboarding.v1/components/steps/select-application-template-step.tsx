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

import { styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import {
    APPLICATION_TYPE_OPTIONS,
    FRAMEWORK_OPTIONS,
    OnboardingComponentIds
} from "../../constants";
import { LeftColumn, TwoColumnLayout } from "../shared/onboarding-styles";
import SelectableCard from "../shared/selectable-card";
import StepHeader from "../shared/step-header";
import { ApplicationTypeOption, FrameworkOption } from "../../models";

/**
 * Framework selection container - horizontal scrollable row
 */
const FrameworkGrid = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(2),
    flexWrap: "wrap"
}));

/**
 * Application type grid - 2 columns
 */
const AppTypeGrid = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: theme.spacing(2)
}));

/**
 * OR divider with lines on both sides
 */
const OrDivider = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    margin: theme.spacing(3, 0),
    "& hr": {
        flex: 1,
        borderColor: theme.palette.divider
    }
}));

/**
 * Section label
 */
const SectionLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    fontWeight: 500,
    marginBottom: theme.spacing(2)
}));

/**
 * Props interface for SelectApplicationTemplateStep component.
 */
interface SelectApplicationTemplateStepProps extends IdentifiableComponentInterface {
    selectedTemplateId?: string;
    selectedFramework?: string;
    onTemplateSelect: (templateId: string, framework?: string) => void;
}

/**
 * Select application template step component for onboarding.
 */
const SelectApplicationTemplateStep: FunctionComponent<SelectApplicationTemplateStepProps> = (
    props: SelectApplicationTemplateStepProps
): ReactElement => {
    const {
        selectedTemplateId,
        selectedFramework,
        onTemplateSelect,
        ["data-componentid"]: componentId = OnboardingComponentIds.SELECT_APPLICATION_TEMPLATE_STEP
    } = props;

    const [ showMoreFrameworks, setShowMoreFrameworks ] = useState<boolean>(false);
    const [ showMoreAppTypes, setShowMoreAppTypes ] = useState<boolean>(false);

    const DEFAULT_FRAMEWORK_COUNT: number = 5;
    const DEFAULT_APP_TYPE_COUNT: number = 3;

    const visibleFrameworks: readonly FrameworkOption[] = showMoreFrameworks
        ? FRAMEWORK_OPTIONS
        : FRAMEWORK_OPTIONS.slice(0, DEFAULT_FRAMEWORK_COUNT);

    const visibleAppTypes: readonly ApplicationTypeOption[] = showMoreAppTypes
        ? APPLICATION_TYPE_OPTIONS
        : APPLICATION_TYPE_OPTIONS.slice(0, DEFAULT_APP_TYPE_COUNT);

    useEffect(() => {
        if (!selectedTemplateId && !selectedFramework && FRAMEWORK_OPTIONS.length > 0) {
            const defaultFramework: FrameworkOption = FRAMEWORK_OPTIONS[0];
            onTemplateSelect(defaultFramework.templateId || "", defaultFramework.id);
        }
    }, [ selectedTemplateId, selectedFramework, onTemplateSelect ]);

    const handleFrameworkSelect = useCallback(
        (framework: FrameworkOption): void => {
            onTemplateSelect(framework.templateId || "", framework.id);
        },
        [ onTemplateSelect ]
    );

    const handleAppTypeSelect = useCallback(
        (appType: ApplicationTypeOption): void => {
            onTemplateSelect(appType.templateId, undefined);
        },
        [ onTemplateSelect ]
    );

    const renderFrameworkLogo = (framework: FrameworkOption): ReactElement | null => {
        if (!framework.logo) {
            return null;
        }

        const Logo: FunctionComponent = framework.logo;

        return <Logo />;
    };

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    title="What are you building?"
                />

                { /* Framework Selection Section */ }
                <Box>
                    <SectionLabel>
                        Select by framework
                    </SectionLabel>

                    <FrameworkGrid>
                        { visibleFrameworks.map((framework: FrameworkOption) => (
                            <SelectableCard
                                key={ framework.id }
                                data-componentid={ `${componentId}-framework-${framework.id}` }
                                icon={ renderFrameworkLogo(framework) }
                                isSelected={
                                    selectedFramework === framework.id
                                    && selectedTemplateId === framework.templateId
                                }
                                onClick={ () => handleFrameworkSelect(framework) }
                                testId={ `${componentId}-framework-${framework.id}` }
                                title={ framework.displayName }
                                variant="compact"
                            />
                        )) }

                        { FRAMEWORK_OPTIONS.length > DEFAULT_FRAMEWORK_COUNT && (
                            <Link
                                component="button"
                                onClick={ () => setShowMoreFrameworks(!showMoreFrameworks) }
                                sx={ {
                                    color: "primary.main",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    whiteSpace: "nowrap",
                                    "&:hover": {
                                        textDecoration: "underline"
                                    }
                                } }
                                data-componentid={ `${componentId}-show-more-frameworks` }
                            >
                                { showMoreFrameworks ? "Show less" : "Show more" }
                            </Link>
                        ) }
                    </FrameworkGrid>
                </Box>

                { /* OR Divider */ }
                <OrDivider>
                    <Divider />
                    <Typography
                        variant="body2"
                        sx={ {
                            color: "text.secondary",
                            fontSize: "0.8125rem",
                            fontWeight: 500
                        } }
                    >
                        OR
                    </Typography>
                    <Divider />
                </OrDivider>

                { /* Application Type Selection Section */ }
                <Box>
                    <SectionLabel>
                        Select by application type
                    </SectionLabel>

                    <AppTypeGrid>
                        { visibleAppTypes.map((appType: ApplicationTypeOption) => (
                            <SelectableCard
                                key={ appType.id }
                                data-componentid={ `${componentId}-apptype-${appType.id}` }
                                description={ appType.description }
                                icon={ appType.icon ? <appType.icon /> : null }
                                isSelected={
                                    !selectedFramework
                                    && selectedTemplateId === appType.templateId
                                }
                                onClick={ () => handleAppTypeSelect(appType) }
                                testId={ `${componentId}-apptype-${appType.id}` }
                                title={ appType.displayName }
                                variant="default"
                            />
                        )) }

                        { APPLICATION_TYPE_OPTIONS.length > DEFAULT_APP_TYPE_COUNT && (
                            <Link
                                component="button"
                                onClick={ () => setShowMoreAppTypes(!showMoreAppTypes) }
                                sx={ {
                                    color: "primary.main",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    justifySelf: "start",
                                    "&:hover": {
                                        textDecoration: "underline"
                                    }
                                } }
                                data-componentid={ `${componentId}-show-more-apptypes` }
                            >
                                { showMoreAppTypes ? "Show less" : "Show more" }
                            </Link>
                        ) }
                    </AppTypeGrid>
                </Box>
            </LeftColumn>
        </TwoColumnLayout>
    );
};

export default SelectApplicationTemplateStep;
