/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AppConstants } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Heading } from "../../typography";
import { ConfirmationModal } from "../confirmation-modal";

/**
 * Prop type of the `NetworkErrorModal` component.
 */
interface NetworkErrorModalPropTypes extends IdentifiableComponentInterface {
    heading: ReactNode;
    description: ReactNode;
    primaryActionText: ReactNode;
    primaryAction: () => void;
}

/**
 * This component listens to the `network_error_event` Event and pops up a modal
 * when this Event is dispatched.
 *
 * This is used to show an error message when an API call fails due to a `401` error
 * or a network-timeout error.
 *
 * @param {NetworkErrorModalPropTypes} props - The props passed into the component.
 *
 * @return {ReactElement} - The component that pops up a modal when there is a network error.
 */
export const NetworkErrorModal: FunctionComponent<NetworkErrorModalPropTypes> = (
    props: NetworkErrorModalPropTypes
): ReactElement => {

    const {
        heading,
        description,
        primaryActionText,
        primaryAction,
        [ "data-componentid" ]: componentId
    } = props;

    const [ showModal, setShowModal ] = useState(false);

    /**
     * Show modal.
     */
    const showErrorModal = () => {
        setShowModal(true);
    };

    /**
     * Called on mount and unmount to add/remove the event listener.
     */
    useEffect(() => {
        addEventListener(AppConstants.NETWORK_ERROR_EVENT, showErrorModal);

        return () => {
            removeEventListener(AppConstants.NETWORK_ERROR_EVENT, showErrorModal);
        };
    }, []);

    return (
        <ConfirmationModal
            animated
            type="warning"
            textAlign="center"
            primaryAction={ primaryActionText }
            onPrimaryActionClick={ () => {
                primaryAction();
            } }
            data-componentid={ componentId }
            data-testid={ "network-error-modal" }
            open={ showModal }
        >
            <ConfirmationModal.Content>
                <Heading as="h3">{ heading }</Heading>
                <p>{ description }</p>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
NetworkErrorModal.defaultProps = {
    "data-componentid": "network-error-modal"
};
