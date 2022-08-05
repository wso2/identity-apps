/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, Button, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { Icon, List } from "semantic-ui-react";
import { AppConstants } from "../../../../features/core/constants";
import { FeatureConfigInterface } from "../../../../features/core/models";
import { AppState } from "../../../../features/core/store";
import { getUserDetails } from "../../../../features/users/api";
import { AddConsumerUserWizard } from "../../../components/consumer-users/wizard";
import { UsersConstants } from "../../../components/users/constants";
import { Trans, useTranslation } from "react-i18next";
import { EventPublisher } from "../../../../features/core/utils";

/**
 * Proptypes for add user step component in application sample flow.
 */
type AddUserStepContentPropsInterface = TestableComponentInterface;

/**
 * Component to add a user during application sample flow.
 *
 * @param {AddUserStepContentPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const AddUserStepContent: FunctionComponent<AddUserStepContentPropsInterface> = (
    props: AddUserStepContentPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ addedUserList, setAddedUserList ] = useState<string[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const addNewUser = (id: string) => {
        setIsLoading(true);
        getUserDetails(id, null)
            .then((response) => {
                if (response.emails && Array.isArray(response.emails) && response.emails.length > 0) {
                    const users = addedUserList;
                    users.push(response.emails[ 0 ] as string);
                    setAddedUserList(users);
                }
            })
            .catch(() => {
                // TODO add to notifications
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div data-testid={ testId } className="add-user-step">
            <Text>
                <Trans i18nKey="extensions:console.application.quickStart.addUserOption.description">
                    You need a <strong>customer account</strong> to log in to the application.
                </Trans>
            </Text>
            {
                hasRequiredScopes(featureConfig?.users,
                    featureConfig?.users?.scopes?.create,
                    allowedScopes)
                    ? (
                        <>
                            <Text>
                                <Trans i18nKey="extensions:console.application.quickStart.addUserOption.hint">
                                    If you don’t already have a customer account, click the below button to create one.
                                    Alternatively, go to
                                    <a
                                        onClick={ () => {
                                            eventPublisher.publish(
                                                "application-quick-start-click-navigate-to-user-management"
                                            );
                                            window.open(AppConstants.getClientOrigin()
                                                + UsersConstants.getPaths().get("USERS_PATH"),
                                                "", "noopener");
                                        } }
                                        className="external-link link pointing primary"
                                    > Manage &gt; Users <Icon name="external"/></a> and create customers.
                                </Trans>
                            </Text>
                            <Button basic
                                    primary
                                    className="info add-user-step-button"
                                    onClick={ () => {
                                        eventPublisher.publish("application-quick-start-click-add-user");
                                        setShowWizard(true);
                                    } }
                            >Add Customer</Button>
                            <List className="add-user-step-list">
                                {
                                    isLoading ? (
                                            <ContentLoader/>
                                        ) :
                                        addedUserList?.map((user, index) => {
                                            return (
                                                <List.Item key={ index } className="list-item">
                                                    <div>
                                                        <Icon
                                                            className={ "list-icon" }
                                                            name={ "check" }
                                                            color={ "green" }
                                                        />User <strong>{ user }</strong> added successfully.
                                                    </div>
                                                </List.Item>
                                            );
                                        })
                                }
                            </List>
                        </>
                    )
                    : (
                        <Text compact>
                            { t("extensions:console.application.quickStart.addUserOption.message") }
                        </Text>
                    )
            }
            {
                showWizard && (
                    <AddConsumerUserWizard
                        data-testid="user-mgt-add-user-wizard-modal"
                        closeWizard={ () => setShowWizard(false) }
                        onSuccessfulUserAddition={ (id: string) => {
                            eventPublisher.publish("application-finish-adding-user");
                            addNewUser(id);
                        } }
                        emailVerificationEnabled={ false }
                        requiredSteps={ [ "BasicDetails" ] }
                        submitStep={ "BasicDetails" }
                        hiddenFields={ [ "firstName", "lastName" ] }
                        showStepper={ false }
                        requestedPasswordOption="create-password"
                        title="Add User"
                        description="Follow the steps to add a new user"
                    />
                )
            }
        </div>

    );
};

/**
 * Default props for the component.
 */
AddUserStepContent.defaultProps = {
    "data-testid": "add-user-step-content"
};
