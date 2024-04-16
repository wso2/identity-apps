/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MarketingConsentModal } from "./marketing-consent-modal";
import { AppState } from "../../../../../admin.core.v1";
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
            return;
        }

        const marketingConsent: ConsentResponseInterface = userConsentList.find(
            (consent: ConsentResponseInterface) => consent.consentType === ConsentTypes.MARKETING);
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
