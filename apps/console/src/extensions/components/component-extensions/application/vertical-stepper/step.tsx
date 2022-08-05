/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Button, Divider } from "semantic-ui-react";

interface VerticalStepPropsInterface {
    alwaysOpen: boolean;
    className?: string;
    stepTitle: string;
    stepContent: any;
    hasPrevious: boolean;
    hasNext: boolean;
    isFinalStep: boolean;
    isComplete: boolean;
    isCurrentStep: boolean;
    step: number;
    isInitial: boolean;
    isActiveStep: boolean;
    handleCompleteStep: (key: number) => void;
    handlePreviousStep: (key: number) => void;
    isNextEnabled: boolean;
    isSidePanelOpen: boolean;
}

export const VerticalStep: FunctionComponent<VerticalStepPropsInterface> = (
    props: VerticalStepPropsInterface
): ReactElement => {

    const {
        alwaysOpen,
        className,
        stepTitle,
        stepContent,
        hasPrevious,
        hasNext,
        isFinalStep,
        handleCompleteStep,
        handlePreviousStep,
        step,
        isComplete,
        isInitial,
        isActiveStep,
        isCurrentStep,
        isNextEnabled,
        isSidePanelOpen
    } = props;

    const classes = classNames(
        "quick-start-step",
        {
            "complete": !alwaysOpen && !isActiveStep && isComplete,
            "initial": !alwaysOpen && !isInitial && !isCurrentStep && !isComplete && !isActiveStep
        }
        , className
    );
    
    return (
        <div className={ classes }>
            <div className={ `step-content-container ${ isSidePanelOpen ? "side-panel-visible" : "" }` }>
                <h3>{ stepTitle }</h3>
                <div className="step-content">
                    { stepContent }
                    {
                        !alwaysOpen && (
                            <>
                                <Divider hidden/>
                                <div>
                                    {
                                        hasPrevious &&
                                        <Button
                                            onClick={ () => { handlePreviousStep(step); } }
                                            size="tiny"
                                            className="step-previous"
                                            color="orange"
                                            basic
                                        >
                                            Previous
                                        </Button>
                                    }
                                    {
                                        hasNext &&
                                        <Button
                                            disabled={ isNextEnabled }
                                            onClick={ () => { handleCompleteStep(step); } }
                                            size="tiny"
                                            primary
                                        >
                                            Next
                                        </Button>
                                    }
                                    {
                                        isFinalStep &&
                                        <Button
                                            onClick={ () => { handleCompleteStep(step); } }
                                            size="tiny"
                                            primary
                                        >
                                            Finish
                                        </Button>
                                    }
                                </div>
                            </>
                        )
                    }
                    <Divider hidden/>
                </div>
            </div>
        </div>
    );
};

VerticalStep.defaultProps = {
    alwaysOpen: false
};
