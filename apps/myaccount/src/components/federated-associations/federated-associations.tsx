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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List, Modal, Popup } from "semantic-ui-react";
import { deleteFederatedAssociation, getFederatedAssociations } from "../../api/federated-associations";
import { SettingsSectionIcons } from "../../configs";
import {
    AlertInterface,
    AlertLevels
} from "../../models";
import { FederatedAssociation } from "../../models/federated-associations";
import { SettingsSection, UserAvatar } from "../shared";

/**
 * Prop types for `FederatedAssociations` component
 */
interface FederatedAssociationsPropsInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * This renders the federated associations component
 * @param props
 */
export const FederatedAssociations = (props: FederatedAssociationsPropsInterface): React.ReactElement => {

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [id, setId] = useState(null);

    const { onAlertFired } = props;
    const { t } = useTranslation();
    const [federatedAssociations, setFederatedAssociations] = useState<FederatedAssociation[]>([]);

    /**
     * This calls the `getFederatedAssociations` api call
     */
    const getFederatedAssociationsList = () => {
        getFederatedAssociations()
            .then((response: FederatedAssociation[]) => {
                setFederatedAssociations(response);
            })
            .catch((error) => {
                onAlertFired({
                    description:
                        t("userPortal:components.federatedAssociations.notifications.getFederatedAssociations."
                            + "error.description",
                            {
                                description: error
                            }
                        ),
                    level: AlertLevels.ERROR,
                    message:
                        t("userPortal:components.federatedAssociations.notifications." +
                            "getFederatedAssociations.error.message")
                });
            });
    };

    /**
     * This calls the `getFederatedAssociationsList` function on component mount
     */
    useEffect(() => {
        getFederatedAssociationsList();
    }, []);

    /**
     * This function calls the `deleteFederatedAssociation` api call
     * @param id
     */
    const removeFederatedAssociation = (id: string) => {
        deleteFederatedAssociation(id)
            .then(() => {
                getFederatedAssociationsList();
                onAlertFired({
                    description: t("userPortal:components.federatedAssociations.notifications"
                        + ".removeFederatedAssociation.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("userPortal:components.federatedAssociations.notifications"
                        + ".removeFederatedAssociation.success.message")
                });
            })
            .catch((error) => {
                onAlertFired({
                    description: t("userPortal:components.federatedAssociations.notifications"
                        + ".removeFederatedAssociation.error.description",
                        {
                            description: error
                        }),
                    level: AlertLevels.ERROR,
                    message: t("userPortal:components.federatedAssociations.notifications"
                        + ".removeFederatedAssociation.error.message")
                });
            });
    };

    /**
     * Pops up a model requesting confirmation before deleting
     */
    const deleteConfirmation = (): React.ReactElement => {
        return (
            <Modal
                dimmer="blurring"
                size="mini"
                open={ confirmDelete }
                onClose={ () => { setConfirmDelete(false); } }
            >
                <Modal.Content>
                    { t("userPortal:components.federatedAssociations.deleteConfirmation") }
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        className="link-button"
                        onClick={ () => {
                            setId(null);
                            setConfirmDelete(false);
                        } }
                    >
                        { t("common:cancel") }
                    </Button>
                    <Button
                        primary
                        onClick={ () => {
                            removeFederatedAssociation(
                                id
                            );
                            setId(null);
                            setConfirmDelete(false);
                        } }
                    >
                        { t("common:remove") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    /**
     * This returns the list of federated associations as a `List` component
     */
    const federatedAssociationsList = (): React.ReactElement => {
        return (
            <List divided verticalAlign="middle" className="main-content-inner">
                {
                    federatedAssociations && federatedAssociations.map(
                        (federatedAssociation: FederatedAssociation, index: number) => {
                            return (
                                <List.Item className="inner-list-item" key={ index }>
                                    <Grid padded>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 11 } className="first-column">
                                                <UserAvatar
                                                    floated="left"
                                                    spaced="right"
                                                    size="mini"
                                                    image={ federatedAssociation.idp.imageUrl }
                                                    name={ federatedAssociation.federatedUserId }
                                                />
                                                <List.Header>
                                                    { federatedAssociation.federatedUserId }
                                                </List.Header>
                                                <List.Description>
                                                    {
                                                        federatedAssociation.idp.displayName
                                                        || federatedAssociation.idp.name
                                                    }
                                                </List.Description>
                                            </Grid.Column>
                                            <Grid.Column width={ 5 } className="last-column">
                                                <List.Content floated="right">
                                                    <Popup
                                                        trigger={ (
                                                            <Icon
                                                                link
                                                                className="list-icon"
                                                                size="small"
                                                                color="red"
                                                                name="trash alternate outline"
                                                                onClick={ () => {
                                                                    setId(federatedAssociation.id);
                                                                    setConfirmDelete(true);
                                                                } }
                                                            />
                                                        ) }
                                                        inverted
                                                        position="top center"
                                                        content={ t("common:remove") }
                                                    />
                                                </List.Content>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Item>
                            );
                        }
                    )
                }
            </List>
        );
    };

    return (
        <SettingsSection
            description={ t("userPortal:sections.federatedAssociations.description") }
            header={ t("userPortal:sections.federatedAssociations.heading") }
            icon={ SettingsSectionIcons.federatedAssociations }
            iconMini={ SettingsSectionIcons.federatedAssociationsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            showActionBar={ true }
        >
            { deleteConfirmation() }
            { federatedAssociationsList() }
        </SettingsSection>
    );
};
