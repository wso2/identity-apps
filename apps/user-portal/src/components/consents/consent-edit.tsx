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

import React, { FunctionComponent, MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, Label, List } from "semantic-ui-react";
import { ConsentInterface, ConsentReceiptInterface, PIICategory, ServiceInterface } from "../../models";
import { EditSection } from "../shared";

/**
 * Proptypes for the application consent edit component.
 */
interface EditConsentProps {
    editingConsent: ConsentInterface;
    onClaimUpdateClick: () => void;
    onEditViewCloseClick: () => void;
    state: string;
    spDescription: string;
    services: ServiceInterface[];
    revokePIICategory: (category: PIICategory) => void;
    undoRevokePIICategory: (e: MouseEvent<HTMLButtonElement>, element: HTMLButtonElement) => void;
    revokedPIICatList: number[];
}

/**
 * Application consent edit component.
 *
 * @param {EditConsentProps} props - Props injected to the application consent edit component.
 * @return {JSX.Element}
 */
export const AppConsentEdit: FunctionComponent<EditConsentProps> = (
    props: EditConsentProps
): JSX.Element => {

    const {
        onClaimUpdateClick,
        onEditViewCloseClick,
        state,
        spDescription,
        revokePIICategory,
        revokedPIICatList,
        undoRevokePIICategory,
        services
    } = props;
    const { t } = useTranslation();

    return (
        <EditSection>
            <Grid>
                <Grid.Column width={ 8 }>
                <List>
                    <List.Item className="inner-list-item">
                        <List.Content>
                            <List.Description>
                                <div className="meta">
                                    <strong>
                                        {
                                            t("views:components.consentManagement.modals." +
                                                "editConsentModal.description.state")
                                        }
                                        :
                                    </strong>
                                    { " " }
                                    <Label circular color="green" empty/>
                                    { state }
                                </div>
                                <div className="meta">
                                    <strong>
                                        {
                                            t("views:components.consentManagement.modals.editConsentModal." +
                                                "description.description")
                                        }:
                                    </strong>
                                    { " " }
                                    { spDescription }
                                </div>
                            </List.Description>
                        </List.Content>
                    </List.Item>
                    <br/>
                    <List.Item className="inner-list-item">
                        <p>
                            <strong>
                                {
                                    t("views:components.consentManagement.modals.editConsentModal." +
                                        "description.piiCategoryHeading")
                                }:
                            </strong>
                        </p>
                        {
                            services.map((service) =>
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
                                                            {
                                                                revokedPIICatList && revokedPIICatList
                                                                    .includes(category.piiCategoryId) ? (
                                                                    <Button
                                                                        id={ category.piiCategoryId }
                                                                        icon
                                                                        basic
                                                                        size="mini"
                                                                        labelPosition="right"
                                                                        onClick={ undoRevokePIICategory }
                                                                    >
                                                                        <Icon name="undo"/>
                                                                        revoked
                                                                    </Button>
                                                                ) : (
                                                                    <Icon
                                                                        id={ category.piiCategoryId }
                                                                        link={ true }
                                                                        className="list-icon"
                                                                        size="large"
                                                                        color="red"
                                                                        name="trash alternate outline"
                                                                        onClick={ () => revokePIICategory(category) }
                                                                    />
                                                                )
                                                            }
                                                        </List.Content>
                                                        <List.Content>
                                                            { category.piiCategoryDisplayName }
                                                        </List.Content>
                                                    </List.Item>
                                                )) }
                                            </List>
                                        </div>
                                    );
                                }))
                        }
                    </List.Item>
                    <br/>
                    <List.Item className="inner-list-item">
                        <Button
                            primary
                            onClick={ onClaimUpdateClick }
                        >
                            { t("common:update") }
                        </Button>
                        <Button
                            className="link-button"
                            onClick={ onEditViewCloseClick }
                        >
                            { t("common:cancel") }
                        </Button>
                    </List.Item>
                </List>
                </Grid.Column>
            </Grid>
            <br/>
        </EditSection>
    );
};
