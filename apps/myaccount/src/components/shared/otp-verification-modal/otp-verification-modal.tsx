/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Skeleton from "@mui/material/Skeleton/Skeleton";
import Box from "@oxygen-ui/react/Box/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Modal } from "semantic-ui-react";
import OTPVerificationStep from "./otp-verification-step";
import VerificationSuccessStep from "./verification-success-step";
import { OTPVerificationChannel } from "../../../models/profile-ui";

interface OtpVerificationModalPropsInterface extends IdentifiableComponentInterface {
    isOpen: boolean;
    isLoading?: boolean;
    verificationChannel: OTPVerificationChannel;
    onClose: (shouldRevalidate?: boolean) => void;
    isMultiValued: boolean;
}

const OTPVerificationModal: FunctionComponent<OtpVerificationModalPropsInterface> = (
    {
        verificationChannel,
        onClose,
        isOpen = false,
        isLoading = false,
        isMultiValued = false,
        ["data-componentid"]: componentId = "otp-verification-modal"
    }: OtpVerificationModalPropsInterface
): ReactElement => {
    const [ activeStep, setActiveStep ] = React.useState(0);

    const modalSteps: (() => ReactElement)[] = [
        () => (
            <OTPVerificationStep
                verificationChannel={ verificationChannel }
                isLoading={ false }
                onCancel={ onClose }
                isMultiValued={ isMultiValued }
                onVerificationSuccess={ () => setActiveStep(1) }
            />
        ),
        () => (
            <VerificationSuccessStep
                verificationChannel={ verificationChannel }
                onClose={ () => onClose(true) }
            />
        )
    ];

    return (
        <Modal
            data-componentid={ componentId }
            dimmer="blurring"
            size="mini"
            open={ isOpen }
            className="totp"
        >
            { isLoading
                ? (
                    <Box sx={ { p: 3 } } data-componentid={ `${componentId}-loading-skeleton` }>
                        <Skeleton variant="text" width="55%" height={ 32 } />
                        <Skeleton variant="text" width="100%" height={ 28 } />
                        <Skeleton variant="rounded" width="100%" height={ 80 } sx={ { mt: 1 } } />
                    </Box>
                ) : modalSteps[ activeStep ]()
            }
        </Modal>
    );
};

export default OTPVerificationModal;
