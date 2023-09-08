/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

    const classes: string = classNames(
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
                                        hasPrevious && (
                                            <Button
                                                onClick={ () => { handlePreviousStep(step); } }
                                                size="tiny"
                                                className="step-previous"
                                                color="orange"
                                                basic
                                            >
                                                Previous
                                            </Button>
                                        )
                                    }
                                    {
                                        hasNext && (
                                            <Button
                                                disabled={ isNextEnabled }
                                                onClick={ () => { handleCompleteStep(step); } }
                                                size="tiny"
                                                primary
                                            >
                                                Next
                                            </Button>
                                        )
                                    }
                                    {
                                        isFinalStep && (
                                            <Button
                                                onClick={ () => { handleCompleteStep(step); } }
                                                size="tiny"
                                                primary
                                            >
                                                Finish
                                            </Button>
                                        )
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
