/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { CommonConstants } from "@wso2is/core/constants";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    useEffect, useRef,
    useState
} from "react";
import { Trans } from "react-i18next";
import { SessionTimeoutModal } from "../../components";

/**
 * Session Management Provider props interface.
 */
export interface SessionManagementProviderPropsInterface extends TestableComponentInterface {
    /**
     * Session timeout abort callback.
     * @param {URL} url - Current URL.
     */
    onSessionTimeoutAbort: (url: URL) => void;
    /**
     * Session logout callback.
     */
    onSessionLogout: () => void;
    /**
     * Login again callback.
     */
    onLoginAgain?: () => void;
    /**
     * Modal options.
     */
    modalOptions?: SessionManagementModalOptionsInterface;
}

/**
 * Session Management modal options interface.
 */
export interface SessionManagementModalOptionsInterface {
    /**
     * Modal Heading localization key.
     */
    headingI18nKey: string;
    /**
     * Modal Description.
     */
    description: string;
    /**
     * Primary button text.
     */
    primaryButtonText: string;
    /**
     * Secondary button text.
     */
    secondaryButtonText: string;
    /**
     * Login again button text.
     */
    loginAgainButtonText?: string;
    /**
     * Session timed out message i18n heading.
     */
    sessionTimedOutHeadingI18nKey?: string;
    /**
     * Session timed out description.
     */
    sessionTimedOutDescription?: string;
}

/**
 * Session timeout event state interface.
 */
export interface SessionTimeoutEventStateInterface {
    /**
     * URL.
     */
    url: string;
    /**
     * Idle timeout duration.
     */
    idleTimeout: number;
    /**
     * Idle timeout warning time.
     */
    idleWarningTimeout: number;
}

/**
 * Session management provider component.
 *
 * @param {React.PropsWithChildren<SessionManagementProviderPropsInterface>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const SessionManagementProvider: FunctionComponent<PropsWithChildren<
    SessionManagementProviderPropsInterface
    >> = (
    props: PropsWithChildren<SessionManagementProviderPropsInterface>
): ReactElement => {

    const {
        children,
        onSessionLogout,
        onLoginAgain,
        onSessionTimeoutAbort,
        modalOptions
    } = props;

    const timerIntervalID = useRef(null);

    const [
        sessionTimeoutEventState,
        setSessionTimeoutEventState
    ] = useState<SessionTimeoutEventStateInterface>(undefined);
    const [ showSessionTimeoutModal, setShowSessionTimeoutModal ] = useState<boolean>(false);
    const [ timerDisplay, setTimerDisplay ] = useState<string>(undefined);
    const [ sessionTimedOut, setSessionTimedOut ] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener("popstate", e => {
            const { state } = e;

            if (!state) {
                return;
            }

            setSessionTimeoutEventState(state);

            const { url, idleTimeout, idleWarningTimeout }: SessionTimeoutEventStateInterface = state;

            const parsedURL: URL = new URL(url);

            const timeout = parsedURL.searchParams.get(
                CommonConstants.SESSION_TIMEOUT_WARNING_URL_SEARCH_PARAM_KEY
            );

            if (timeout === undefined) {
                return;
            }

            if (timeout) {
                startTimer(idleTimeout - idleWarningTimeout);
            }

            setShowSessionTimeoutModal(!!timeout);
        });

        return () => {
            performCleanupTasks();
        }
    }, []);

    /**
     * Handles session timeout abort.
     */
    const handleSessionTimeoutAbort = (): void => {
        if (sessionTimedOut) {
            handleLoginAgain();
            return;
        }
        const parsedURL: URL = new URL(sessionTimeoutEventState.url);

        if (parsedURL && parsedURL.searchParams) {
            if (parsedURL.searchParams.get(CommonConstants.SESSION_TIMEOUT_WARNING_URL_SEARCH_PARAM_KEY)) {
                parsedURL.searchParams.delete(CommonConstants.SESSION_TIMEOUT_WARNING_URL_SEARCH_PARAM_KEY);
                onSessionTimeoutAbort(parsedURL);
            }
        }

        performCleanupTasks();
        setShowSessionTimeoutModal(false);
    };

    /**
     * Handles session logout click.
     */
    const handleSessionLogout = (): void => {
        performCleanupTasks();
        setShowSessionTimeoutModal(false);
        onSessionLogout();
    };

    /**
     * Handles login again click.
     */
    const handleLoginAgain = (): void => {
        performCleanupTasks();
        setShowSessionTimeoutModal(false);
        onLoginAgain();
    };

    /**
     * Handles primary button click.
     */
    const handlePrimaryActionClick = (): void => {
        if (sessionTimedOut) {
            handleLoginAgain();
        } else {
            handleSessionTimeoutAbort();
        }
    };

    /**
     * Performs housekeeping tasks.
     */
    const performCleanupTasks = () => {
        setTimerDisplay(undefined);
        window.clearInterval(timerIntervalID.current);
        timerIntervalID.current = null;
    };

    /**
     * Starts the timer.
     * @param {number} duration - Timer duration.
     */
    const startTimer = (duration: number) => {
        let timer: number = duration;
        let minutes: number = 0;
        let seconds: number = 0;

        if (!timerIntervalID.current) {
            timerIntervalID.current = window.setInterval(() => {
                minutes = Math.floor(timer / 60);
                seconds = Math.floor(timer % 60);

                setTimerDisplay(
                    (minutes < 10 ? "0" + minutes : minutes)
                    + ":"
                    + (seconds < 10 ? "0" + seconds : seconds)
                );

                if (--timer < 0) {
                    setSessionTimedOut(true);
                    performCleanupTasks();
                }
            }, 1000);
        }
    };

    return (
        <>
            { children }
            <SessionTimeoutModal
                open={ showSessionTimeoutModal }
                onClose={ handleSessionTimeoutAbort }
                onPrimaryActionClick={ handlePrimaryActionClick }
                onSecondaryActionClick={ handleSessionLogout }
                sessionTimeOut = { sessionTimedOut }
                heading={
                    <Trans
                        i18nKey={ !sessionTimedOut?
                            modalOptions?.headingI18nKey : modalOptions?.sessionTimedOutHeadingI18nKey }
                        tOptions={
                            { time: timerDisplay }
                        }
                    >
                        You will be logged out in <strong>{ timerDisplay }</strong>.
                    </Trans>
                }
                description={ sessionTimedOut ? modalOptions?.sessionTimedOutDescription
                    : modalOptions?.description }
                primaryButtonText={ sessionTimedOut ? modalOptions?.loginAgainButtonText
                    : modalOptions?.primaryButtonText }
                secondaryButtonText={ modalOptions?.secondaryButtonText }
            />
        </>
    );
};
