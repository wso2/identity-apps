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

import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { SignOnMethodsCore } from "./sign-on-methods-core";
import { FeatureConfigInterface } from "../../../../../admin.core.v1";
import {
    ApplicationInterface,
    AuthenticationSequenceInterface
} from "../../../../models";
/**
 * Proptypes for the sign on methods component.
 */

interface SignOnMethodsWrapperPropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * ID of the application.
     */
    appId?: string;
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * ClientID of the application.
     */
    clientId?: string;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Flag to determine if the updated application a system application.
     */
    isSystemApplication?: boolean;
    /**
     * List of hidden authenticators.
     */
    hiddenAuthenticators: string[];
}


/**
 * Configure the different sign on strategies for an application.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
export const SignOnMethodsWrapper: FunctionComponent<SignOnMethodsWrapperPropsInterface> = (
    props: SignOnMethodsWrapperPropsInterface
): ReactElement => {

    const {
        application,
        appId,
        authenticationSequence,
        clientId,
        isLoading,
        onUpdate,
        readOnly,
        isSystemApplication,
        hiddenAuthenticators,
        [ "data-componentid" ]: componentId
    } = props;


    return (
        <SignOnMethodsCore
            application={ application }
            appId={ appId }
            authenticationSequence={ authenticationSequence }
            clientId={ clientId }
            isLoading={ isLoading }
            onUpdate={ onUpdate }
            readOnly={ readOnly }
            isSystemApplication={ isSystemApplication }
            hiddenAuthenticators={ hiddenAuthenticators }
            data-componentid={ `${ componentId }-sign-on-methods` }


        />
    );
};

/**
 * Default props for the application sign-on-methods component.
 */
SignOnMethodsWrapper.defaultProps = {
    "data-componentid": "sign-on-methods"
};
