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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useEffect } from "react";
import {
    APPLICATION_TYPE_OPTIONS,
    FRAMEWORK_OPTIONS,
    OnboardingComponentIds
} from "../../constants";
import { ApplicationTypeOptionInterface, FrameworkOptionInterface } from "../../models/application";
import { LeftColumn, SectionLabel, TwoColumnLayout } from "../shared/onboarding-styles";
import SelectableCard from "../shared/selectable-card";
import StepHeader from "../shared/step-header";

/**
 * Framework selection container
 */
const FrameworkGrid: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))"
}));

/**
 * Application type grid
 */
const AppTypeGrid: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
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

    const visibleFrameworks: readonly FrameworkOptionInterface[] = FRAMEWORK_OPTIONS;

    const visibleAppTypes: readonly ApplicationTypeOptionInterface[] = APPLICATION_TYPE_OPTIONS;

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

                <Box
                    sx={ {
                        "&::-webkit-scrollbar": {
                            background: "transparent",
                            width: "8px"
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "transparent",
                            borderRadius: "4px"
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "transparent"
                        },
                        "&:hover::-webkit-scrollbar-thumb": {
                            background: "rgba(0, 0, 0, 0.2)"
                        },
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        minHeight: 0,
                        overflowY: "auto"
                    } }
                >
                    <Box sx={ { display: "flex", flexDirection: "column", gap: 1.5 } }>
                        <SectionLabel>
                            Select by technology
                        </SectionLabel>

                        <FrameworkGrid>
                            { visibleFrameworks.map((framework: FrameworkOptionInterface) => (
                                <SelectableCard
                                    key={ framework.id }
                                    data-componentid={ `${componentId}-framework-${framework.id}` }
                                    icon={
                                        framework.logo
                                            ? (typeof framework.logo === "string"
                                                ? <img alt={ framework.displayName } src={ framework.logo } />
                                                : <framework.logo />)
                                            : null
                                    }
                                    isSelected={
                                        selectedFramework === framework.id
                                        && selectedTemplateId === framework.templateId
                                    }
                                    onClick={ () => handleFrameworkSelect(framework) }
                                    title={ framework.displayName }
                                    variant="compact"
                                />
                            )) }
                        </FrameworkGrid>
                    </Box>

                    <Divider textAlign="left" sx={ { my: 3 } } />

                    <Box sx={ { display: "flex", flexDirection: "column", gap: 1.5 } }>
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
                        </AppTypeGrid>
                    </Box>
                </Box>
            </LeftColumn>
        </TwoColumnLayout>
    );
};

export default SelectApplicationTemplateStep;
