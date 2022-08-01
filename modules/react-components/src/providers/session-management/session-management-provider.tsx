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
    ReactNode,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans } from "react-i18next";
import { SessionTimedOutContext } from "./session-management-context";
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
     * Session Timed Out callback.
     */
    setSessionTimedOut?: (sessionTimedOut : boolean ) => void;
    /**
     * Session Timed Out variable.
     */
    sessionTimedOut?: boolean;
    /**
     * Modal options.
     */
    modalOptions?: SessionManagementModalOptionsInterface;
    /**
     * Type of the modal.
     */
    type: SessionTimeoutModalTypes;
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
    description: ReactNode;
    /**
     * Primary button text.
     */
    primaryButtonText: string | ReactNode;
    /**
     * Secondary button text.
     */
    secondaryButtonText: string | ReactNode;
    /**
     * Login again button text.
     */
    loginAgainButtonText?: string | ReactNode;
    /**
     * Session timed out message i18n heading.
     */
    sessionTimedOutHeadingI18nKey?: string;
    /**
     * Session timed out description.
     */
    sessionTimedOutDescription?: string | ReactNode;
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
 * Enum for modal types.
 */
export enum SessionTimeoutModalTypes {
    /**
     * Auto logout based on the counter.
     * @type {string}
     */
    COUNTER = "COUNTER",
    /**
     * Default session timeout modal with warning messages.
     * @type {string}
     */
    DEFAULT = "DEFAULT"
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
            setSessionTimedOut,
            sessionTimedOut,
            modalOptions,
            type
        } = props;

        const timerIntervalID = useRef(null);

        const [
            sessionTimeoutEventState,
            setSessionTimeoutEventState
        ] = useState<SessionTimeoutEventStateInterface>(undefined);
        const [ showSessionTimeoutModal, setShowSessionTimeoutModal ] = useState<boolean>(false);
        const [ timerDisplay, setTimerDisplay ] = useState<string>(undefined);
        
        useEffect(() => {
            const sessionTimeoutListener = (e: MessageEventInit) => {
                const state = e.data;

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

                if (JSON.parse(timeout) && type === SessionTimeoutModalTypes.COUNTER) {
                    startTimer(idleTimeout - idleWarningTimeout);
                }
                setSessionTimedOut(true);
                setShowSessionTimeoutModal(JSON.parse(timeout));
            };

            window.addEventListener("session-timeout", sessionTimeoutListener);

            return () => {
                performCleanupTasks();
                window.removeEventListener("session-timeout",sessionTimeoutListener);
            };
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
            setSessionTimedOut(false);
        };

        /**
     * Handles session logout click.
     */
        const handleSessionLogout = (): void => {
            performCleanupTasks();
            setShowSessionTimeoutModal(false);
            setSessionTimedOut(false);
            onSessionLogout();
        };

        /**
     * Handles login again click.
     */
        const handleLoginAgain = (): void => {
            performCleanupTasks();
            setShowSessionTimeoutModal(false);
            setSessionTimedOut(false);
            onLoginAgain();
        };

        /**
     * Handles primary button click.
     */
        const handlePrimaryActionClick = (): void => {

            // If the counter runs out or if the type of the modal is default, try the login again option.
            if (sessionTimedOut || type === SessionTimeoutModalTypes.DEFAULT) {
                handleLoginAgain();
                setSessionTimedOut(false);

                return;
            }

            // If the counter hasn't run out, and the type of modal is other than `default` abort the termination.
            handleSessionTimeoutAbort();
            setSessionTimedOut(false);
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
            <SessionTimedOutContext.Provider value={ sessionTimedOut } >
                <>
                    { children }
                    <SessionTimeoutModal
                        closeOnEscape={ false }
                        closeOnDimmerClick={ false }
                        open={ showSessionTimeoutModal }
                        onClose={ handleSessionTimeoutAbort }
                        onPrimaryActionClick={ handlePrimaryActionClick }
                        onSecondaryActionClick={ handleSessionLogout }
                        sessionTimeOut={ sessionTimedOut }
                        heading={
                            (type === SessionTimeoutModalTypes.DEFAULT)
                                ? (
                                    <Trans
                                        i18nKey={ modalOptions?.headingI18nKey }
                                    >
                                    It looks like you have been inactive for a long time.
                                    </Trans>
                                )
                                : (
                                    <Trans
                                        i18nKey={
                                            !sessionTimedOut
                                                ? modalOptions?.headingI18nKey
                                                : modalOptions?.sessionTimedOutHeadingI18nKey
                                        }
                                        tOptions={
                                            { time: timerDisplay }
                                        }
                                    >
                                    You will be logged out in <strong>{ timerDisplay }</strong>.
                                    </Trans>
                                )
                        }
                        description={
                            (type === SessionTimeoutModalTypes.DEFAULT)
                                ? modalOptions?.description
                                : sessionTimedOut
                                    ? modalOptions?.sessionTimedOutDescription
                                    : modalOptions?.description
                        }
                        primaryButtonText={
                            (type === SessionTimeoutModalTypes.DEFAULT)
                                ? modalOptions?.primaryButtonText
                                : sessionTimedOut
                                    ? modalOptions?.loginAgainButtonText
                                    : modalOptions?.primaryButtonText
                        }
                        secondaryButtonText={
                            (type === SessionTimeoutModalTypes.COUNTER)
                                ? modalOptions?.secondaryButtonText
                                : null
                        }
                    />
                </>
            </SessionTimedOutContext.Provider>
        );
    };

/**
 * Default props for the component.
 */
SessionManagementProvider.defaultProps = {
    type: SessionTimeoutModalTypes.DEFAULT
};
