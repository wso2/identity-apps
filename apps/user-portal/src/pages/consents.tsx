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
    Divider,
    List,
    Modal,
    Placeholder,
} from "semantic-ui-react";
import {
    fetchConsentedApps,
    fetchConsentReceipt,
    hideConsentsEditView,
    hideConsentsRevokeModal,
    revokeConsentedApp,
    setConsentedAppsState,
    setEditingConsent,
    showConsentsEditView,
    showConsentsRevokeModal,
    updateConsentedClaim,
    updateRevokedClaimIds
} from "../actions";
import { Icon } from "../components/icon";
import { GenericAppIcon } from "../configs/ui";
import { AppState } from "../helpers/store";
import { InnerPageLayout } from "../layouts";
import {
    ConsentInterface,
    ConsentState,
    ServiceInterface
} from "../models/consents";

/**
 * This is the Consents Management Component of the User Portal.
 */
class ConsentManagementComponent extends React.Component<any, any> {

    /**
     * ComponentWillMount lifecycle method
     */
    componentWillMount() {
        const { actions } = this.props;
        // Set the default consent state which is `ACTIVE`.
        setConsentedAppsState(ConsentState.ACTIVE);
        // fetch the consents list from the API.
        actions.consentsManagement.fetchConsentedApps();
    }

    /**
     * Handles the consent edit button click. Retrieves the the receipt information
     * and stores it in the state and sets the current consent object as the editing
     * consent. And finally toggles the consent edit modal visibility.
     * @param {ConsentInterface} consent corresponding consent object
     */
    handleConsentEditClick = (consent: ConsentInterface): void => {
        const { actions } = this.props;
        actions.consentsManagement.fetchConsentReceipt(consent.consentReceiptID);
        actions.consentsManagement.setEditingConsent(consent);
        actions.consentsManagement.showConsentsEditView();
    };

    /**
     * Handles the consent revoke button click. Sets the current consent object as
     * the editing consent and toggles the visibility of the consent revoke modal.
     * @param {ConsentInterface} consent corresponding consent object
     */
    handleConsentRevokeClick = (consent: ConsentInterface): void => {
        const { actions } = this.props;
        actions.consentsManagement.setEditingConsent(consent);
        actions.consentsManagement.showConsentsRevokeModal();
    };

    /**
     * Revokes the consent of an already consented application.
     */
    revokeConsent = (): void => {
        const { actions, editingConsent } = this.props;
        actions.consentsManagement.revokeConsentedApp(editingConsent.consentReceiptID);
        actions.consentsManagement.hideConsentsRevokeModal();
        actions.consentsManagement.fetchConsentedApps();
    };

    /**
     * Handles the claims enable and disable toggles. If the toggle is checked and the
     * claim id is in the `revokedClaimIds` array in state, the id is taken out of the
     * `revokedClaimIds` array. And if the toggle is unchecked and the id is not in the
     * `revokedClaimIds` array, it is appended.
     * @param {React.ChangeEvent<HTMLInputElement>} e the toggle event
     * @param {number} id claim id
     */
    handleClaimsToggle = (e: React.ChangeEvent<HTMLInputElement>, { id }: { id: number }): void => {
        const { actions, revokedClaimIds } = this.props;
        const { checked } = e.target;

        let ids = [...revokedClaimIds];

        if (checked) {
            if (revokedClaimIds.includes(id)) {
                ids = revokedClaimIds.filter((claimId: number) => claimId !== id);
                actions.consentsManagement.updateRevokedClaimIds(ids);
            }
        } else {
            if (!revokedClaimIds.includes(id)) {
                ids = [...ids, id];
                actions.consentsManagement.updateRevokedClaimIds(ids);
            }
        }
    };

    /**
     * Handles the claims update button click action event. The revoked claims are taken
     * out of the existing receipt object and are passed on to the `updateConsentedClaims`
     * which executes the API request and updates the consented claims.
     */
    handleClaimsUpdateClick = (): void => {
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
            actions.consentsManagement.hideConsentsEditView();
            actions.consentsManagement.showConsentsRevokeModal();
        } else {
            actions.consentsManagement.updateConsentedClaim(receipt);
            actions.consentsManagement.hideConsentsEditView();
            actions.consentsManagement.fetchConsentedApps();
        }
    };

    /**
     * Handles the consent modal close action.
     */
    handleConsentModalClose = (): void => {
        const { actions } = this.props;
        actions.consentsManagement.hideConsentsEditView();
    };

    /**
     * Handles the consent revoke modal close action.
     */
    handleConsentRevokeModalClose = (): void => {
        const { actions } = this.props;
        actions.consentsManagement.hideConsentsRevokeModal();
    };

    /**
     * Generates an empty placeholder to be shown until the consented
     * application list is fetched from the API.
     *
     * @return {JSX.Element[]}
     */
    createConsentedAppsListPlaceholder = (): JSX.Element[] => {
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
    };

    render() {
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
                                <Icon
                                    icon={GenericAppIcon}
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
                                        { " "}
                                        { editingConsent.state }
                                    </div>
                                    <div className="meta">
                                        <strong>
                                            { t("views:consentManagement.modals.editConsentModal.description.version") }
                                            :
                                        </strong>
                                        { " "}
                                        { consentReceipt.version }
                                    </div>
                                    <div className="meta">
                                        <strong>
                                            { t("views:consentManagement.modals.editConsentModal.description" +
                                                ".collectionMethod") }:
                                        </strong>
                                        { " "}
                                        { consentReceipt.collectionMethod }
                                    </div>
                                    <div className="meta">
                                        <strong>
                                            { t("views:consentManagement.modals.editConsentModal.description" +
                                                ".description") }:
                                        </strong>
                                        { " "}
                                        { editingConsent.spDescription }
                                    </div>
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Modal.Content>
                <Divider fitted />
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
                    <Button secondary onClick={ this.handleConsentModalClose }>
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
                    <Button secondary onClick={ this.handleConsentRevokeModalClose }>
                        { t("common:cancel") }
                    </Button>
                    <Button primary onClick={ this.revokeConsent }>
                        { t("common:revoke") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        return (
            <InnerPageLayout
                pageTitle={ t("views:consentManagement.title") }
                pageDescription={ t("views:consentManagement.subTitle") }
            >
                <Container>
                    <h2>Active Applications</h2>
                    {
                        isFetchConsentedAppsRequestLoading ?
                            <Placeholder>
                                <Placeholder.Line length="long" />
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
                                            <Icon
                                                icon={GenericAppIcon}
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
                </Container>
            </InnerPageLayout>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    consentReceipt: state.consentsManagement.consentReceipt,
    consentedApps: state.consentsManagement.consentedApps,
    consentsManagementNotification: state.consentsManagement.consentsManagementNotification,
    editingConsent: state.consentsManagement.editingConsent,
    isConsentEditViewVisible: state.consentsManagement.isConsentEditViewVisible,
    isConsentRevokeModalVisible: state.consentsManagement.isConsentRevokeModalVisible,
    isFetchConsentedAppsRequestLoading: state.consentsManagement.isFetchConsentedAppsRequestLoading,
    revokedClaimIds: state.consentsManagement.revokedClaimIds
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    actions: {
        consentsManagement: (
            bindActionCreators(
                {
                    fetchConsentReceipt,
                    fetchConsentedApps,
                    hideConsentsEditView,
                    hideConsentsRevokeModal,
                    revokeConsentedApp,
                    setEditingConsent,
                    showConsentsEditView,
                    showConsentsRevokeModal,
                    updateConsentedClaim,
                    updateRevokedClaimIds
                }, dispatch
            )
        )
    }
});

export const ConsentsManagementPage = connect(
    mapStateToProps, mapDispatchToProps
)(withTranslation()(ConsentManagementComponent));
