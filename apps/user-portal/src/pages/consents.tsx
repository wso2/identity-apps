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
import {
    Button,
    Card,
    Checkbox,
    Container,
    Divider,
    Header,
    Icon,
    Image,
    Label,
    List,
    MenuItem,
    Modal,
    Segment,
    Tab
} from "semantic-ui-react";
import { getConsentReceipt, getConsents, revokeConsent, updateConsentedClaims } from "../actions";
import { InnerPageLayout } from "../layouts";
import {
    ConsentInterface,
    ConsentState,
    createEmptyConsent,
    createEmptyConsentReceipt,
    ServiceInterface
} from "../models/consents";

/**
 * This is the Consents Management Component of the User Portal.
 */
class ConsentManagementComponent extends React.Component<any, any> {
    /**
     * constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            consentReceipt: createEmptyConsentReceipt(),
            consents: [],
            editingConsent: createEmptyConsent(),
            revokedClaimIds: [],
            showConsentEditModal: false,
            showConsentRevokeModal: false
        };
    }

    public componentWillMount() {
        this.updateConsents(ConsentState.ACTIVE);
    }

    /**
     * Handles the tab onclick event. The active tab index is also
     * stored in the state and the list of consents is updated
     * according to the selected tab.
     * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e the tab change event
     * @param {number} activeIndex active tab index
     */
    public handleConsentTabChange = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        { activeIndex }: { activeIndex: number }
    ): void => {
        this.setState({ activeIndex }, () => {
            const consentState: ConsentState = this.getConsentState(activeIndex);
            this.updateConsents(consentState);
        });
    }

    /**
     * Fetches the consents list from the API and updates the state.
     * @param {ConsentState} state consent state ex: ACTIVE, REVOKED
     */
    public updateConsents = (state: ConsentState): void => {
        getConsents(state).then((response) => {
            this.setState({ consents: response });
        });
    }

    /**
     * Retrieves the consent state corresponding to the active tab.
     * @param {number} tabIndex active tab index
     * @return {ConsentState} consent state ex: ACTIVE, REVOKED
     */
    public getConsentState = (tabIndex: number): ConsentState => {
        // Currently only ACTIVE state apps are displayed.
        return ConsentState.ACTIVE;
    }

    /**
     * Handles the consent edit button click. Retrieves the the receipt information
     * and stores it in the state and sets the current consent object as the editing
     * consent. And finally toggles the consent edit modal visibility.
     * @param {ConsentInterface} consent corresponding consent object
     */
    public handleConsentEditClick = (consent: ConsentInterface): void => {
        const { showConsentEditModal } = this.state;
        getConsentReceipt(consent.consentReceiptID).then((response) => {
            this.setState({
                consentReceipt: response,
                editingConsent: consent,
                showConsentEditModal: !showConsentEditModal
            });
        });
    }

    /**
     * Handles the consent revoke button click. Sets the current consent object as
     * the editing consent and toggles the visibility of the consent revoke modal.
     * @param {ConsentInterface} consent corresponding consent object
     */
    public handleConsentRevokeClick = (consent: ConsentInterface): void => {
        const { showConsentRevokeModal } = this.state;
        this.setState({
            editingConsent: consent,
            showConsentRevokeModal: !showConsentRevokeModal
        });
    }

    /**
     * Revokes the consent of an already consented application.
     */
    public revokeConsent = (): void => {
        const { editingConsent, activeIndex } = this.state;
        revokeConsent(editingConsent.consentReceiptID).then((response) => {
            const consentState: ConsentState = this.getConsentState(activeIndex);
            this.updateConsents(consentState);
            this.setState({
                showConsentRevokeModal: false
            });
        });
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
        const { revokedClaimIds } = this.state;
        const { checked } = e.target;

        if (checked) {
            if (revokedClaimIds.includes(id)) {
                this.setState({ revokedClaimIds: revokedClaimIds.filter((claimId: number) => claimId !== id) });
            }
        } else {
            if (!revokedClaimIds.includes(id)) {
                this.setState({ revokedClaimIds: [...revokedClaimIds, id] });
            }
        }
    }

    /**
     * Handles the claims update button click action event. The revoked claims are taken
     * out of the existing receipt object and are passed on to the `updateConsentedClaims`
     * which executes the API request and updates the consented claims.
     */
    public handleClaimsUpdateClick = (): void => {
        const { consentReceipt, revokedClaimIds, activeIndex } = this.state;
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
            this.setState({ showConsentEditModal: false, showConsentRevokeModal: true });
        } else {
            const consentState: ConsentState = this.getConsentState(activeIndex);
            // Update the claims.
            updateConsentedClaims(receipt).then((response) => {
                // Re-fetch the consents list and hide the consent edit modal.
                this.updateConsents(consentState);
                this.setState({
                    showConsentEditModal: false
                });
            });
        }
    }

    /**
     * Handles the consent modal close action.
     */
    public handleConsentModalClose = (): void => {
        this.setState({ showConsentEditModal: false });
    }

    /**
     * Handles the consent revoke modal close action.
     */
    public handleConsentRevokeModalClose = (): void => {
        this.setState({ showConsentRevokeModal: false });
    }

    public render() {
        const {
            consents,
            activeIndex,
            editingConsent,
            consentReceipt,
            showConsentEditModal,
            showConsentRevokeModal
        } = this.state;

        const { t } = this.props;

        const paneContent = (
            <>
                {consents && consents.length > 0 ? (
                    <Card.Group>
                        {consents.map((consent: ConsentInterface) => (
                            <Card key={consent.consentReceiptID}>
                                <Card.Content>
                                    <Image
                                        floated="left"
                                        size="tiny"
                                        src="https://react.semantic-ui.com/images/wireframe/image.png"
                                    />
                                    <Card.Header>{consent.spDisplayName}</Card.Header>
                                </Card.Content>
                                {activeIndex === 0 ? (
                                    <Card.Content extra>
                                        <div className="ui two buttons">
                                            <Button
                                                basic
                                                color="green"
                                                onClick={() => this.handleConsentEditClick(consent)}
                                            >
                                                {t("common:edit")}
                                            </Button>
                                            <Button
                                                basic
                                                color="red"
                                                onClick={() => this.handleConsentRevokeClick(consent)}
                                            >
                                                {t("common:revoke")}
                                            </Button>
                                        </div>
                                    </Card.Content>
                                ) : null}
                            </Card>
                        ))}
                    </Card.Group>
                ) : (
                    <Segment placeholder>
                        <Header icon>
                            <Icon name="folder open outline" />
                            {
                                t(
                                    "views:consentManagement.placeholders.emptyConsentList.heading",
                                    { state: this.getConsentState(activeIndex).toLowerCase() }
                                )
                            }
                        </Header>
                    </Segment>
                )}
            </>
        );

        const tabPanes = [
            {
                menuItem: (
                    <MenuItem key={0}>
                        {t("common:active")}
                        {activeIndex === 0 ? (
                            <Label circular color="green">
                                {consents ? consents.length : 0}
                            </Label>
                        ) : null}
                    </MenuItem>
                ),
                render: () => <Tab.Pane attached="bottom">{paneContent}</Tab.Pane>
            }
        ];

        const EditConsentModal = (
            <Modal open={showConsentEditModal} onClose={this.handleConsentModalClose} size="tiny">
                <Modal.Header>
                    <Image floated="left" size="mini" src="https://react.semantic-ui.com/images/wireframe/image.png" />
                    {editingConsent.spDisplayName}
                </Modal.Header>
                <Modal.Content scrolling>
                    <Modal.Description>
                        <div>
                            <strong>
                                {t("views:consentManagement.modals.EditConsentModal.description.state")}:
                            </strong>
                            {editingConsent.state}
                        </div>
                        <div>
                            <strong>
                                {t("views:consentManagement.modals.EditConsentModal.description.collectionMethod")}:
                            </strong>
                            {consentReceipt.collectionMethod}
                        </div>
                        <div>
                            <strong>
                                {t("views:consentManagement.modals.EditConsentModal.description.version")}:
                            </strong>
                            {consentReceipt.version}
                        </div>
                        <div>
                            <strong>
                                {t("views:consentManagement.modals.EditConsentModal.description.description")}:
                            </strong>
                            {editingConsent.spDescription}
                        </div>
                        <Divider />
                        <p>
                            <strong>
                                {t("views:consentManagement.modals.EditConsentModal.description.subHeading1")}:
                            </strong>
                        </p>
                        {consentReceipt &&
                        consentReceipt.services &&
                        consentReceipt.services.map(
                            (service: ServiceInterface) =>
                                service &&
                                service.purposes &&
                                service.purposes.map((purpose) => {
                                    return (
                                        <div key={purpose.purposeId}>
                                            <strong>{purpose.purpose}</strong>
                                            <List verticalAlign="middle">
                                                {purpose.piiCategory &&
                                                purpose.piiCategory.map((category) => (
                                                    <List.Item key={category.piiCategoryId}>
                                                        <List.Content floated="right">
                                                            <Checkbox
                                                                id={category.piiCategoryId}
                                                                toggle
                                                                defaultChecked
                                                                onChange={this.handleClaimsToggle}
                                                            />
                                                        </List.Content>
                                                        <List.Content>
                                                            {category.piiCategoryDisplayName}
                                                        </List.Content>
                                                    </List.Item>
                                                ))}
                                            </List>
                                        </div>
                                    );
                                })
                        )}
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={this.handleConsentModalClose}>
                        {t("common:cancel")}
                    </Button>
                    <Button primary onClick={this.handleClaimsUpdateClick}>
                        {t("common:update")}
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        const consentRevokeModal = (
            <Modal size="mini" open={showConsentRevokeModal} onClose={this.handleConsentRevokeModalClose}>
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
                    <br />
                    <p>{t("views:consentManagement.modals.consentRevokeModal.message")}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={this.handleConsentRevokeModalClose}>
                        {t("common:cancel")}
                    </Button>
                    <Button primary onClick={this.revokeConsent}>
                        {t("common:revoke")}
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        return (
            <InnerPageLayout
                pageTitle={t("views:consentManagement.title")}
                pageDescription={t("views:consentManagement.subTitle")}
            >
                <Container>
                    <Tab
                        panes={tabPanes}
                        activeIndex={activeIndex}
                        onTabChange={this.handleConsentTabChange}
                        menu={{ attached: "top" }}
                    />
                    {EditConsentModal}
                    {consentRevokeModal}
                </Container>
            </InnerPageLayout>
        );
    }
}

export default withTranslation()(ConsentManagementComponent);
