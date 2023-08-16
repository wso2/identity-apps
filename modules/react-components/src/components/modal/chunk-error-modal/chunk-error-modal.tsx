/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AppConstants } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Heading } from "../../typography";
import { ConfirmationModal } from "../confirmation-modal";

/**
 * Prop type of the `ChunkErrorModal` component.
 */
interface ChunkModalPropsInterface extends IdentifiableComponentInterface {
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

    const {
        heading,
        description,
        primaryActionText,
        [ "data-componentid" ]: componentId
    } = props;

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
            data-componentid={ "chunk-error-modal" }
            data-testid={ componentId }
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
 * Default proptypes for the component.
 */
ChunkErrorModal.defaultProps = {
    "data-componentid": "chunk-error-modal"
};
