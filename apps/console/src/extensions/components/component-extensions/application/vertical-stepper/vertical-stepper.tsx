/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState, ReactNode } from "react";
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
        setCompletedSteps([...completedSteps, step]);
    };

    const handlePreviousStep = (step: number) => {
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

                        handleCompleteStep(index);

                        if (step.stepAction) {
                            step.stepAction();
                        }
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
