/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useMemo } from "react";
import { ReactComponent as Preview } from "../../assets/icons/preview.svg";
import { ReactComponent as Rocket } from "../../assets/icons/rocket.svg";
import { OnboardingComponentIds } from "../../constants";
import { OnboardingChoice } from "../../models";
import Hint from "../shared/hint";
import {
    CardsRow,
    LeftColumn,
    RightColumn,
    TwoColumnLayout
} from "../shared/onboarding-styles";
import SelectableCard from "../shared/selectable-card";
import StepHeader from "../shared/step-header";
import StepIndicator, { StepConfigInterface } from "../shared/step-indicator";

/**
 * Steps for the "Add login to app" flow.
 */
const ADD_LOGIN_STEPS: StepConfigInterface[] = [
    { key: "name", label: "Name your app" },
    { key: "type", label: "Select app type" },
    { key: "configure", label: "Configure login" },
    { key: "style", label: "Style login" },
    { key: "guide", label: "Integration guide" }
];

/**
 * Steps for the "Preview experience" flow.
 */
const PREVIEW_STEPS: StepConfigInterface[] = [
    { key: "configure", label: "Configure login" },
    { key: "style", label: "Style login" },
    { key: "preview", label: "Preview" }
];

/**
 * Props interface for WelcomeStep component.
 */
interface WelcomeStepPropsInterface extends IdentifiableComponentInterface {
    /**
     * Currently selected choice.
     */
    selectedChoice?: OnboardingChoice;
    /**
     * Callback when a choice is selected.
     */
    onChoiceSelect: (choice: OnboardingChoice) => void;
}

/**
 * Welcome step component for onboarding.
 * First step where user chooses between setting up their app or previewing.
 */
const WelcomeStep: FunctionComponent<WelcomeStepPropsInterface> = (props: WelcomeStepPropsInterface): ReactElement => {
    const {
        onChoiceSelect,
        selectedChoice,
        ["data-componentid"]: componentId = OnboardingComponentIds.WELCOME_STEP
    } = props;

    // Memoize the handler to prevent unnecessary re-renders
    const handleChoiceSelect: (choice: OnboardingChoice) => void = useCallback(
        (choice: OnboardingChoice) => {
            onChoiceSelect(choice);
        },
        [ onChoiceSelect ]
    );

    // Determine which steps to show based on selection
    const currentSteps: StepConfigInterface[] = useMemo(() => {
        if (selectedChoice === OnboardingChoice.TOUR) {
            return PREVIEW_STEPS;
        }

        return ADD_LOGIN_STEPS;
    }, [ selectedChoice ]);

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    subtitle="We can help you get started faster"
                    title="Hi Matthew, What would you like to do first?"
                />
                <CardsRow>
                    <SelectableCard
                        data-componentid={ `${componentId}-add-login-option` }
                        description="Continue guided set up to integrate login into your app"
                        icon={ <Rocket fill="#ff7300" /> }
                        isSelected={ selectedChoice === OnboardingChoice.SETUP }
                        onClick={ () => handleChoiceSelect(OnboardingChoice.SETUP) }
                        title="Add login to your app"
                    />
                    <SelectableCard
                        data-componentid={ `${componentId}-preview-option` }
                        description="Try login with a built-in sample app without any setup"
                        icon={ <Preview fill="#ff7300" /> }
                        isSelected={ selectedChoice === OnboardingChoice.TOUR }
                        onClick={ () => handleChoiceSelect(OnboardingChoice.TOUR) }
                        title="Preview the login experience"
                    />
                </CardsRow>

                <Hint message="You can switch between these options later." />
            </LeftColumn>

            <RightColumn>
                { selectedChoice && (
                    <StepIndicator
                        data-componentid={ `${componentId}-step-indicator` }
                        steps={ currentSteps }
                    />
                ) }
            </RightColumn>
        </TwoColumnLayout>
    );
};

export default WelcomeStep;
