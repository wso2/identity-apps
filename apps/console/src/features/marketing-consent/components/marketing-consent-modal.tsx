/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { AppState } from "../../../features/core";
import { updateUserConsent } from "../api";
import { getMarketingConsentIllustrations } from "../configs";
import { setMarketingConsentStatusToLocalStorage } from "../utils";

/**
 * Proptypes for the Marketing consent modal component.
 */
interface MarketingConsentModalPropTypes extends IdentifiableComponentInterface {
    /**
     * Is the modal is open.
     */
    isOpen: boolean;
    /**
     * Callback to close the modal.
     */
    onClosed: () => void;
}

/**
 * Marketing consent modal component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Marketing consent modal component.
 */
export const MarketingConsentModal: FunctionComponent<MarketingConsentModalPropTypes> = (
    props: MarketingConsentModalPropTypes
): ReactElement => {
    const { 
        isOpen, 
        onClosed, 
        ["data-componentid"]: componentId 
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const uuid: string = useSelector((state: AppState) => state.profile.profileInfo.id);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    /**
     * Handles updating user consent.
     * 
     * @param isSubscribed - Is subscribed or declined.
     */
    const submitUserConsent = (isSubscribed: boolean): void => {
        setIsLoading(true);
        updateUserConsent(isSubscribed)
            .then((response: AxiosResponse) => {
                if (response?.status !== 202) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("console:common.marketingConsent.notifications.errors.update.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:common.marketingConsent.notifications.errors.update.message")
                    }));
                }
                
                setMarketingConsentStatusToLocalStorage(uuid);
                onClosed();
            })
            .catch((_: IdentityAppsApiException) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("console:common.marketingConsent.notifications.errors.update.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:common.marketingConsent.notifications.errors.update.message")
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Handles subscribe button click.
     */
    const handleSubscribeButtonClick = () => {
        submitUserConsent(true);
    };

    /**
     * Handles decline button click.
     */
    const handleDeclineButtonClick = () => {
        submitUserConsent(false);
    };

    /**
     * Handles close button click.
     */
    const handleCloseButtonClick = () => {
        onClosed();
    };

    return (
        <Card
            data-componentid={ componentId }
            className={ `marketing-consent-modal ${isOpen ? "": "hidden"}` }
        >
            <Card.Content>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 3 }>
                            <GenericIcon
                                icon={ getMarketingConsentIllustrations().mailBox }
                                defaultIcon
                                transparent
                                inline
                                size="large"
                            />
                        </Grid.Column>
                        <Grid.Column width={ 13 }>
                            <Card.Content>
                                <div className="header-wrapper">
                                    <h4 
                                        data-componentid={ `${componentId}-heading` }
                                        className="ui header"
                                    >
                                        { t("console:common.marketingConsent.heading") }
                                    </h4>
                                    <Icon
                                        link={ true }
                                        onClick={ handleCloseButtonClick }
                                        className=""
                                        size="small"
                                        color="grey"
                                        name="close"
                                        data-componentid={ `${componentId}-close-btn` }
                                    />
                                </div>
                                <Card.Description className="mb-2">
                                    { t("console:common.marketingConsent.description") }
                                </Card.Description>
                                <Card.Content>
                                    <Button
                                        primary
                                        onClick={ handleSubscribeButtonClick }
                                        disabled={ isLoading }
                                        data-componentid={ `${componentId}-subscribe-btn` }
                                    >
                                        { t("console:common.marketingConsent.actions.subscribe") }
                                    </Button>
                                    <Button
                                        basic
                                        primary
                                        onClick={ handleDeclineButtonClick }
                                        disabled={ isLoading }
                                        data-componentid={ `${componentId}-decline-btn` }
                                    >
                                        { t("console:common.marketingConsent.actions.decline") }
                                    </Button>
                                </Card.Content>
                            </Card.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Content>
        </Card>
    );
};

/**
 * Default props for the component.
 */
MarketingConsentModal.defaultProps = {
    "data-componentid": "marketing-consent-modal"
};
