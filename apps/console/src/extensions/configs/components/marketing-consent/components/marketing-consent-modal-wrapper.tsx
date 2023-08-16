/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { MarketingConsentModal } from "./marketing-consent-modal";
import { AppState } from "../../../../../features/core";
import { useUserConsentList } from "../api";
import { ConsentResponseInterface, ConsentStatus, ConsentTypes } from "../models";
import { getMarketingConsentStatusFromLocalStorage, setMarketingConsentStatusToLocalStorage } from "../utils";

/**
 * Marketing consent modal component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Marketing consent modal component.
 */
export const MarketingConsentModalWrapper: FunctionComponent<IdentifiableComponentInterface> = (
    props: IdentifiableComponentInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const uuid: string = useSelector((state: AppState) => state.profile.profileInfo.id);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const [ isMarketingConsentOpen, setIsMarketingConsentOpen ] = useState<boolean>(false);
    const [ shouldFetch, setShouldFetch ] = useState<boolean>(false);

    /**
     * Calls the custom hook to fetch user consent data. {@link shouldFetch} is used to 
     * conditionally call the fetcher function.
     */
    const {
        data: userConsentList,
        isLoading: isConsentListLoading,
        error: userConsentListFetchRequestError
    } = useUserConsentList(shouldFetch);

    /**
     * Check whether the user has interacted with the marketing consent banner previously.
     * Then sets {@link isMarketingConsentGiven} state accordingly to trigger fetching data.
     */
    useEffect(() => {
        if (!uuid) return;

        const isMarketingConsentGiven: boolean = getMarketingConsentStatusFromLocalStorage(uuid);

        if (isMarketingConsentGiven) return;

        if (isPrivilegedUser) return;

        setShouldFetch(true);
    }, [ uuid ]);
    
    /**
     * Decides to show or hide the marketing consent banner based on the fetched user consent data.
     */
    useEffect(() => {
        if (isConsentListLoading) return;

        if (userConsentListFetchRequestError) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:console.marketingConsent.notifications.errors.fetch.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:console.marketingConsent.notifications.errors.fetch.message")
            }));

            return;
        }

        const marketingConsent: ConsentResponseInterface = userConsentList.find(
            (consent) => consent.consentType === ConsentTypes.MARKETING);
        const marketingConsentStatus: ConsentStatus = 
            marketingConsent?.status ?? ConsentStatus.NOT_GIVEN;

        if (marketingConsentStatus === ConsentStatus.NOT_GIVEN) {
            setIsMarketingConsentOpen(true);
        } else {
            setMarketingConsentStatusToLocalStorage(uuid);
        }
    }, [ isConsentListLoading ]);

    /**
     * Handles the close event of the marketing consent modal.
     */
    const handleMarketingConsentClosed = (): void => {
        setIsMarketingConsentOpen(false);
    };

    return (
        <div data-componentid={ componentId }>
            <MarketingConsentModal 
                isOpen={ isMarketingConsentOpen }
                onClosed={ handleMarketingConsentClosed }
            />
        </div>
    );
};

/**
 * Default props for the component.
 */
MarketingConsentModalWrapper.defaultProps = {
    "data-componentid": "marketing-consent-modal-wrapper"
};
