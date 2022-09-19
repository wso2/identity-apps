/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LinkButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import { terminateAllUserSessions } from "../../api";
import { AppConstants, CommonConstants } from "../../constants";
import { history } from "../../helpers";

/**
 * Proptypes for the user session termination modal component.
 */
interface UserSessionTerminationModalPropsInterface extends IdentifiableComponentInterface {
    /**
     * Flag to decide if the modal is open/close.
     */
     isModalOpen: boolean;
     /**
      * Callback function for the cancel button.
      */
     handleModalClose: () => void;
}

/**
 * User session termination modal component.
 *
 * @param UserSessionTerminationModalInterface - Props injected to the component.
 */
export const UserSessionTerminationModal: FunctionComponent<UserSessionTerminationModalPropsInterface> = (
    props: UserSessionTerminationModalPropsInterface
): ReactElement => {

    const {
        isModalOpen,
        handleModalClose,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    /**
     * The following function handles redirecting the user to the active session list.
     */
    const handleNavigatingToSessionList = () => {
        history.push(AppConstants.getPaths().get("SECURITY") + "#" + CommonConstants.ACCOUNT_ACTIVITY);
        handleModalClose();
    };

    /**
     * Terminates all the active user sessions.
     */
    const handleTerminateAllUserSessions = () => {
        terminateAllUserSessions()
            .then(() => {
                history.push(AppConstants.getPaths().get("LOGOUT"));
                dispatch(addAlert({
                    description: t(
                        "myAccount:components.userSessions.notifications.terminateAllUserSessions.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.userSessions.notifications.terminateAllUserSessions.success.message"
                    )
                }));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    dispatch(addAlert({
                        description: t(
                            "myAccount:components.userSessions.notifications.terminateAllUserSessions." +
                            "error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.userSessions.notifications.terminateAllUserSessions.error" +
                            ".message"
                        )
                    }));
                } else {
                    dispatch(addAlert({
                        description: t(
                            "myAccount:components.userSessions.notifications.terminateAllUserSessions." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.userSessions.notifications.terminateAllUserSessions." +
                            "genericError.message"
                        )
                    }));
                }
            })
            .finally(() => {
                handleModalClose();
            });
    };

    return (
        <Modal
            data-componentid={ componentId }
            open={ isModalOpen }
            size="small"
        >
            <Modal.Header data-componentid={ `${ componentId }-heading` }>
                { t("myAccount:components.userSessions.modals.terminateActiveUserSessionModal.heading") }
            </Modal.Header>
            <Modal.Content data-componentid={ `${ componentId }-content` }>
                { t("myAccount:components.userSessions.modals.terminateActiveUserSessionModal.message") }
            </Modal.Content>
            <Modal.Actions data-componentid={ `${ componentId }-actions` }>
                <LinkButton 
                    data-componentid={ `${ componentId }-cancel-btn` } 
                    onClick={ handleModalClose } 
                    floated="left"
                >
                    { t("common:cancel") }
                </LinkButton>
                <Button 
                    data-componentid={ `${ componentId }-review-sessions-btn` } 
                    onClick={ handleNavigatingToSessionList }
                >
                    { t("myAccount:components.userSessions.modals.terminateActiveUserSessionModal.secondaryAction") }
                </Button>
                <Button 
                    data-componentid={ `${ componentId }-terminate-all-btn` } 
                    onClick={ handleTerminateAllUserSessions } 
                    color="red"
                >
                    { t("myAccount:components.userSessions.modals.terminateActiveUserSessionModal.primaryAction") }
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default properties of {@link UserSessionTerminationModal}
 * See type definitions in {@link UserSessionTerminationModalPropsInterface}
 */
UserSessionTerminationModal.defaultProps = {
    "data-componentid": "user-active-sessions-terminate-modal"
};
