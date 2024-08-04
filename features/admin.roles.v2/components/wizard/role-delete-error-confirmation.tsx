/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { TilesIcon } from "@oxygen-ui/react-icons";
import Divider from "@oxygen-ui/react/Divider/Divider";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { ConfirmationModal } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

/**
 * Prop types for the role delete error confirmation modal component.
 */
interface RoleDeleteErrorConfirmationPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the modal is open or not.
     */
    isOpen: boolean;
    /**
     * Callback to be called when the modal is closed.
     */
    onClose: () => void;
    /**
     * The role that is to be deleted.
     */
    selectedRole: RolesInterface;
}

/**
 * This component renders the role delete error confirmation modal.
 *
 * @param props - Props injected to the component.
 * @returns `RoleDeleteErrorConfirmation` component.
 */
export const RoleDeleteErrorConfirmation: FunctionComponent<RoleDeleteErrorConfirmationPropsInterface> = (
    props: RoleDeleteErrorConfirmationPropsInterface
): ReactElement => {
    const {
        isOpen,
        onClose,
        selectedRole,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            onClose={ (): void => onClose() }
            type="negative"
            open={ isOpen }
            secondaryAction={ t("common:close") }
            onSecondaryActionClick={ (): void => onClose() }
            data-testid={ componentId }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-testid={ `${ componentId }-header` }
            >
                { t("roles:list.confirmations.deleteItemError.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-testid={ `${ componentId }-message` }
            >
                { t("roles:list.confirmations.deleteItemError.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ componentId }-content` }
            >
                <span>{ t("roles:list.confirmations.deleteItemError.content") }</span>
                <Divider hidden />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <TilesIcon />
                        </ListItemIcon>
                        <ListItemText primary={ selectedRole?.audience?.display } />
                    </ListItem>
                </List>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
RoleDeleteErrorConfirmation.defaultProps = {
    "data-componentid": "role-delete-error-confirmation-modal"
};
