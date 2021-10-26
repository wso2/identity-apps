/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Heading } from "../../typography";
import { ConfirmationModal } from "../confirmation-modal";

/**
 * Prop type of the `ChunkErrorModal` component.
 */
interface ChunkModalPropsInterface {
    heading: ReactNode;
    description: ReactNode;
    primaryActionText: ReactNode;
}

/**
 * This component listens to the `chunk load error` and pops up a modal
 * when this error is occurred.
 */
export const ChunkErrorModal: FunctionComponent<ChunkModalPropsInterface> = (
    props: ChunkModalPropsInterface
): ReactElement => {

    const { heading, description, primaryActionText } = props;

    const [ showModal, setShowModal ] = useState(false);

    /**
     * Called on mount and unmount to add/remove the event listener.
     */
    useEffect(() => {
        addEventListener(AppConstants.CHUNK_LOAD_ERROR_EVENT, () => setShowModal(true));

        return () => {
            removeEventListener(AppConstants.CHUNK_LOAD_ERROR_EVENT, () => setShowModal(true));
        };
    }, []);

    return (
        <ConfirmationModal
            animated
            type="warning"
            textAlign="center"
            primaryAction={ primaryActionText }
            onPrimaryActionClick={ () => {
                location.reload();
            } }
            data-testid={ "chunk-error-modal" }
            open={ showModal }
        >
            <ConfirmationModal.Content>
                <Heading as="h3">{ heading }</Heading>
                <p>{ description }</p>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};
