/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { FunctionComponent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Checkbox,
    Container,
    Divider,
    Grid,
    Icon,
    List,
    Modal,
    Placeholder,
} from "semantic-ui-react";
import {
    fetchConsentedApps,
    fetchConsentReceipt,
    hideConsentEditView,
    hideConsentRevokeModal,
    revokeConsentedApp,
    setConsentedAppsState,
    setEditingConsent,
    showConsentEditView,
    showConsentRevokeModal,
    updateConsentedClaim,
    updateRevokedClaimIds
} from "../actions";
import { GenericAppIcon } from "../configs";
import { AppState } from "../helpers";
import {
    ConsentInterface,
    ConsentState,
    ServiceInterface
} from "../models/consents";
import { ThemeIcon } from "./icon";
import { SettingsSection } from "./settings-section";

/**
 * Consent management component.
 *
 * @return {JSX.Element}
 */
export const ConsentManagementComponent: FunctionComponent<{}> = (): JSX.Element => {
    const consentReceipt = useSelector((state: AppState) => state.consentManagement.consentReceipt);
    const consentedApps = useSelector((state: AppState) => state.consentManagement.consentedApps);
    const editingConsent = useSelector((state: AppState) => state.consentManagement.editingConsent);
    const isConsentEditViewVisible = useSelector((state: AppState) => state.consentManagement.isConsentEditViewVisible);
    const isConsentRevokeModalVisible = useSelector(
        (state: AppState) => state.consentManagement.isConsentRevokeModalVisible
    );
    const isFetchConsentedAppsRequestLoading = useSelector(
        (state: AppState) => state.consentManagement.isFetchConsentedAppsRequestLoading
    );
    const revokedClaimIds = useSelector((state: AppState) => state.consentManagement.revokedClaimIds);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        // Set the default consent state which is `ACTIVE`.
        dispatch(setConsentedAppsState(ConsentState.ACTIVE));
        // fetch the consents list from the API.
        dispatch(fetchConsentedApps());
    }, []);

    /**
     * Handles the consent edit button click. Retrieves the the receipt information
     * and stores it in the state and sets the current consent object as the editing
     * consent. And finally toggles the consent edit modal visibility.
     * @param {ConsentInterface} consent corresponding consent object
     */
    const handleConsentEditClick = (consent: ConsentInterface): void => {
        dispatch(fetchConsentReceipt(consent.consentReceiptID));
        dispatch(setEditingConsent(consent));
        dispatch(showConsentEditView());
    };

    /**
     * Handles the consent revoke button click. Sets the current consent object as
     * the editing consent and toggles the visibility of the consent revoke modal.
     * @param {ConsentInterface} consent corresponding consent object
     */
    const handleConsentRevokeClick = (consent: ConsentInterface): void => {
        dispatch(setEditingConsent(consent));
        dispatch(showConsentRevokeModal());
    };

    /**
     * Revokes the consent of an already consented application.
     */
    const revokeConsent = (): void => {
        dispatch(revokeConsentedApp(editingConsent.consentReceiptID));
        dispatch(hideConsentRevokeModal());
        dispatch(fetchConsentedApps());
    };

    /**
     * Handles the claims enable and disable toggles. If the toggle is checked and the
     * claim id is in the `revokedClaimIds` array in state, the id is taken out of the
     * `revokedClaimIds` array. And if the toggle is unchecked and the id is not in the
     * `revokedClaimIds` array, it is appended.
     * @param {React.ChangeEvent<HTMLInputElement>} e the toggle event
     * @param {number} id claim id
     */
    const handleClaimsToggle = (e: React.ChangeEvent<HTMLInputElement>, { id }: { id: number }): void => {
        const { checked } = e.target;

        let ids = [...revokedClaimIds];

        if (checked) {
            if (revokedClaimIds.includes(id)) {
                ids = revokedClaimIds.filter((claimId: number) => claimId !== id);
                dispatch(updateRevokedClaimIds(ids));
            }
        } else {
            if (!revokedClaimIds.includes(id)) {
                ids = [...ids, id];
                dispatch(updateRevokedClaimIds(ids));
            }
        }
    };

    /**
     * Handles the claims update button click action event. The revoked claims are taken
     * out of the existing receipt object and are passed on to the `updateConsentedClaims`
     * which executes the API request and updates the consented claims.
     */
    const handleClaimsUpdateClick = (): void => {
        const receipt = { ...consentReceipt };

        let isPIIEmpty: boolean = false;

        // If the `piiCategory` id is in the `revokedClaimIds`,
        // then the category is removed from the list.
        receipt.services.map((service: ServiceInterface) => {
            service.purposes.map((purpose) => {
                purpose.piiCategory = purpose.piiCategory.filter((category) => {
                    if (!revokedClaimIds.includes(category.piiCategoryId)) {
                        return category;
                    }
                });
                // If consent to all the pii categories are revoked
                // the application will have to be revoked.
                if (purpose.piiCategory.length === 0) {
                    isPIIEmpty = true;
                }
            });
        });

        // If the PII category list is empty, show the consent revoke modal.
        // Else, perform the usual consented claims updating process.
        if (isPIIEmpty) {
            dispatch(hideConsentEditView());
            dispatch(showConsentRevokeModal());
        } else {
            dispatch(updateConsentedClaim(receipt));
            dispatch(hideConsentEditView());
            dispatch(fetchConsentedApps());
        }
    };

    /**
     * Handles the consent modal close action.
     */
    const handleConsentModalClose = (): void => {
        dispatch(hideConsentEditView());
    };

    /**
     * Handles the consent revoke modal close action.
     */
    const handleConsentRevokeModalClose = (): void => {
        dispatch(hideConsentRevokeModal());
    };

    /**
     * Generates an empty placeholder to be shown until the consented
     * application list is fetched from the API.
     *
     * @return {JSX.Element[]}
     */
    const createConsentedAppsListPlaceholder = (): JSX.Element[] => {
        const placeholder = [];
        for (let i = 0; i < 2; i++) {
            placeholder.push(
                <List.Item className="inner-list-item" key={ i }>
                    <Grid padded>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 } className="first-column">
                                <List.Content verticalAlign="middle">
                                    <Placeholder>
                                        <Placeholder.Header image>
                                            <Placeholder.Line/>
                                            <Placeholder.Line/>
                                        </Placeholder.Header>
                                    </Placeholder>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Item>
            );
        }
        return placeholder;
    };

    const editConsentModal = (
        <Modal
            open={ isConsentEditViewVisible }
            onClose={ handleConsentModalClose }
            size="tiny"
            dimmer="blurring"
        >
            <Modal.Content>
                <List>
                    <List.Item>
                        <List.Content floated="left">
                            <ThemeIcon
                                icon={ GenericAppIcon }
                                size="tiny"
                                defaultIcon
                                square
                                bordered
                                rounded
                                relaxed="very"
                            />
                        </List.Content>
                        <List.Content>
                            <List.Header><h2>{ editingConsent.spDisplayName }</h2></List.Header>
                            <List.Description>
                                <div className="meta">
                                    <strong>
                                        { t("views:consentManagement.modals.editConsentModal.description.state") }
                                        :
                                    </strong>
                                    { " " }
                                    { editingConsent.state }
                                </div>
                                <div className="meta">
                                    <strong>
                                        { t("views:consentManagement.modals.editConsentModal.description.version") }
                                        :
                                    </strong>
                                    { " " }
                                    { consentReceipt.version }
                                </div>
                                <div className="meta">
                                    <strong>
                                        { t("views:consentManagement.modals.editConsentModal.description" +
                                            ".collectionMethod") }:
                                    </strong>
                                    { " " }
                                    { consentReceipt.collectionMethod }
                                </div>
                                <div className="meta">
                                    <strong>
                                        { t("views:consentManagement.modals.editConsentModal.description" +
                                            ".description") }:
                                    </strong>
                                    { " " }
                                    { editingConsent.spDescription }
                                </div>
                            </List.Description>
                        </List.Content>
                    </List.Item>
                </List>
            </Modal.Content>
            <Divider fitted/>
            <Modal.Content>
                <Modal.Description>
                    <p>
                        <strong>
                            { t("views:consentManagement.modals.editConsentModal.description.piiCategoryHeading") }:
                        </strong>
                    </p>
                    { consentReceipt &&
                    consentReceipt.services &&
                    consentReceipt.services.map(
                        (service: ServiceInterface) =>
                            service &&
                            service.purposes &&
                            service.purposes.map((purpose) => {
                                return (
                                    <div key={ purpose.purposeId }>
                                        <strong>{ purpose.purpose }</strong>
                                        <List verticalAlign="middle">
                                            { purpose.piiCategory &&
                                            purpose.piiCategory.map((category) => (
                                                <List.Item key={ category.piiCategoryId }>
                                                    <List.Content floated="right">
                                                        <Checkbox
                                                            id={ category.piiCategoryId }
                                                            toggle
                                                            defaultChecked
                                                            onChange={ handleClaimsToggle }
                                                        />
                                                    </List.Content>
                                                    <List.Content>
                                                        { category.piiCategoryDisplayName }
                                                    </List.Content>
                                                </List.Item>
                                            )) }
                                        </List>
                                    </div>
                                );
                            })
                    ) }
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button className="link-button" onClick={ handleConsentModalClose }>
                    { t("common:cancel") }
                </Button>
                <Button primary onClick={ handleClaimsUpdateClick }>
                    { t("common:update") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    const consentRevokeModal = (
        <Modal
            size="mini"
            className="link-button"
            open={ isConsentRevokeModalVisible }
            onClose={ handleConsentRevokeModalClose }
            dimmer="blurring"
        >
            <Modal.Content>
                <Container>
                    <h3>
                        {
                            t(
                                "views:consentManagement.modals.consentRevokeModal.heading",
                                { appName: editingConsent.spDisplayName }
                            )
                        }
                    </h3>
                </Container>
                <br/>
                <p>{ t("views:consentManagement.modals.consentRevokeModal.message") }</p>
            </Modal.Content>
            <Modal.Actions>
                <Button className="link-button" onClick={ handleConsentRevokeModalClose }>
                    { t("common:cancel") }
                </Button>
                <Button primary onClick={ revokeConsent }>
                    { t("common:revoke") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
            <SettingsSection
                contentPadding={ false }
                header={ t("views:consentManagement.title") }
                description={ t("views:consentManagement.subTitle") }
                actionTitle={ t("views:consentManagement.actionTitles.empty") }
                actionDisabled={ true }
                showAction={ !(consentedApps && consentedApps.length && consentedApps.length > 0) }
            >
                <List divided verticalAlign="middle" className="main-content-inner">
                    {
                        isFetchConsentedAppsRequestLoading ?
                            createConsentedAppsListPlaceholder()
                            :
                            consentedApps && consentedApps.map((consent: ConsentInterface) => {
                                return (
                                    <List.Item className="inner-list-item" key={ consent.consentReceiptID }>
                                        <Grid padded>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 11 } className="first-column">
                                                    <List.Content verticalAlign="middle">
                                                        <ThemeIcon
                                                            icon={ GenericAppIcon }
                                                            size="mini"
                                                            bordered
                                                            defaultIcon
                                                            relaxed
                                                            rounded
                                                            spaced="right"
                                                            square
                                                            floated="left"
                                                        />
                                                        <List.Header>{ consent.spDisplayName }</List.Header>
                                                        <List.Description>
                                                            <p style={ { fontSize: "10px" } }>
                                                                { consent.consentReceiptID }
                                                            </p>
                                                        </List.Description>
                                                    </List.Content>
                                                </Grid.Column>
                                                <Grid.Column width={ 5 } className="last-column">
                                                    <List.Content floated="right">
                                                        <Icon
                                                            link
                                                            className="list-icon"
                                                            size="large"
                                                            name="pencil alternate"
                                                            onClick={ () => handleConsentEditClick(consent) }
                                                        />
                                                        <Button
                                                            basic
                                                            compact
                                                            color="red"
                                                            size="tiny"
                                                            onClick={ () => handleConsentRevokeClick(consent) }
                                                        >
                                                            { t("common:revoke") }
                                                        </Button>
                                                    </List.Content>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Item>
                                );
                            })
                    }
                </List>
                { editConsentModal }
                { consentRevokeModal }
            </SettingsSection>
        </>
    );
};
