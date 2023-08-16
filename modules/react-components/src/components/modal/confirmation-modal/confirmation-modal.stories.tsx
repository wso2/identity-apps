/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { action } from "@storybook/addon-actions";
import React, { ReactElement, useState } from "react";
import { Button } from "semantic-ui-react";
import { ConfirmationModal } from "./confirmation-modal";
import { meta } from "./confirmation-modal.stories.meta";
import { Heading } from "../../typography";

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
 * @returns the story for displaying all the variations of the confirmation modal.
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
 * @returns the story for displaying the text input assertion confirmation modal.
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
 * @returns the story for displaying the checkbox assertion confirmation modal.
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
 * @returns Confirmation modal.
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
