/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import {
    AsgardeoSPAClient, BasicUserInfo, DecodedIDTokenPayload
} from "@asgardeo/auth-react";
import { TestableComponentInterface } from "@wso2is/core/models";
import { AppAvatar, Popup } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List, Modal } from "semantic-ui-react";
import { deleteFederatedAssociation, getFederatedAssociations } from "../../api/federated-associations";
import { getSettingsSectionIcons } from "../../configs";
import { commonConfig } from "../../extensions";
import {
    AlertInterface,
    AlertLevels
} from "../../models";
import { FederatedAssociation } from "../../models/federated-associations";
import ConnectionIcon from "../../themes/default/assets/images/icons/connection.svg";
import resolveConnectionImagePath from "../../utils/resolve-connection-image-path";
import { SettingsSection } from "../shared";

/**
 * Prop types for `FederatedAssociations` component
 * Also see {@link FederatedAssociations.defaultProps}
 */
interface FederatedAssociationsPropsInterface extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    disableExternalLoginsOnEmpty?: boolean;
    isNonLocalCredentialUser?: boolean;
    sourceIdp: string;
}

/**
 * This renders the federated associations component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Federated associations component.
 */
export const FederatedAssociations: FunctionComponent<FederatedAssociationsPropsInterface> = (
    props: FederatedAssociationsPropsInterface
): React.ReactElement => {

    const {
        onAlertFired,
        disableExternalLoginsOnEmpty,
        sourceIdp,
        ["data-testid"]: testId
    } = props;

    const [ confirmDelete, setConfirmDelete ] = useState(false);
    const [ id, setId ] = useState(null);
    const { t } = useTranslation();
    const [ federatedAssociations, setFederatedAssociations ] = useState<FederatedAssociation[]>([]);
    const [ showExternalLogins, setShowExternalLogins ] = useState<boolean>(true);
    const [ currentIDP, setCurrentIDP ] = useState<string>();
    const [ linkedAttribute, setLinkedAttribute ] = useState<string>();
    const auth: AsgardeoSPAClient = AsgardeoSPAClient.getInstance();

    /**
     * This calls the `getFederatedAssociations` api call
     */
    const getFederatedAssociationsList = (): void => {
        getFederatedAssociations()
            .then((response: FederatedAssociation[]) => {
                setFederatedAssociations(response);
            })
            .catch((error: AxiosError) => {
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


    /* TODO: This is intended to disable remove option for the authenticated IDP in External Login section
       (Ideally not necessary). Hence, disable this and linked conditions after proper BE fix.
       Issue: https://github.com/wso2/product-is/issues/12380
    */
    /**
     * This temporary one checks for authenticated IDP.
     */
    useEffect(() => {
        auth.getDecodedIDToken().then((response: DecodedIDTokenPayload)=>{
            for (let i: number = 0; i < response.amr.length; i++) {
                if (response.amr[i].includes("Google")) {
                    setCurrentIDP("Google");
                }
                if (response.amr[i].includes("Github")) {
                    setCurrentIDP("GitHub");
                }
                if (response.amr[i].includes("OpenIDConnect")) {
                    setCurrentIDP("Microsoft");
                }
            }
        });
    }, []);

    //Todo : Update with relevant linked attribute
    useEffect(() => {
        auth.getBasicUserInfo().then((response: BasicUserInfo)=> {
            /* For the time being, lets have Gmail/Github primary Email (at the time of mapping)
            as the linked attribute. But sooner we have to display the linking attribute. */
            setLinkedAttribute(response.email);
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
    }, [ federatedAssociations ]);

    /**
     * This function calls the `deleteFederatedAssociation` api call
     * @param id - ID of the association to be deleted
     */
    const removeFederatedAssociation = (id: string): void => {
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
            .catch((error: AxiosError) => {
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
     * Pops up a model requesting confirmation before deleting.
     *
     * @returns Delete confirmation modal.
     */
    const deleteConfirmation = (): ReactElement => {
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
     * This returns the list of federated associations as a `List` component.
     *
     * @returns List of federated associations.
     */
    const federatedAssociationsList = (): ReactElement => {
        return (
            <List
                divided
                verticalAlign="middle"
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
                                                <div className="associations-list-avatar-wrapper">
                                                    <AppAvatar
                                                        hoverable={ false }
                                                        defaultIcon={ ConnectionIcon }
                                                        size="mini"
                                                        image={
                                                            resolveConnectionImagePath(
                                                                null,
                                                                federatedAssociation?.idp?.imageUrl
                                                            )
                                                        }
                                                        name={ federatedAssociation.federatedUserId }
                                                    />
                                                    <List.Content>
                                                        <List.Header>
                                                            {
                                                                federatedAssociation.idp.displayName
                                                            || federatedAssociation.idp.name
                                                            }
                                                        </List.Header>
                                                        <List.Description>
                                                            { linkedAttribute }
                                                        </List.Description>
                                                    </List.Content>
                                                </div>
                                            </Grid.Column>
                                            { !(currentIDP === federatedAssociation.idp.name ||
                                                currentIDP === federatedAssociation.idp.displayName) &&
                                                !(sourceIdp === federatedAssociation.idp.name ||
                                                sourceIdp === federatedAssociation.idp.displayName) ?
                                                (<Grid.Column width={ 5 } className="last-column">
                                                    <List.Content floated="right">
                                                        <Popup
                                                            trigger={ (
                                                                <Icon
                                                                    link
                                                                    className="list-icon padded-icon"
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
                                                </Grid.Column>):null
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

    if (!showExternalLogins) {
        return null;
    }

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            data-componentid={ `${testId}-settings-section` }
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
