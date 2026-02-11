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

import { Theme, styled } from "@mui/material/styles";
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
import { ApplicationTypeOptionInterface, FrameworkOptionInterface } from "../../models";
import { LeftColumn, SectionLabel, TwoColumnLayout } from "../shared/onboarding-styles";
import SelectableCard from "../shared/selectable-card";
import StepHeader from "../shared/step-header";

/**
 * Framework selection container - horizontal scrollable row
 */
const FrameworkGrid: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing(2)
}));

/**
 * Application type grid - 2 columns
 */
const AppTypeGrid: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(4, 1fr)"
}));

/**
 * Props interface for SelectApplicationTemplateStep component.
 */
interface SelectApplicationTemplateStepPropsInterface extends IdentifiableComponentInterface {
    selectedTemplateId?: string;
    selectedFramework?: string;
    onTemplateSelect: (templateId: string, framework?: string) => void;
}

/**
 * Select application template step component for onboarding.
 */
const SelectApplicationTemplateStep: FunctionComponent<SelectApplicationTemplateStepPropsInterface> = (
    props: SelectApplicationTemplateStepPropsInterface
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

    const visibleFrameworks: readonly FrameworkOptionInterface[] = showMoreFrameworks
        ? FRAMEWORK_OPTIONS
        : FRAMEWORK_OPTIONS.slice(0, DEFAULT_FRAMEWORK_COUNT);

    const visibleAppTypes: readonly ApplicationTypeOptionInterface[] = showMoreAppTypes
        ? APPLICATION_TYPE_OPTIONS
        : APPLICATION_TYPE_OPTIONS.slice(0, DEFAULT_APP_TYPE_COUNT);

    useEffect(() => {
        if (!selectedTemplateId && !selectedFramework && FRAMEWORK_OPTIONS.length > 0) {
            const defaultFramework: FrameworkOptionInterface = FRAMEWORK_OPTIONS[0];

            onTemplateSelect(defaultFramework.templateId || "", defaultFramework.id);
        }
    }, [ selectedTemplateId, selectedFramework, onTemplateSelect ]);

    const handleFrameworkSelect: (framework: FrameworkOptionInterface) => void = useCallback(
        (framework: FrameworkOptionInterface): void => {
            onTemplateSelect(framework.templateId || "", framework.id);
        },
        [ onTemplateSelect ]
    );

    const handleAppTypeSelect: (appType: ApplicationTypeOptionInterface) => void = useCallback(
        (appType: ApplicationTypeOptionInterface): void => {
            onTemplateSelect(appType.templateId, undefined);
        },
        [ onTemplateSelect ]
    );

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
                        { visibleFrameworks.map((framework: FrameworkOptionInterface) => (
                            <SelectableCard
                                key={ framework.id }
                                data-componentid={ `${componentId}-framework-${framework.id}` }
                                icon={ framework.logo ? <framework.logo /> : null }
                                isSelected={
                                    selectedFramework === framework.id
                                    && selectedTemplateId === framework.templateId
                                }
                                onClick={ () => handleFrameworkSelect(framework) }
                                title={ framework.displayName }
                                variant="compact"
                            />
                        )) }

                        { FRAMEWORK_OPTIONS.length > DEFAULT_FRAMEWORK_COUNT && (
                            <Link
                                component="button"
                                onClick={ () => setShowMoreFrameworks(!showMoreFrameworks) }
                                sx={ {
                                    "&:hover": {
                                        textDecoration: "underline"
                                    },
                                    color: "primary.main",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    whiteSpace: "nowrap"
                                } }
                                data-componentid={ `${componentId}-show-more-frameworks` }
                            >
                                { showMoreFrameworks ? "Show less" : "Show more" }
                            </Link>
                        ) }
                    </FrameworkGrid>
                </Box>

                <Divider textAlign="left" sx={ { my: 4 } }>
                    <Typography
                        variant="body2"
                        sx={ {
                            color: "text.secondary",
                            fontSize: "1rem",
                            fontWeight: 500
                        } }
                    >
                        or
                    </Typography>
                </Divider>

                { /* Application Type Selection Section */ }
                <Box>
                    <SectionLabel>
                        Select by application type
                    </SectionLabel>

                    <AppTypeGrid>
                        { visibleAppTypes?.map((appType: ApplicationTypeOptionInterface) => (
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
                                title={ appType.displayName }
                                variant="default"
                            />
                        )) }

                        { APPLICATION_TYPE_OPTIONS.length > DEFAULT_APP_TYPE_COUNT && (
                            <Link
                                component="button"
                                onClick={ () => setShowMoreAppTypes(!showMoreAppTypes) }
                                sx={ {
                                    "&:hover": {
                                        textDecoration: "underline"
                                    },
                                    color: "primary.main",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    justifySelf: "start",
                                    textDecoration: "none"
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
