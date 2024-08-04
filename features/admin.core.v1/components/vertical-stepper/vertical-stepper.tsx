/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { VerticalStep } from "./step";

interface VerticalStepperProps extends TestableComponentInterface {
    handleFinishAction?: () => void;
    alwaysOpen?: boolean;
    // TODO: Fix the interface here and remove any.
    stepContent: VerticalStepperStepInterface[] & any;
    isNextEnabled?: boolean;
    isSidePanelOpen: boolean;
}

export interface VerticalStepperStepInterface {
    preventGoToNextStep?: boolean;
    stepAction?: () => void;
    stepContent: ReactNode;
    stepTitle: ReactNode;
}

export const VerticalStepper: FunctionComponent<VerticalStepperProps> = (
    props: VerticalStepperProps
): ReactElement => {

    const {
        handleFinishAction,
        alwaysOpen,
        stepContent,
        isNextEnabled,
        isSidePanelOpen,
        [ "data-testid" ]: testId
    } = props;

    const [ completedSteps, setCompletedSteps ] = useState<number[]>([]);
    const [ currentActiveStep, setCurrentActiveStep ] = useState<number>();

    const handleCompleteStep = (step: number) => {
        setCompletedSteps([ ...completedSteps, step ]);
    };

    const handleCurrentActiveStep = (): void => {
        setCurrentActiveStep(completedSteps.pop());
    };

    const handlePreviousStep = () => {
        setCurrentActiveStep(completedSteps.pop());
    };

    return (
        <div className={ "quick-start-step-container" } data-testid={ testId }>
            { stepContent && stepContent.map((step, index) => (
                <VerticalStep
                    key={ index }
                    alwaysOpen={ alwaysOpen }
                    step={ index }
                    isInitial={ index === 0 }
                    hasNext={ stepContent[index + 1] }
                    hasPrevious={ stepContent[index - 1] }
                    isFinalStep={ index == (stepContent.length - 1) }
                    stepTitle={ step.stepTitle } 
                    stepContent={ step.stepContent } 
                    handleCompleteStep={ () => {
                        if (index == (stepContent.length - 1)) {
                            handleFinishAction();

                            return;
                        }

                        if (step.stepAction) {
                            step.stepAction();
                        }                        

                        if (step.preventGoToNextStep) {                                                        
                            // If preventGoToNextStep is available and true,
                            // It will prevent from going to the next step.
                            // This will happen AFTER the next button action
                            // is performed. 
                            return;
                        }

                        handleCompleteStep(index);
                        handleCurrentActiveStep();
                    } }
                    handlePreviousStep={ handlePreviousStep }
                    isComplete={ completedSteps.includes(index) }
                    isActiveStep={ currentActiveStep === index }
                    isNextEnabled={ !isNextEnabled }
                    isSidePanelOpen={ isSidePanelOpen }
                    isCurrentStep={ !completedSteps.includes(index) && 
                        completedSteps[completedSteps.length - 1] + 1 === index 
                    }
                />
            )) }
        </div>
    );
};

VerticalStepper.defaultProps = {
    alwaysOpen: false
};
