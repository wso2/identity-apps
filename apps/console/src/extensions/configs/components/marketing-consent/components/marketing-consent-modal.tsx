/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
import { AppState } from "../../../../../features/core";
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
                if (response?.status !== 200) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:console.marketingConsent.notifications.errors.update.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:console.marketingConsent.notifications.errors.update.message")
                    }));
                }
                
                setMarketingConsentStatusToLocalStorage(uuid);
                onClosed();
            })
            .catch((_: IdentityAppsApiException) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:console.marketingConsent.notifications.errors.update.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:console.marketingConsent.notifications.errors.update.message")
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
            <Card.Content className="p-4">
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
                                        { t("extensions:console.marketingConsent.heading") }
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
                                    { t("extensions:console.marketingConsent.description") }
                                </Card.Description>
                                <Card.Content>
                                    <Button
                                        primary
                                        onClick={ handleSubscribeButtonClick }
                                        disabled={ isLoading }
                                        data-componentid={ `${componentId}-subscribe-btn` }
                                    >
                                        { t("extensions:console.marketingConsent.actions.subscribe") }
                                    </Button>
                                    <Button
                                        basic
                                        primary
                                        className="link-button"
                                        onClick={ handleDeclineButtonClick }
                                        disabled={ isLoading }
                                        data-componentid={ `${componentId}-decline-btn` }
                                    >
                                        { t("extensions:console.marketingConsent.actions.decline") }
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
