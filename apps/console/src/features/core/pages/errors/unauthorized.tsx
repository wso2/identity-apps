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

import { EmptyPlaceholder, LinkButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";
import { getEmptyPlaceholderIllustrations } from "../../configs";
import { AppConstants } from "../../constants";

/**
 * Unauthorized error page.
 *
 * @param {RouteComponentProps} props - Props injected to the component.
 * @return {React.ReactElement}
 */
const UnauthorizedErrorPage: FunctionComponent<RouteComponentProps> = (
    props: RouteComponentProps
): ReactElement => {

    const { location } = props;

    const error = new URLSearchParams(location.search).get("error");

    const { t } = useTranslation();

    /**
     * Resolve error action.
     *
     * @param {string} error - Error decoded from URL.
     * @return {ReactNode} Resolved action.
     */
    const resolveAction = (error: string): ReactNode => {
        if (error === AppConstants.LOGIN_ERRORS.get("NO_LOGIN_PERMISSION")) {
            return (
                <LinkButton as={ Link } to={ window[ "AppUtils" ].getConfig().routes.logout }>
                    { t("console:common.placeholders.loginError.action") }
                </LinkButton>
            );
        } else if (error === AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")) {
            return (
                <LinkButton as={ Link } to={ window[ "AppUtils" ].getConfig().routes.logout }>
                    { t("console:common.placeholders.accessDenied.action") }
                </LinkButton>
            );
        } else if (error === AppConstants.LOGIN_ERRORS.get("USER_DENIED_CONSENT")) {
            return (
                <LinkButton as={ Link } to={ window[ "AppUtils" ].getConfig().routes.logout }>
                    { t("console:common.placeholders.consentDenied.action") }
                </LinkButton>
            );
        }

        return (
            <LinkButton as={ Link } to={ window[ "AppUtils" ].getConfig().routes.logout }>
                { t("console:common.placeholders.unauthorized.action") }
            </LinkButton>
        );
    };

    /**
     * Resolve error title.
     *
     * @param {string} error - Error decoded from URL.
     * @return {string} Resolved title.
     */
    const resolveTitle = (error: string): string => {
        if (error === AppConstants.LOGIN_ERRORS.get("NO_LOGIN_PERMISSION")) {
            return t("console:common.placeholders.loginError.title");
        } else if (error === AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")) {
            return t("console:common.placeholders.accessDenied.title");
        } else if (error === AppConstants.LOGIN_ERRORS.get("USER_DENIED_CONSENT")) {
            return t("console:common.placeholders.consentDenied.title");
        }

        return t("console:common.placeholders.unauthorized.title");
    };

    /**
     * Resolve error subtitles.
     *
     * @param {string} error - Error decoded from URL.
     * @return {string | string[]} Resolved subtitles.
     */
    const resolveSubTitles = (error: string): string | string[] => {
        if (error === AppConstants.LOGIN_ERRORS.get("NO_LOGIN_PERMISSION")) {
            return [
                t("console:common.placeholders.loginError.subtitles.0"),
                t("console:common.placeholders.loginError.subtitles.1")
            ];
        } else if (error === AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")) {
            return [
                t("console:common.placeholders.accessDenied.subtitles.0"),
                t("console:common.placeholders.accessDenied.subtitles.1")
            ];
        } else if (error === AppConstants.LOGIN_ERRORS.get("USER_DENIED_CONSENT")) {
            return [
                t("console:common.placeholders.consentDenied.subtitles.0"),
                t("console:common.placeholders.consentDenied.subtitles.1")
            ];
        }

        return [
            t("console:common.placeholders.unauthorized.subtitles.0"),
            t("console:common.placeholders.unauthorized.subtitles.1")
        ];
    };

    return (
        <EmptyPlaceholder
            action={ resolveAction(error) }
            image={ getEmptyPlaceholderIllustrations().loginError }
            imageSize="tiny"
            subtitle={ resolveSubTitles(error) }
            title={ resolveTitle(error) }
        />
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UnauthorizedErrorPage;
