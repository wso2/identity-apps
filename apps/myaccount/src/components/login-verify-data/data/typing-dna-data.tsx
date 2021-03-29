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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface } from "@wso2is/core/models";
import { GenericIcon, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container, Grid, Icon, List, Modal } from "semantic-ui-react";
import { DeleteTypingPatterns, updateProfileInfo } from "../../../api";
import { getMFAIcons } from "../../../configs";
import { AppConstants, CommonConstants } from "../../../constants";
import { AlertInterface, AlertLevels, FeatureConfigInterface } from "../../../models";
import { EditSection, ThemeIcon } from "../../shared";
import { SettingsSection } from "../../shared";

/**
 * Prop types for the TypingDNA component.
 */
interface TypingDNAProps extends SBACInterface<FeatureConfigInterface> {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * TypingDNA Delete patterns section.
 *
 * @return {JSX.Element}
 */
export const TypingDNA: React.FunctionComponent<any> = (props): JSX.Element => {
    const { t } = useTranslation();
    const [isRevokeClearTypingPatternsModalVisible,setRevokeClearTypingPatternsModalVisible] = useState(false);
    const { onAlertFired, featureConfig } = props;


    const handleClearTypingPatternsClick = () => {
        setRevokeClearTypingPatternsModalVisible(true);
    };

    const handleClearTypingPatternsModalClose = () => {
        setRevokeClearTypingPatternsModalVisible(false);
    };

    const handleClearTypingPatterns = () => {
            DeleteTypingPatterns()
                .then(() => {
                    onAlertFired({
                        description: t(
                            "myAccount:components.loginVerifyData.notifications.clearTypingPatterns.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "myAccount:components.loginVerifyData.notifications.clearTypingPatterns.success.message"
                        )
                    });
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.detail) {
                        onAlertFired({
                            description: t(
                                "myAccount:components.userSessions.notifications.revokeUserSession.error.description",
                                { description: error.response.data.detail }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "myAccount:components.userSessions.notifications.revokeUserSession.error.message"
                            )
                        });
                    } else {
                        onAlertFired({
                            description: t(
                                "myAccount:components.loginVerifyData.notifications.clearTypingPatterns.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "myAccount:components.loginVerifyData.notifications.clearTypingPatterns.error.message"
                            )
                        });
                    }
                })
                .finally(() => {
                    setRevokeClearTypingPatternsModalVisible(false);
                });
        };


    const ClearTypingPatternsModal = (
            <Modal
                size="mini"
                open={ isRevokeClearTypingPatternsModalVisible }
                onClose={ handleClearTypingPatternsModalClose }
                dimmer="blurring"
            >
                <Modal.Content>
                    <Container>
                        <h3>{t("myAccount:components.loginVerifyData.modals.clearTypingPatternsModal.heading")}</h3>
                    </Container>
                    <br/>
                    <p>{ t("myAccount:components.loginVerifyData.modals.clearTypingPatternsModal.message")}
                    { <a href='https://www.typingdna.com/'>TypingDNA</a> }{ ". Do you wish to continue?" } </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button className="link-button" onClick={ handleClearTypingPatternsModalClose }>
                        {t("common:cancel")}
                    </Button>
                    <Button primary={ true } onClick={ handleClearTypingPatterns }>
                        {t("common:Clear")}
                    </Button>
                </Modal.Actions>
            </Modal>
        );

    const showEditView = () => {

        return (
            <>
            <Grid padded={ true }>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 11 } className="first-column">
                        <List.Content floated="left">
                            <GenericIcon
                                icon={ getMFAIcons().keyboard }
                                size="mini"
                                twoTone={ true }
                                transparent={ true }
                                square={ true }
                                rounded={ true }
                                relaxed={ true }
                            />
                        </List.Content>
                        <List.Content>
                            <List.Header>
                                {t("myAccount:components.loginVerifyData.typingdna.heading")}
                            </List.Header>
                            <List.Description>
                                {t("myAccount:components.loginVerifyData.typingdna.description")}
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width={ 5 } className="last-column">
                        <List.Content floated="right">
                            <Icon
                                link={ true }
                                onClick={ handleClearTypingPatternsClick }
                                className="list-icon"
                                color="grey"
                                name="eraser"
                            />
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { ClearTypingPatternsModal }
            </>
        );
    };

    return <div>{ showEditView() }</div>;
};
