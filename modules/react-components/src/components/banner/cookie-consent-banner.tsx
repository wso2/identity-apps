/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { CookieStorageUtils } from "@wso2is/core/utils";
import classNames from "classnames";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useEffect,
    useState
} from "react";
import { Segment, SegmentProps, TransitionProps, TransitionablePortal } from "semantic-ui-react";
import { ReactComponent as CookieIcon } from "../../assets/images/icons/cookie-icon.svg";
import { PrimaryButton } from "../button";
import { GenericIcon } from "../icon";

/**
 * Proptypes for the Cookie Consent Banner.
 */
export interface CookieConsentBannerPropsInterface extends SegmentProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Confirm button text.
     */
    confirmButtonText: string;
    /**
     * Cookie domain.
     */
    domain?: string;
    /**
     * Store the cookie as a domain cookie.
     */
    domainCookie?: boolean;
    /**
     * ID for the component.
     */
    id?: string;
    /**
     * Inverted mode.
     */
    inverted?: boolean;
    /**
     * Callback to be triggered on confirm button click.
     */
    onConfirmButtonClick?: () => void;
    /**
     * Position of the banner.
     */
    position?: "left" | "right";
    /**
     * Consent persistence strategy.
     */
    storageStrategy?: "cookie";
    /**
     * Custom style object.
     */
    style?: Record<string, any>;
    /**
     * Banner title.
     */
    title: ReactNode;
}

/**
 * Cookie consent cookie name.
 * @type {string}
 */
export const COOKIE_CONSENT_COOKIE_NAME: string = "accepts-cookies";

/**
 * Banner to get consent for Cookie usage.
 *
 * @param {CookieConsentBannerPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const CookieConsentBanner: FunctionComponent<PropsWithChildren<CookieConsentBannerPropsInterface>> = (
    props: PropsWithChildren<CookieConsentBannerPropsInterface>
): ReactElement => {

    const {
        className,
        confirmButtonText,
        domain,
        domainCookie,
        id,
        inverted,
        style,
        title,
        position,
        onConfirmButtonClick,
        storageStrategy,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const [ show, setShow ] = useState<boolean>(false);
    const [ transitionAnimation, setTransitionAnimation ] = useState<TransitionProps[ "animation" ]>(undefined);
    const [ transitionDuration, setTransitionDuration ] = useState<number>(0);

    const classes = classNames(
        "cookie-consent-banner",
        {
            inverted,
            [ `aligned-${ position }` ]: position
        },
        className
    );

    /**
     * Show the banner id the cookie is not set.
     */
    useEffect(() => {

        if (!isCookieConsentShown()) {
            setShow(true);
        }
    }, []);

    /**
     * Checks if the cookie consent is shown.
     *
     * @return {boolean}
     */
    const isCookieConsentShown = (): boolean => {

        return Boolean(CookieStorageUtils.getItem(COOKIE_CONSENT_COOKIE_NAME));
    };

    /**
     * Handle the confirm button click.
     */
    const handleConfirmButton = (): void => {

        persistConsent();
        setTransitionAnimation("slide up");
        setTransitionDuration(500);
        setShow(false);
        onConfirmButtonClick && typeof onConfirmButtonClick === "function" && onConfirmButtonClick();
    };

    /**
     * Persist the consent.
     */
    const persistConsent = (): void => {

        if (storageStrategy === "cookie") {

            let cookieString: string = COOKIE_CONSENT_COOKIE_NAME + "=true;max-age=31536000;path=/";

            if (domainCookie) {
                cookieString = `${ cookieString };domain=${ domain ?? extractDomainFromHost() }`;
            }

            CookieStorageUtils.setItem(cookieString);

            return;
        }

        throw new Error("Invalid storage strategy. Only Cookie is supported.");
    };

    /**
     * Extracts the domain from the hostname.
     * If parsing fails, undefined will be returned.
     *
     * @return {string}
     */
    const extractDomainFromHost = (): string => {

        let domain: string = undefined;

        /**
         * Extract the domain from the hostname.
         * Ex: If console.wso2-is.com is parsed, `wso2-is.com` will be set as the domain.
         */
        try {
            const hostnameTokens: string[] = window.location.hostname.split(".");

            if (hostnameTokens.length > 1) {
                domain = hostnameTokens.slice((hostnameTokens.length - 2), hostnameTokens.length).join(".");
            }
        } catch (e) {
            // Couldn't parse the hostname. Log the error in debug mode.
            // Tracked here https://github.com/wso2/product-is/issues/11650.
        }

        return domain;
    };

    return (
        <TransitionablePortal
            open={ show }
            closeOnEscape={ false }
            closeOnDocumentClick={ false }
            transition={ {
                animation: transitionAnimation,
                duration: transitionDuration
            } }
        >
            <Segment
                id={ id }
                styles={ style }
                className={ classes }
                data-componentid={ componentId }
                data-testid={ testId }
                { ...rest }
            >
                <div
                    className="banner-image"
                    data-componentid={ `${ componentId }-image` }
                    data-testid={ `${ testId }-image` }
                >
                    <GenericIcon
                        transparent
                        size="tiny"
                        floated="left"
                        className="cookie-icon"
                        icon={ CookieIcon }
                    />
                </div>
                <div
                    className="banner-content"
                    data-componentid={ `${ componentId }-content` }
                    data-testid={ `${ testId }-content` }
                >
                    { title }
                </div>
                <div
                    className="actions"
                    data-componentid={ `${ componentId }-actions` }
                    data-testid={ `${ testId }-actions` }
                >
                    <PrimaryButton
                        fluid
                        onClick={ handleConfirmButton }
                        data-componentid={ `${ componentId }-confirm-button` }
                        data-testid={ `${ testId }-confirm-button` }
                    >
                        { confirmButtonText }
                    </PrimaryButton>
                </div>
            </Segment>
        </TransitionablePortal>
    );
};

/**
 * Default props for the component.
 */
CookieConsentBanner.defaultProps = {
    "data-componentid": "cookie-consent-banner",
    "data-testid": "cookie-consent-banner",
    domainCookie: false,
    id: "cookie-consent-banner",
    inverted: false,
    position: "right",
    storageStrategy: "cookie"
};
