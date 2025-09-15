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
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Segment } from "semantic-ui-react";

interface VerificationSuccessStepPropsInterface extends IdentifiableComponentInterface {}

interface VerificationSuccessStepContentPropsInterface extends VerificationSuccessStepPropsInterface {}

const VerificationSuccessStepContent: FunctionComponent<VerificationSuccessStepContentPropsInterface> = (
    {
        ["data-componentid"]: componentId = "verification-success-step-content"
    }: VerificationSuccessStepContentPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <Segment basic textAlign="center" data-componentid={ componentId }>
            <div className="modal-input">
                <div className="svg-box">
                    <svg className="circular positive-stroke" viewBox="0 0 150 150">
                        <circle
                            className="path"
                            cx="75"
                            cy="75"
                            r="50"
                            fill="none"
                            strokeWidth="5"
                            strokeMiterlimit="10"
                        />
                    </svg>
                    <svg className="positive-icon positive-stroke">
                        <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)">
                            <path
                                className="positive-icon__check"
                                fill="none"
                                d="M616.306,283.025L634.087,300.805L673.361,261.53"
                            />
                        </g>
                    </svg>
                </div>
                <p>{ t("myAccount:components.mobileUpdateWizard.done") }</p>
            </div>
        </Segment>
    );
};

interface VerificationSuccessStepActionsPropsInterface extends VerificationSuccessStepPropsInterface {
    onDone: () => void;
}

const VerificationSuccessStepActions: FunctionComponent<VerificationSuccessStepActionsPropsInterface> = (
    {
        onDone,
        ["data-componentid"]: testId = "verification-success-step-actions"
    }: VerificationSuccessStepActionsPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <Button
            primary
            type="submit"
            onClick={ onDone }
            data-testid={ `${testId}-modal-actions-primary-button` }
        >
            { t("common:done") }
        </Button>
    );
};

export {
    VerificationSuccessStepContent,
    VerificationSuccessStepActions
};
