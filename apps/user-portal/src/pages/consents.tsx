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
import { getConsents, getConsentReceipt } from "../actions/consents";
import { InnerPageLayout } from "../layouts";
import { ConsentState, ConsentInterface } from "../models/consents";
import { Container, Tab, Button, Card, Image, MenuItem, Label, Modal, Divider, Checkbox, Grid } from 'semantic-ui-react'

export class ConsentsPage extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            consents: [],
            editingConsent: {},
            consentReceipt: {},
            showConsentEditModal: false,
            showConsentRevokeModal: false
        }
    }

    public componentWillMount() {
        getConsents(ConsentState.ACTIVE)
            .then((response) => {
                this.setState({ consents: response });
            }
            );
    }

    handleConsentTabChange = (e, { activeIndex }) => {
        this.setState({ activeIndex }, () => {
            let consentState = ConsentState.ACTIVE;
            switch (activeIndex) {
                case 0:
                    consentState = ConsentState.ACTIVE;
                    break;
                case 1:
                    consentState = ConsentState.REVOKED;
                    break;
                default:
                    consentState = ConsentState.ACTIVE;
                    break;
            }

            getConsents(consentState)
                .then((response) => {
                    this.setState({ consents: response });
                }
                );
        });
    }

    handleConsentEditClick = (consent: ConsentInterface) => {
        const { showConsentEditModal } = this.state;
        getConsentReceipt(consent.consentReceiptID)
            .then((response) => {
                this.setState({
                    consentReceipt: response,
                    editingConsent: consent,
                    showConsentEditModal: !showConsentEditModal
                })
            })
    }

    handleConsentRevokeClick = (consent: ConsentInterface) => {
        const { showConsentRevokeModal } = this.state;
        this.setState({
            editingConsent: consent,
            showConsentRevokeModal: !showConsentRevokeModal
        })
    }

    handleConsentModalClose = () => {
        this.setState({ showConsentEditModal: false });
    }

    handleConsentRevokeModalClose = () => {
        this.setState({ showConsentRevokeModal: false });
    }

    render() {

        const { consents, activeIndex, editingConsent, consentReceipt, showConsentEditModal, showConsentRevokeModal } = this.state;

        const paneContent = (
            <Card.Group>
                {
                    consents ? consents.map((consent, key) => (
                        <Card key={key}>
                            <Card.Content>
                                <Image floated="left" size="tiny" src="https://react.semantic-ui.com/images/wireframe/image.png" />
                                <Card.Header>{consent.spDisplayName}</Card.Header>
                            </Card.Content>
                            {
                                activeIndex === 0 ?
                                    <Card.Content extra>
                                        <div className="ui two buttons">
                                            <Button basic color="green" onClick={() => this.handleConsentEditClick(consent)}>Edit</Button>
                                            <Button basic color="red" onClick={() => this.handleConsentRevokeClick(consent)}>Revoke</Button>
                                        </div>
                                    </Card.Content> : null
                            }
                        </Card>
                    )) : null
                }
            </Card.Group>
        )

        const tabPanes = [
            {
                menuItem: (
                    <MenuItem>
                        Active
                        {
                            activeIndex === 0 ?
                                (
                                    <Label circular color="green">
                                        {consents ? consents.length : 0}
                                    </Label>
                                ) : null
                        }
                    </MenuItem>
                ),
                render: () => <Tab.Pane attached="bottom">{paneContent}</Tab.Pane>

            },
            {
                menuItem: (
                    <MenuItem>
                        Revoked
                        {
                            activeIndex === 1 ?
                                (
                                    <Label circular color="red">
                                        {consents ? consents.length : 0}
                                    </Label>
                                ) : null
                        }
                    </MenuItem>
                ),
                render: () => <Tab.Pane attached="bottom">{paneContent}</Tab.Pane>
            },
        ]

        const EditConsentModal = (
            <Modal open={showConsentEditModal} onClose={this.handleConsentModalClose} size="tiny">
                <Modal.Header>
                    <Image floated="left" size="mini" src="https://react.semantic-ui.com/images/wireframe/image.png" />
                    {editingConsent.spDisplayName} ({editingConsent.state})
                </Modal.Header>
                <Modal.Content scrolling>
                    <Modal.Description>
                        <div><strong>State:</strong> {editingConsent.state}</div>
                        <div><strong>Collection Method:</strong> {consentReceipt.collectionMethod}</div>
                        <div><strong>Version: </strong>{consentReceipt.version}</div>
                        <div><strong>Description: </strong>{editingConsent.spDescription}</div>
                        <Divider />
                        <p style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                            Deselect consents that you wish to revoke
                        </p>
                        {
                            consentReceipt && consentReceipt.services && consentReceipt.services.map(service => (
                                service && service.purposes && service.purposes.map((purpose) => {
                                    return (
                                        <React.Fragment>
                                            <div style={{ textDecoration: "underline" }}>{purpose.purpose}</div>
                                            {
                                                purpose.piiCategory && purpose.piiCategory.map((category, key) => (
                                                    <Grid key={key}>
                                                        <Grid.Column floated='left' width={5}>
                                                            <div style={{ marginTop: "10px" }}>
                                                                {category.piiCategoryDisplayName}
                                                            </div>
                                                        </Grid.Column>
                                                        <Grid.Column floated='right' width={3}>
                                                            <Checkbox toggle checked={true} disabled />
                                                        </Grid.Column>
                                                    </Grid>
                                                ))
                                            }
                                        </React.Fragment>
                                    );
                                })
                            ))
                        }
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary disabled>Update</Button>
                    <Button secondary onClick={this.handleConsentModalClose}>Cancel</Button>
                </Modal.Actions>
            </Modal >
        )

        const consentRevokeModal = (
            <Modal size="mini" open={showConsentRevokeModal} onClose={this.handleConsentRevokeModalClose}>
                <Modal.Content>
                    <Container textAlign="center"><h3>Revoke {editingConsent.spDisplayName}?</h3></Container>
                    <br />
                    <p style={{ fontSize: "12px" }}>Are you sure you want to revoke this consent? This operation is not reversible.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={this.handleConsentRevokeModalClose}>Cancel</Button>
                    <Button primary disabled>Revoke</Button>
                </Modal.Actions>
            </Modal>
        )

        return (
            <InnerPageLayout
                pageTitle="Consents"
                pageDescription="Manage consented applications"
            >
                <Container>
                    <Tab panes={tabPanes} activeIndex={activeIndex} onTabChange={this.handleConsentTabChange} menu={{ attached: "top" }} />
                    {EditConsentModal}
                    {consentRevokeModal}
                </Container>
            </InnerPageLayout>
        );
    }
}
