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
import {
    Button,
    Card,
    Checkbox,
    Container,
    Divider,
    Image,
    Label,
    List,
    MenuItem,
    Modal,
    Tab
} from "semantic-ui-react";
import { getConsentReceipt, getConsents, revokeConsent } from "../actions";
import { InnerPageLayout } from "../layouts";
import { ConsentInterface, ConsentState, createEmptyConsent, createEmptyConsentReceipt } from "../models/consents";

/**
 * This is the Consents Page of the User Portal.
 */
export class ConsentsPage extends React.Component<any, any> {
    /**
     * constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            consents: [],
            editingConsent: createEmptyConsent(),
            consentReceipt: createEmptyConsentReceipt(),
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
     * @param e event
     * @param {any} activeIndex active tab index
     */
    public handleConsentTabChange = (e, { activeIndex }) => {
        this.setState({ activeIndex }, () => {
            const consentState: ConsentState = this.getConsentState(activeIndex);
            this.updateConsents(consentState);
        });
    }

    /**
     * Fetches the consents list from the API and updates the state.
     * @param {ConsentState} state consent state ex: ACTIVE, REVOKED
     */
    public updateConsents = (state: ConsentState) => {
        getConsents(state).then((response) => {
            this.setState({ consents: response });
        });
    }

    /**
     * Retrieves the consent state corresponding to the active
     * @param {number} tabIndex active tab index
     * @return {ConsentState} consent state ex: ACTIVE, REVOKED
     */
    public getConsentState = (tabIndex: number) => {
        let consentState = ConsentState.ACTIVE;
        switch (tabIndex) {
            case 0:
                consentState = ConsentState.ACTIVE;
                break;
            default:
                consentState = ConsentState.ACTIVE;
                break;
        }
        return consentState;
    }

    /**
     * Handles the consent edit button click. Retrieves the the receipt information
     * and stores it in the state and sets the current consent object as the editing
     * consent. And finally toggles the consent edit modal visibility.
     * @param {ConsentInterface} consent corresponding consent object
     */
    public handleConsentEditClick = (consent: ConsentInterface) => {
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
    public handleConsentRevokeClick = (consent: ConsentInterface) => {
        const { showConsentRevokeModal } = this.state;
        this.setState({
            editingConsent: consent,
            showConsentRevokeModal: !showConsentRevokeModal
        });
    }

    /**
     * Revokes the consent of an already consented application.
     */
    public revokeConsent = () => {
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
     * Handles the consent modal close action.
     */
    public handleConsentModalClose = () => {
        this.setState({ showConsentEditModal: false });
    }

    /**
     * Handles the consent revoke modal close action.
     */
    public handleConsentRevokeModalClose = () => {
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

        const paneContent = (
            <Card.Group>
                {consents
                    ? consents.map((consent, key) => (
                          <Card key={key}>
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
                                              Edit
                                          </Button>
                                          <Button
                                              basic
                                              color="red"
                                              onClick={() => this.handleConsentRevokeClick(consent)}
                                          >
                                              Revoke
                                          </Button>
                                      </div>
                                  </Card.Content>
                              ) : null}
                          </Card>
                      ))
                    : null}
            </Card.Group>
        );

        const tabPanes = [
            {
                menuItem: (
                    <MenuItem>
                        Active
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
                            <strong>State:</strong> {editingConsent.state}
                        </div>
                        <div>
                            <strong>Collection Method:</strong> {consentReceipt.collectionMethod}
                        </div>
                        <div>
                            <strong>Version: </strong>
                            {consentReceipt.version}
                        </div>
                        <div>
                            <strong>Description: </strong>
                            {editingConsent.spDescription}
                        </div>
                        <Divider />
                        <p style={{ textTransform: "uppercase", fontWeight: "bold", color: "#797979" }}>
                            Information that you've shared with the application
                        </p>
                        {consentReceipt &&
                            consentReceipt.services &&
                            consentReceipt.services.map(
                                (service) =>
                                    service &&
                                    service.purposes &&
                                    service.purposes.map((purpose) => {
                                        return (
                                            <>
                                                <strong style={{ textDecoration: "underline" }}>
                                                    {purpose.purpose}
                                                </strong>
                                                <List verticalAlign="middle">
                                                    {purpose.piiCategory &&
                                                        purpose.piiCategory.map((category, key) => (
                                                            <List.Item>
                                                                <List.Content floated="right">
                                                                    <Checkbox toggle />
                                                                </List.Content>
                                                                <List.Content>
                                                                    {category.piiCategoryDisplayName}
                                                                </List.Content>
                                                            </List.Item>
                                                        ))}
                                                </List>
                                            </>
                                        );
                                    })
                            )}
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary>Update</Button>
                    <Button secondary onClick={this.handleConsentModalClose}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        const consentRevokeModal = (
            <Modal size="mini" open={showConsentRevokeModal} onClose={this.handleConsentRevokeModalClose}>
                <Modal.Content>
                    <Container textAlign="center">
                        <h3>Revoke {editingConsent.spDisplayName}?</h3>
                    </Container>
                    <br />
                    <p style={{ fontSize: "12px" }}>
                        Are you sure you want to revoke this consent? This operation is not reversible.
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={this.handleConsentRevokeModalClose}>
                        Cancel
                    </Button>
                    <Button primary onClick={this.revokeConsent}>
                        Revoke
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        return (
            <InnerPageLayout
                pageTitle="Consent Management"
                pageDescription="Manage consented applications and websites"
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
