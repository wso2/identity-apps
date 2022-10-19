/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { EmptyPlaceholder } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../configs";
import { AppConstants } from "../../constants";

/**
 * Login error page.
 *
 * @returns Generic login error page.
 */
const LoginErrorPage = (): ReactElement => {

    const { t } = useTranslation();

    return (
        <EmptyPlaceholder
            action={ (
                <Button
                    className="link-button"
                    as={ Link }
                    to={ AppConstants.getAppLogoutPath() }
                >
                    { t("myAccount:placeholders.loginError.action") }
                </Button>
            ) }
            image={ getEmptyPlaceholderIllustrations().loginError }
            imageSize="tiny"
            subtitle={ [
                t("myAccount:placeholders.loginError.subtitles.0"),
                t("myAccount:placeholders.loginError.subtitles.1")
            ] }
            title={ t("myAccount:placeholders.loginError.title") }
        />
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default LoginErrorPage;
