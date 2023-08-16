/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Forms } from "@wso2is/forms";
import { GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { Card, Dimmer } from "semantic-ui-react";
import ConsumerUserImage from "../../../../assets/illustrations/consumer-user.svg";
import GuestUserImage from "../../../../assets/illustrations/guest-user.svg";
import WorkUserImage from "../../../../assets/illustrations/work-user.svg";
import { UserAccountTypes } from "../../constants";

interface UserTypeSelectionProps {
    handleTriggerSubmit: () => void;
    triggerSubmit: boolean;
    initialValues: any;
    onSubmit: (values: any) => void;
}

/**
 * User type selection component.
 *
 * @param props
 */
export const UserTypeSelection: FunctionComponent<UserTypeSelectionProps> = (
    props: UserTypeSelectionProps
): ReactElement => {

    const {
        handleTriggerSubmit,
        triggerSubmit,
        initialValues,
        onSubmit
    } = props;

    const [ userTypeSelection, setUserTypeSelection ] = useState<string>(initialValues?.userType);
    const [ dimmerShow, setDimmerShow ] = useState<boolean>(false);

    /**
     * Handles the user type selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - User Type.
     */
    const handleUserTypeSelection = (e: SyntheticEvent, { id }: { id: string }): void => {
        setUserTypeSelection(id);
        onSubmit({ userType: id });
        handleTriggerSubmit();
    };

    return (
        <Forms
            data-testid="user-type-selection-form"
            onSubmit={ () => {
                onSubmit({ userType: userTypeSelection });
                setUserTypeSelection("");
            } }
            submitState={ triggerSubmit }
        >
            <Card.Group centered className="mt-5 mb-5">
                <Card
                    data-testid="user-type-selection-form-card-consumer"
                    as={ "div" }
                    link={ false }
                    className={
                        `user-selection-card ${
                            userTypeSelection === UserAccountTypes.USER
                                ? "selected underlined-selection"
                                : ""
                        }`
                    }
                    size="mini"
                    centered
                    inline
                    id="User"
                    selected={ userTypeSelection === UserAccountTypes.USER }
                    onClick={ handleUserTypeSelection }
                >
                    <Card.Content className="card-image-container">
                        <GenericIcon
                            as={ "data-url" }
                            size="small"
                            icon={ ConsumerUserImage }
                            square
                            transparent
                        />
                    </Card.Content>
                    <Card.Content
                        className="card-text-container consumer no-content-top-border"
                    >
                        <Card.Header>
                            User Account
                        </Card.Header>
                        <Card.Description>
                            Users that access applications registered in your organization.
                        </Card.Description>
                    </Card.Content>
                </Card>
                <Card
                    data-testid="user-type-selection-form-card-guest"
                    as={ "div" }
                    link={ false }
                    className={
                        `user-selection-card ${
                            userTypeSelection === UserAccountTypes.ADMINISTRATOR
                                ? "selected underlined-selection"
                                : ""
                        }`
                    }
                    size="mini"
                    centered
                    id="Collaborator"
                    selected={ userTypeSelection === UserAccountTypes.ADMINISTRATOR }
                    inline
                    onClick={ handleUserTypeSelection }
                >
                    <Card.Content className="card-image-container">
                        <GenericIcon
                            as={ "data-url" }
                            size="small"
                            icon={ GuestUserImage }
                            square
                            transparent
                        />
                    </Card.Content>
                    <Card.Content className="card-text-container no-content-top-border">
                        <Card.Header>
                            Collaborator Account
                        </Card.Header>
                        <Card.Description>
                            Invite an external collaborator to manage your organization. This user will receive
                            an email invitation they can accept in order to begin collaborating.
                        </Card.Description>
                    </Card.Content>
                </Card>
                <Card
                    data-testid="user-type-selection-form-card-work"
                    as={ "div" }
                    link={ false }
                    className="disabled-card"
                    size="default"
                    centered
                    disabled
                    id="Work"
                    inline
                >
                    <Dimmer.Dimmable
                        style={ { borderColor: "#e7e7e8 !important", height: "290px" } }
                        as={ Card }
                        dimmed={ dimmerShow }
                        onMouseEnter={ () => setDimmerShow(true) }
                        onMouseLeave={ () => setDimmerShow(false) }
                    >
                        <Card.Content className="card-image-container">
                            <GenericIcon
                                size="small"
                                icon={ WorkUserImage }
                                square
                                transparent
                            />
                        </Card.Content>
                        <Card.Content className="card-text-container no-content-top-border">
                            <Card.Header>
                                Work Account
                            </Card.Header>
                            <Card.Description>
                                Create a new user in your organization who will consume applications and can
                                have privileges in the Asgardeo console. This user will belong to your
                                organization’s domain.
                            </Card.Description>
                        </Card.Content>
                        <Dimmer
                            active={ dimmerShow }
                            className="lighter"
                        >
                            <p style={ { lineHeight: "1.5em !important" } }>
                                This feature will be available soon!
                            </p>
                        </Dimmer>
                    </Dimmer.Dimmable>
                </Card>
            </Card.Group>
        </Forms>
    );
};
