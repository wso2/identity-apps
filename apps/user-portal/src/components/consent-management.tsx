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

import * as React from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import {
    Button,
    Checkbox,
    Container,
    Divider, Header,
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
 * Consent Management Component.
 */
class ConsentManagementComponentInner extends React.Component<any, any> {

    /**
     * componentDidMount lifecycle method
     */
    public componentDidMount() {
        const { actions } = this.props;
        // Set the default consent state which is `ACTIVE`.
        setConsentedAppsState(ConsentState.ACTIVE);
        // fetch the consents list from the API.
        actions.consentManagement.fetchConsentedApps();
    }

    /**
     * Handles the consent edit button click. Retrieves the the receipt information
     * and stores it in the state and sets the current consent object as the editing
     * consent. And finally toggles the consent edit modal visibility.
     * @param {ConsentInterface} consent corresponding consent object
     */
    public handleConsentEditClick = (consent: ConsentInterface): void => {
        const { actions } = this.props;
        actions.consentManagement.fetchConsentReceipt(consent.consentReceiptID);
        actions.consentManagement.setEditingConsent(consent);
        actions.consentManagement.showConsentEditView();
    }

    /**
     * Handles the consent revoke button click. Sets the current consent object as
     * the editing consent and toggles the visibility of the consent revoke modal.
     * @param {ConsentInterface} consent corresponding consent object
     */
    public handleConsentRevokeClick = (consent: ConsentInterface): void => {
        const { actions } = this.props;
        actions.consentManagement.setEditingConsent(consent);
        actions.consentManagement.showConsentRevokeModal();
    }

    /**
     * Revokes the consent of an already consented application.
     */
    public revokeConsent = (): void => {
        const { actions, editingConsent } = this.props;
        actions.consentManagement.revokeConsentedApp(editingConsent.consentReceiptID);
        actions.consentManagement.hideConsentRevokeModal();
        actions.consentManagement.fetchConsentedApps();
    }

    /**
     * Handles the claims enable and disable toggles. If the toggle is checked and the
     * claim id is in the `revokedClaimIds` array in state, the id is taken out of the
     * `revokedClaimIds` array. And if the toggle is unchecked and the id is not in the
     * `revokedClaimIds` array, it is appended.
     * @param {React.ChangeEvent<HTMLInputElement>} e the toggle event
     * @param {number} id claim id
     */
    public handleClaimsToggle = (e: React.ChangeEvent<HTMLInputElement>, { id }: { id: number }): void => {
        const { actions, revokedClaimIds } = this.props;
        const { checked } = e.target;

        let ids = [...revokedClaimIds];

        if (checked) {
            if (revokedClaimIds.includes(id)) {
                ids = revokedClaimIds.filter((claimId: number) => claimId !== id);
                actions.consentManagement.updateRevokedClaimIds(ids);
            }
        } else {
            if (!revokedClaimIds.includes(id)) {
                ids = [...ids, id];
                actions.consentManagement.updateRevokedClaimIds(ids);
            }
        }
    }

    /**
     * Handles the claims update button click action event. The revoked claims are taken
     * out of the existing receipt object and are passed on to the `updateConsentedClaims`
     * which executes the API request and updates the consented claims.
     */
    public handleClaimsUpdateClick = (): void => {
        const { actions, consentReceipt, revokedClaimIds } = this.props;
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
            actions.consentManagement.hideConsentEditView();
            actions.consentManagement.showConsentRevokeModal();
        } else {
            actions.consentManagement.updateConsentedClaim(receipt);
            actions.consentManagement.hideConsentEditView();
            actions.consentManagement.fetchConsentedApps();
        }
    }

    /**
     * Handles the consent modal close action.
     */
    public handleConsentModalClose = (): void => {
        const { actions } = this.props;
        actions.consentManagement.hideConsentEditView();
    }

    /**
     * Handles the consent revoke modal close action.
     */
    public handleConsentRevokeModalClose = (): void => {
        const { actions } = this.props;
        actions.consentManagement.hideConsentRevokeModal();
    }

    /**
     * Generates an empty placeholder to be shown until the consented
     * application list is fetched from the API.
     *
     * @return {JSX.Element[]}
     */
    public createConsentedAppsListPlaceholder = (): JSX.Element[] => {
        const placeholder = [];
        for (let i = 0; i < 3; i++) {
            placeholder.push(<List.Item key={ i }>
                <List.Content floated="right">
                    <Button size="mini" disabled>Configure</Button>
                    <Button negative size="mini" disabled>Revoke</Button>
                </List.Content>
                <Placeholder>
                    <Placeholder.Header image>
                        <Placeholder.Line/>
                        <Placeholder.Line/>
                    </Placeholder.Header>
                </Placeholder>
            </List.Item>);
        }
        return placeholder;
    }

    public render() {
        const {
            consentedApps,
            consentReceipt,
            editingConsent,
            isConsentEditViewVisible,
            isConsentRevokeModalVisible,
            isFetchConsentedAppsRequestLoading,
            t
        } = this.props;

        const editConsentModal = (
            <Modal open={ isConsentEditViewVisible } onClose={ this.handleConsentModalClose } size="tiny">
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
                                    relaxed
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
                                                                onChange={ this.handleClaimsToggle }
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
                    <Button onClick={ this.handleConsentModalClose }>
                        { t("common:cancel") }
                    </Button>
                    <Button primary onClick={ this.handleClaimsUpdateClick }>
                        { t("common:update") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        const consentRevokeModal = (
            <Modal size="mini" open={ isConsentRevokeModalVisible } onClose={ this.handleConsentRevokeModalClose }>
                <Modal.Content>
                    <Container textAlign="center">
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
                    <Button onClick={ this.handleConsentRevokeModalClose }>
                        { t("common:cancel") }
                    </Button>
                    <Button primary onClick={ this.revokeConsent }>
                        { t("common:revoke") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        return (
            <>
                <SettingsSection
                    header={ t("views:consentManagement.title") }
                    description={ t("views:consentManagement.description") }
                >
                    <Divider hidden/>
                {
                    isFetchConsentedAppsRequestLoading ?
                        <Placeholder>
                            <Placeholder.Line length="long"/>
                        </Placeholder>
                        :
                        <h4>You have granted consent for
                            { " " }
                            <strong>
                                { consentedApps && consentedApps.length ? consentedApps.length : 0 } applications
                            </strong>
                        </h4>
                }
                <Divider section/>
                <List divided verticalAlign="middle" size="big" relaxed="very">
                    {
                        isFetchConsentedAppsRequestLoading ?
                            this.createConsentedAppsListPlaceholder()
                            :
                            consentedApps.map((consent: ConsentInterface) => (
                                <List.Item key={ consent.consentReceiptID }>
                                    <List.Content floated="right">
                                        <Button
                                            size="mini"
                                            onClick={ () => this.handleConsentEditClick(consent) }
                                        >
                                            Configure
                                        </Button>
                                        <Button
                                            negative
                                            size="mini"
                                            onClick={ () => this.handleConsentRevokeClick(consent) }
                                        >
                                            Revoke
                                        </Button>
                                    </List.Content>
                                    <List.Content floated="left">
                                        <ThemeIcon
                                            icon={ GenericAppIcon }
                                            size="mini"
                                            defaultIcon
                                            square
                                            bordered
                                            rounded
                                            relaxed
                                        />
                                    </List.Content>
                                    <List.Content>
                                        <List.Header>{ consent.spDisplayName }</List.Header>
                                        <List.Description>
                                            <p style={ { fontSize: "10px" } }>{ consent.consentReceiptID }</p>
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            ))
                    }
                </List>
                { editConsentModal }
                { consentRevokeModal }
                </SettingsSection>
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    consentManagementNotification: state.consentManagement.consentManagementNotification,
    consentReceipt: state.consentManagement.consentReceipt,
    consentedApps: state.consentManagement.consentedApps,
    editingConsent: state.consentManagement.editingConsent,
    isConsentEditViewVisible: state.consentManagement.isConsentEditViewVisible,
    isConsentRevokeModalVisible: state.consentManagement.isConsentRevokeModalVisible,
    isFetchConsentedAppsRequestLoading: state.consentManagement.isFetchConsentedAppsRequestLoading,
    revokedClaimIds: state.consentManagement.revokedClaimIds
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    actions: {
        consentManagement: (
            bindActionCreators(
                {
                    fetchConsentReceipt,
                    fetchConsentedApps,
                    hideConsentEditView,
                    hideConsentRevokeModal,
                    revokeConsentedApp,
                    setEditingConsent,
                    showConsentEditView,
                    showConsentRevokeModal,
                    updateConsentedClaim,
                    updateRevokedClaimIds
                }, dispatch
            )
        )
    }
});

export const ConsentManagementComponent = connect(
    mapStateToProps, mapDispatchToProps
)(withTranslation()(ConsentManagementComponentInner));
