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
 *
 */

import { action } from "@storybook/addon-actions";
import React, { ReactElement, useState } from "react";
import { Button } from "semantic-ui-react";
import { meta } from "./confirmation-modal.stories.meta";
import { ConfirmationModal, Heading } from "../../../src";

export default {
    parameters: {
        component: ConfirmationModal,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Confirmation Modal"
};

/**
 * Story to display the all the confirmation modal variations.
 *
 * @return {React.ReactElement}
 */
export const AllConfirmationModalVariations = (): ReactElement => {

    const [ open, setOpen ] = useState<boolean>(false);
    const [ type, setType ] = useState<"positive" | "negative" | "warning" | "info">(undefined);

    const handleShowModalButtonOnClick = (type: "positive" | "negative" | "warning" | "info"): void => {
        setType(type);
        setOpen(true);
    };

    return (
        <>
            <Button onClick={ (): void => handleShowModalButtonOnClick("positive") } positive>
                Success modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("negative") } negative>
                Error modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("warning") } color="orange">
                Warning modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("info") } color="blue">
                Info modal
            </Button>

            <ConfirmationModal
                onClose={ (): void => setOpen(false) }
                type={ type }
                open={ open }
                primaryAction="Primary"
                secondaryAction="Secondary"
                onSecondaryActionClick={ (): void => setOpen(false) }
                onPrimaryActionClick={ action("Clicked on the primary action.") }
            >
                <ConfirmationModal.Header>Heading of the modal</ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    positive={ type === "positive" }
                    negative={ type === "negative" }
                    warning={ type === "warning" }
                    info={ type === "info" }
                >
                    Clearly explain the consequences of the actions. The color of the alert will depend on the type
                    of the modal.
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    This is the main content of the modal. You can give necessary information to the users regarding
                    the action which is being performed. The assertion text has to match in-order to submit the modal.
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

AllConfirmationModalVariations.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display the text input assertion confirmation modal.
 *
 * @return {React.ReactElement}
 */
export const TextInputAssertion = (): ReactElement => {

    const [ open, setOpen ] = useState<boolean>(false);
    const [ type, setType ] = useState<"positive" | "negative" | "warning" | "info">(undefined);

    const handleShowModalButtonOnClick = (type: "positive" | "negative" | "warning" | "info"): void => {
        setType(type);
        setOpen(true);
    };

    return (
        <>
            <Button onClick={ (): void => handleShowModalButtonOnClick("positive") } positive>
                Success modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("negative") } negative>
                Error modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("warning") } color="orange">
                Warning modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("info") } color="blue">
                Info modal
            </Button>

            <ConfirmationModal
                onClose={ (): void => setOpen(false) }
                type={ type }
                open={ open }
                assertion="assertion"
                assertionHint={ <p>Please type <strong>assertion</strong> to confirm.</p> }
                assertionType="input"
                primaryAction="Primary"
                secondaryAction="Secondary"
                onSecondaryActionClick={ (): void => setOpen(false) }
                onPrimaryActionClick={ action("Clicked on the primary action.") }
            >
                <ConfirmationModal.Header>Heading of the modal</ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    positive={ type === "positive" }
                    negative={ type === "negative" }
                    warning={ type === "warning" }
                    info={ type === "info" }
                >
                    Clearly explain the consequences of the actions. The color of the alert will depend on the type
                    of the modal.
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    This is the main content of the modal. You can give necessary information to the users regarding
                    the action which is being performed. The assertion text has to match in-order to submit the modal.
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

TextInputAssertion.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display the checkbox assertion confirmation modal.
 *
 * @return {React.ReactElement}
 */
export const CheckboxAssertion = (): ReactElement => {

    const [ open, setOpen ] = useState<boolean>(false);
    const [ type, setType ] = useState<"positive" | "negative" | "warning" | "info">(undefined);

    const handleShowModalButtonOnClick = (type: "positive" | "negative" | "warning" | "info"): void => {
        setType(type);
        setOpen(true);
    };

    return (
        <>
            <Button onClick={ (): void => handleShowModalButtonOnClick("positive") } positive>
                Success modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("negative") } negative>
                Error modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("warning") } color="orange">
                Warning modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("info") } color="blue">
                Info modal
            </Button>

            <ConfirmationModal
                onClose={ (): void => setOpen(false) }
                type={ type }
                open={ open }
                assertion="assertion"
                assertionHint="Please confirm your action."
                assertionType="checkbox"
                primaryAction="Primary"
                secondaryAction="Secondary"
                onSecondaryActionClick={ (): void => setOpen(false) }
                onPrimaryActionClick={ action("Clicked on the primary action.") }
            >
                <ConfirmationModal.Header>Heading of the modal</ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    positive={ type === "positive" }
                    negative={ type === "negative" }
                    warning={ type === "warning" }
                    info={ type === "info" }
                >
                    Clearly explain the consequences of the actions. The color of the alert will depend on the type
                    of the modal.
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    This is the main content of the modal. You can give necessary information to the users regarding
                    the action which is being performed. The assertion text has to match in-order to submit the modal.
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

CheckboxAssertion.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display the animated confirmation modal.
 *
 * @return {React.ReactElement}
 */
export const Animated = (): ReactElement => {

    const [ open, setOpen ] = useState<boolean>(false);
    const [ type, setType ] = useState<"positive" | "negative" | "warning" | "info">(undefined);

    const handleShowModalButtonOnClick = (type: "positive" | "negative" | "warning" | "info"): void => {
        setType(type);
        setOpen(true);
    };

    return (
        <>
            <Button onClick={ (): void => handleShowModalButtonOnClick("positive") } positive>
                Success modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("negative") } negative>
                Error modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("warning") } color="orange">
                Warning modal
            </Button>
            <Button onClick={ (): void => handleShowModalButtonOnClick("info") } color="blue">
                Info modal
            </Button>

            <ConfirmationModal
                animated
                onClose={ (): void => setOpen(false) }
                type={ type }
                open={ open }
                primaryAction="Primary"
                secondaryAction="Secondary"
                onSecondaryActionClick={ (): void => setOpen(false) }
                onPrimaryActionClick={ action("Clicked on the primary action.") }
                textAlign="center"
            >
                <ConfirmationModal.Content>
                    <Heading as="h3">Heading of the modal</Heading>
                    <p>
                        This is the main content of the modal. You can give necessary information to the users
                        regarding the action which is being performed. The assertion text has to match in-order to
                        submit the modal.
                    </p>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

Animated.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};
