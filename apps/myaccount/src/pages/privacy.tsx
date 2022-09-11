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

import { PageLayout } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid, Header, List } from "semantic-ui-react";

/**
 * Privacy page.
 *
 * @returns Privacy page component.
 */
const PrivacyPage = (): ReactElement => {

    const { t } = useTranslation();

    return (
        <PageLayout
            pageTitle="Privacy"
            title={ t("myAccount:pages.privacy.title") }
        >
            <Grid>
                { /* About WSO2 Identity Server */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Header as="h4">{ t("myAccount:components.privacy.about.heading") }</Header>
                        <p>{ t("myAccount:components.privacy.about.description") }</p>
                    </Grid.Column>
                </Grid.Row>

                { /* Privacy Policy */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Header as="h2">{ t("myAccount:components.privacy.privacyPolicy.heading") }</Header>
                        <p>{ t("myAccount:components.privacy.privacyPolicy.description.para1") }</p>
                        <p>
                            { /*Trans component had to be used over the useTranslation
                            hook to support inline links. */ }
                            <Trans i18nKey="myAccount:components.privacy.privacyPolicy.description.para2">
                                Please note that this policy is for reference only, and is applicable for the software
                                as a product. WSO2 Inc. and its developers have no access to the information held within
                                WSO2 IS. Please see the <a href="#disclaimer">disclaimer</a> section for more
                                information.
                            </Trans>
                        </p>
                        <p>{ t("myAccount:components.privacy.privacyPolicy.description.para3") }</p>
                    </Grid.Column>
                </Grid.Row>

                { /* What is personal information? */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Header as="h3">
                            { t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo.heading") }
                        </Header>
                        <p>{ t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo.description.para1") }</p>
                        <List bulleted>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo." +
                                        "description.list1.0")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo." +
                                    "description.list1.1")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo." +
                                        "description.list1.2")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo." +
                                        "description.list1.3")
                                }
                            </List.Item>
                        </List>
                        <p>
                            { /*Trans component had to be used over the useTranslation hook to support bold text. */ }
                            <Trans
                                i18nKey="myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo
                                .description.para2"
                            >
                                However, WSO2 IS also collects the following information that is not considered
                                personal information, but is used only for <strong>statistical</strong> purposes.
                                The reason for this is that this information can not be used to track you.
                            </Trans>
                        </p>
                        <List bulleted>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo." +
                                        "description.list2.0")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo" +
                                        ".description.list2.1")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo." +
                                        "description.list2.2")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.whatIsPersonalInfo." +
                                        "description.list2.3")
                                }
                            </List.Item>
                        </List>
                    </Grid.Column>
                </Grid.Row>

                { /* Collection of personal information */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Header as="h3">
                            { t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo.heading") }
                        </Header>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                    "description.para1")
                            }
                        </p>
                        <List bulleted>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                        "description.list1.0")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                        "description.list1.1")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                        "description.list1.2")
                                }
                            </List.Item>
                        </List>

                        { /* Tracking Technologies */ }
                        <Header as="h4">
                            {
                                t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                "trackingTechnologies.heading")
                            }
                        </Header>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                "trackingTechnologies.description.para1")
                            }
                        </p>
                        <List bulleted>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                        "trackingTechnologies.description.list1.0")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                        "trackingTechnologies.description.list1.1")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                        "trackingTechnologies.description.list1.2")
                                }
                            </List.Item>
                            { // TODO: Discuss adding a cookie-policy page
                                /* <List.Item>
                                { t("myAccount:components.privacy.privacyPolicy.collectionOfPersonalInfo." +
                                    "trackingTechnologies.description.list1.3") }
                            </List.Item> */ }
                        </List>
                    </Grid.Column>
                </Grid.Row>

                { /* Use of personal information */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Header as="h3">
                            { t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo.heading") }
                        </Header>
                        <p>
                            { t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                "description.para1") }
                        </p>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                    "description.para2")
                            }
                        </p>
                        <List bulleted>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                        "description.list1.0")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                        "description.list1.1")
                                }
                                <List.List>
                                    {
                                        t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                            "description.subList1.heading")
                                    }
                                    <List.List>
                                        <List.Item>
                                            {
                                                t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                                "description.subList1.list.0")
                                            }
                                        </List.Item>
                                        <List.Item>
                                            {
                                                t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                                "description.subList1.list.1")
                                            }
                                        </List.Item>
                                        <List.Item>
                                            {
                                                t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                                "description.subList1.list.2")
                                            }
                                        </List.Item>
                                    </List.List>
                                </List.List>
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                        "description.list1.2")
                                }
                                <List.List>
                                    {
                                        t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo.description." +
                                        "subList2.heading")
                                    }
                                    <List.List>
                                        <List.Item>
                                            {
                                                t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                                "description.subList2.list.0")
                                            }
                                        </List.Item>
                                        <List.Item>
                                            {
                                                t("myAccount:components.privacy.privacyPolicy.useOfPersonalInfo." +
                                                "description.subList2.list.1")
                                            }
                                        </List.Item>
                                    </List.List>
                                </List.List>
                            </List.Item>
                        </List>
                    </Grid.Column>
                </Grid.Row>

                { /* Disclosure of personal information */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Header as="h3">
                            { t("myAccount:components.privacy.privacyPolicy.disclosureOfPersonalInfo.heading") }
                        </Header>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.disclosureOfPersonalInfo.description")
                            }
                        </p>

                        { /* Legal process */ }
                        <Header as="h4">
                            {
                                t("myAccount:components.privacy.privacyPolicy.disclosureOfPersonalInfo." +
                                "legalProcess.heading")
                            }
                        </Header>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.disclosureOfPersonalInfo." +
                                    "legalProcess.description")
                            }
                        </p>
                    </Grid.Column>
                </Grid.Row>

                { /* Storage of personal information */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Header as="h3">
                            { t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.heading") }
                        </Header>

                        { /* Where your personal information is stored */ }
                        <Header as="h4">
                            { t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.where.heading") }
                        </Header>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.where." +
                                    "description.para1")
                            }
                        </p>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.where." +
                                    "description.para2")
                            }
                        </p>

                        { /* How long your personal information is retained */ }
                        <Header as="h4">
                            { t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.howLong.heading") }
                        </Header>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.howLong." +
                                    "description.para1")
                            }
                        </p>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.howLong." +
                                    "description.para2")
                            }
                        </p>
                        <List bulleted>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.howLong." +
                                    "description.list1.0")
                                }
                            </List.Item>
                            <List.Item>
                                {
                                    t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo.howLong." +
                                    "description.list1.1")
                                }
                            </List.Item>
                        </List>

                        { /* How to request removal of your personal information */ }
                        <Header as="h4">
                            {
                                t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo." +
                                "requestRemoval.heading")
                            }
                        </Header>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo." +
                                    "requestRemoval.description.para1")
                            }
                        </p>
                        <p>
                            {
                                t("myAccount:components.privacy.privacyPolicy.storageOfPersonalInfo." +
                                    "requestRemoval.description.para2")
                            }
                        </p>
                    </Grid.Column>
                </Grid.Row>

                { /* More information */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Header as="h3">
                            { t("myAccount:components.privacy.privacyPolicy.moreInfo.heading") }
                        </Header>

                        { /* Changes to this policy */ }
                        <Header as="h4">
                            { t("myAccount:components.privacy.privacyPolicy.moreInfo.changesToPolicy.heading") }
                        </Header>
                        <p>{
                            t("myAccount:components.privacy.privacyPolicy.moreInfo.changesToPolicy.description.para1")
                        }</p>
                        <p>{
                            t("myAccount:components.privacy.privacyPolicy.moreInfo.changesToPolicy.description.para2")
                        }</p>

                        { /* Your choices */ }
                        <Header as="h4">
                            { t("myAccount:components.privacy.privacyPolicy.moreInfo.yourChoices.heading") }
                        </Header>
                        <p>{
                            t("myAccount:components.privacy.privacyPolicy.moreInfo.yourChoices.description.para1")
                        }</p>
                        <p>{
                            t("myAccount:components.privacy.privacyPolicy.moreInfo.yourChoices.description.para2")
                        }</p>

                        { /* Contact us */ }
                        <Header as="h4">
                            { t("myAccount:components.privacy.privacyPolicy.moreInfo.contactUs.heading") }
                        </Header>
                        <p>{ t("myAccount:components.privacy.privacyPolicy.moreInfo.contactUs.description.para1") }</p>
                        <a href="https://wso2.com/contact/" rel="noopener noreferrer" target="_blank">
                            https://wso2.com/contact/
                        </a>
                    </Grid.Column>
                </Grid.Row>

                { /* Disclaimer */ }
                <Grid.Row columns={ 1 } id="disclaimer">
                    <Grid.Column width={ 16 }>
                        <Header as="h2">
                            { t("myAccount:components.privacy.privacyPolicy.disclaimer.heading") }
                        </Header>
                        <List ordered>
                            <List.Item>
                                { t("myAccount:components.privacy.privacyPolicy.disclaimer.description.list1.0") }
                            </List.Item>
                            <br />
                            <List.Item>
                                { t("myAccount:components.privacy.privacyPolicy.disclaimer.description.list1.1") }
                            </List.Item>
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default PrivacyPage;
