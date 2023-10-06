/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { handleIDVPUpdateError, handleIDVPUpdateSuccess } from "./notification-utils";
import { updateIdentityVerificationProvider } from "../api";
import { IdentityVerificationProviderInterface } from "../models";

/**
 * Updates an Identity Verification Provider with given data and displays the
 * appropriate success of error notification depending on the response.
 *
 * @param idvp - Identity Verification Provider to be updated.
 * @param setIsSubmitting - Function to set the submitting state.
 * @param onUpdate - Callback to be called after the update.
 * @returns void.
 */
export const updateIDVP = (
    idvp: IdentityVerificationProviderInterface,
    setIsSubmitting: (boolean) => void,
    onUpdate: () => void
) : void => {

    setIsSubmitting(true);
    updateIdentityVerificationProvider(idvp)
        .then(handleIDVPUpdateSuccess)
        .catch((error: IdentityAppsApiException) => {
            handleIDVPUpdateError(error);
        })
        .finally(() => {
            setIsSubmitting(false);
            onUpdate();
        });
};

/**
 * An utility method to get a content loader.
 *
 * @returns A content loader element.
 */
export const getContentLoader = (): ReactElement => {
    return (
        <EmphasizedSegment padded>
            <ContentLoader inline="centered" active/>
        </EmphasizedSegment>
    );
};
