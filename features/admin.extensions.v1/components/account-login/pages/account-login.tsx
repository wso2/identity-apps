/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { ArrowLoopRightUserIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GridLayout, PageLayout, Section } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Ref } from "semantic-ui-react";
import { AppConstants, history } from "../../../../admin.core.v1";
import UsernameValidationIcon from "../../../assets/images/icons/username-validation-icon.svg";

/**
 * Props for account login page.
 */
type AccountLoginPageInterface = IdentifiableComponentInterface;

/**
 *Account Login configuration listing page.
 *
 * @param props - Props injected to the component.
 * @returns Account Login Page
 */
export const AccountLoginPage: FunctionComponent<AccountLoginPageInterface> = (
    props: AccountLoginPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);

    const { t } = useTranslation();

    /**
     * Handle connector advance setting selection.
     */
    const handleSelection = () => {
        history.push(AppConstants.getPaths().get("USERNAME_VALIDATION_EDIT"));
    };

    const handleAlternativeLoginIdentifierSelection = (): void => {
        history.push(AppConstants.getPaths().get("ALTERNATIVE_LOGIN_IDENTIFIER_EDIT"));
    };

    return (
        <PageLayout
            pageTitle={ t("extensions:manage.accountLogin.pageTitle") }
            title={ t("extensions:manage.accountLogin.pageTitle") }
            description={ t("extensions:manage.accountLogin.description") }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <GridLayout
                    showTopActionPanel={ false }
                >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 12 }>
                            <Section
                                data-componentid={ `${componentId}-section` }
                                description={ t("extensions:manage.accountLogin.editPage.description") }
                                icon={ UsernameValidationIcon }
                                header={ t("extensions:manage.accountLogin.editPage.pageTitle") }
                                onPrimaryActionClick={ handleSelection }
                                primaryAction={ "Configure" }
                            >
                                <Divider hidden/>
                            </Section>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden/>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 12 }>
                            <Section
                                data-componentid={ `${componentId}-alternative-login-identifier-section` }
                                description={ t("extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                                                "description") }
                                icon={ <ArrowLoopRightUserIcon className="icon" /> }
                                header={ t("extensions:manage.accountLogin.alternativeLoginIdentifierPage.pageTitle") }
                                onPrimaryActionClick={ handleAlternativeLoginIdentifierSelection }
                                primaryAction={ "Configure" }
                            >
                                <Divider hidden/>
                            </Section>
                        </Grid.Column>
                    </Grid.Row>
                </GridLayout>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
AccountLoginPage.defaultProps = {
    "data-componentid": "account-login-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AccountLoginPage;
