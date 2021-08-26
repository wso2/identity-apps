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

import {
    IdentityClient
} from "@wso2/identity-oidc-js";
import { ProfileConstants } from "@wso2is/core/constants";
import { TestableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Grid, Icon, List, Modal, Popup } from "semantic-ui-react";
import { deleteFederatedAssociation, getFederatedAssociations } from "../../api/federated-associations";
import { getSettingsSectionIcons } from "../../configs";
import { commonConfig } from "../../extensions";
import {
    AlertInterface,
    AlertLevels,
    AuthStateInterface
} from "../../models";
import { FederatedAssociation } from "../../models/federated-associations";
import { AppState } from "../../store";
import { SettingsSection, UserAvatar } from "../shared";

/**
 * Prop types for `FederatedAssociations` component
 * Also see {@link FederatedAssociations.defaultProps}
 */
interface FederatedAssociationsPropsInterface extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    disableExternalLoginsOnEmpty?: boolean;
    isNonLocalCredentialUser?: boolean;
}

/**
 * This renders the federated associations component
 * @param props
 */
export const FederatedAssociations: FunctionComponent<FederatedAssociationsPropsInterface> = (
    props: FederatedAssociationsPropsInterface
): React.ReactElement => {

    const {
        onAlertFired,
        disableExternalLoginsOnEmpty,
        isNonLocalCredentialUser,
        ["data-testid"]: testId
    } = props;

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [id, setId] = useState(null);
    const { t } = useTranslation();
    const [federatedAssociations, setFederatedAssociations] = useState<FederatedAssociation[]>([]);
    const [showExternalLogins, setShowExternalLogins] = useState<boolean>(true);
    const [currentIDP, setCurrentIDP] = useState<String>();
    const auth = IdentityClient.getInstance();

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
                        t("myAccount:components.federatedAssociations.notifications.getFederatedAssociations."
                            + "error.description",
                            {
                                description: error
                            }
                        ),
                    level: AlertLevels.ERROR,
                    message:
                        t("myAccount:components.federatedAssociations.notifications." +
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


    useEffect(() => {
        auth.getDecodedIDToken().then((response)=>{
            for (let i = 0; i < response.amr.length; i++) {
                if (response.amr[i].includes("Google")) {
                    setCurrentIDP("Google");
                }
                if (response.amr[i].includes("Github")) {
                    setCurrentIDP("GitHub");
                }
            }
        });
    }, []);


    /**
     * This sets flag to disable showing external logins section based on config.
     */
    useEffect(() => {
        if (disableExternalLoginsOnEmpty) {
            if (federatedAssociations?.length <= 0) {
                setShowExternalLogins(false);
            } else {
                setShowExternalLogins(true);
            }
        }
    }, [federatedAssociations]);

    /**
     * This function calls the `deleteFederatedAssociation` api call
     * @param id
     */
    const removeFederatedAssociation = (id: string) => {
        deleteFederatedAssociation(id)
            .then(() => {
                getFederatedAssociationsList();
                onAlertFired({
                    description: t("myAccount:components.federatedAssociations.notifications"
                        + ".removeFederatedAssociation.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("myAccount:components.federatedAssociations.notifications"
                        + ".removeFederatedAssociation.success.message")
                });
            })
            .catch((error) => {
                onAlertFired({
                    description: t("myAccount:components.federatedAssociations.notifications"
                        + ".removeFederatedAssociation.error.description",
                        {
                            description: error
                        }),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.federatedAssociations.notifications"
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
                data-testid={ `${testId}-delete-confirmation-modal` }
                dimmer="blurring"
                size="mini"
                open={ confirmDelete }
                onClose={ () => { setConfirmDelete(false); } }
            >
                <Modal.Content data-testid={ `${testId}-delete-confirmation-modal-content` }>
                    { t("myAccount:components.federatedAssociations.deleteConfirmation") }
                </Modal.Content>
                <Modal.Actions data-testid={ `${testId}-delete-confirmation-modal-actions` }>
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
            <List divided verticalAlign="middle"
                  className="main-content-inner"
                  data-testid={ `${testId}-list` }
            >
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
                                            { !isNonLocalCredentialUser &&
                                                !(currentIDP==federatedAssociation.idp.name ||
                                                currentIDP==federatedAssociation.idp.displayName) ?
                                            <Grid.Column width={ 5 } className="last-column">
                                                <List.Content floated="right">
                                                    <Popup
                                                        trigger={ (
                                                            <Icon
                                                                link
                                                                className="list-icon"
                                                                size="small"
                                                                color="grey"
                                                                name="trash alternate"
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
                                            </Grid.Column>:null
                                            }
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
        showExternalLogins &&
            <SettingsSection
                data-testid={ `${testId}-settings-section` }
                description={ t("myAccount:sections.federatedAssociations.description") }
                header={ t("myAccount:sections.federatedAssociations.heading") }
                icon={ getSettingsSectionIcons().federatedAssociations }
                iconMini={ getSettingsSectionIcons().federatedAssociationsMini }
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

/**
 * Default properties of {@link FederatedAssociations}
 * See type definitions in {@link FederatedAssociationsPropsInterface}
 */
FederatedAssociations.defaultProps = {
    "data-testid": "federated-associations",
    disableExternalLoginsOnEmpty: commonConfig.personalInfoPage.externalLogins.disableExternalLoginsOnEmpty
};
