/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GridLayout, PageLayout, Section } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Ref } from "semantic-ui-react";
import { AppConstants, history } from "../../../../features/core";
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
