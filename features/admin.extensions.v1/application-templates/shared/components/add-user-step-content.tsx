/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { ProfileInfoInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Button, ContentLoader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon, List } from "semantic-ui-react";
import { AppState, FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { AppConstants } from "@wso2is/admin.core.v1/constants";
import { EventPublisher } from "@wso2is/admin.core.v1/utils";
import { getUserDetails } from "@wso2is/admin.users.v1/api";
import { AddConsumerUserWizard } from "@wso2is/admin.users.v1/components/wizard/add-consumer-user-wizard";

/**
 * Proptypes for add user step component in application sample flow.
 */
type AddUserStepContentPropsInterface = TestableComponentInterface;

/**
 * Component to add a user during application sample flow.
 *
 * @param props - Props injected into the component.
 * @returns AddUserStepContent Component.
 */
export const AddUserStepContent: FunctionComponent<AddUserStepContentPropsInterface> = (
    props: AddUserStepContentPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ addedUserList, setAddedUserList ] = useState<string[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const addNewUser = (id: string) => {
        setIsLoading(true);
        getUserDetails(id, null)
            .then((response: ProfileInfoInterface) => {
                if (response.emails && Array.isArray(response.emails) && response.emails.length > 0) {
                    const users: string[] = addedUserList;

                    users.push(
                        response?.userName.split("/")?.length > 1
                            ? response?.userName.split("/")[ 1 ]
                            : response?.userName.split("/")[ 0 ]
                    );
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
                    You need a <strong>user account</strong> to log in to the application.
                </Trans>
            </Text>
            <Show
                when={ featureConfig?.users?.scopes?.create }
            >
                <Text>
                    <Trans i18nKey="extensions:console.application.quickStart.addUserOption.hint">
                        If you don’t already have a user account, click the below button to create one.
                        Alternatively, go to
                        <a
                            onClick={ () => {
                                eventPublisher.publish(
                                    "application-quick-start-click-navigate-to-user-management"
                                );
                                window.open(AppConstants.getClientOrigin()
                                    + AppConstants.getPaths().get("USERS"),
                                "", "noopener");
                            } }
                            className="external-link link pointing primary"
                        > Manage &gt; Users <Icon name="external"/></a> and create users.
                    </Trans>
                </Text>
                <Button
                    basic
                    primary
                    className="info add-user-step-button"
                    onClick={ () => {
                        eventPublisher.publish("application-quick-start-click-add-user");
                        setShowWizard(true);
                    } }
                >
                    { t("extensions:manage.users.buttons.addUserBtn") }
                </Button>
                <List className="add-user-step-list">
                    {
                        isLoading ? (
                            <ContentLoader/>
                        ) :
                            addedUserList?.map((user: string, index: number) => {
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
            </Show>
            <Show
                when={ [] }
                notWhen={ featureConfig?.users?.scopes?.create }
            >
                <Text compact>
                    { t("extensions:console.application.quickStart.addUserOption.message") }
                </Text>
            </Show>
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
