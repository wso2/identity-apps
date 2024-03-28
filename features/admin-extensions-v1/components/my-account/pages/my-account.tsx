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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GridLayout, PageLayout, Section } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import { AppConstants, history } from "../../../../features/core";
import { useMyAccountStatus } from "../api";

/**
 * Props for my account settings page.
 */
type MyAccountSettingsPageInterface = IdentifiableComponentInterface;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const MyAccountSettingsPage: FunctionComponent<MyAccountSettingsPageInterface> = (
    props: MyAccountSettingsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<any> = useRef(null);

    const { t } = useTranslation();

    const [ isLoadingForTheFirstTime, setIsLoadingForTheFirstTime ] = useState<boolean>(true);
    const [ isMyAccountEnabled, setMyAccountEnabled ] = useState<boolean>(AppConstants.DEFAULT_MY_ACCOUNT_STATUS);

    const {
        data: myAccountStatus,
        isLoading: isMyAccountStatusLoading,
        error: myAccountStatusFetchRequestError
    } = useMyAccountStatus();

    /**
     * Handles the my account status fetch request error.
     */
    useEffect(() => {

        if (!myAccountStatusFetchRequestError) {
            return;
        }

        if (myAccountStatusFetchRequestError.response
            && myAccountStatusFetchRequestError.response.data
            && myAccountStatusFetchRequestError.response.data.description) {
            if (myAccountStatusFetchRequestError.response.status === 404) {
                return;
            }
            dispatch(addAlert({
                description: myAccountStatusFetchRequestError.response.data.description ??
                    t("applications:myaccount.fetchMyAccountStatus.error.description"),
                level: AlertLevels.ERROR,
                message: t("applications:myaccount.fetchMyAccountStatus.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:myaccount.fetchMyAccountStatus" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:myaccount.fetchMyAccountStatus" +
                ".genericError.message")
        }));
    }, [ myAccountStatusFetchRequestError ]);

    /**
     * Sets the initial spinner.
     * TODO: Remove this once the loaders are finalized.
     */
    useEffect(() => {
        if (isMyAccountStatusLoading === false
            && isLoadingForTheFirstTime === true) {
            let status: boolean = AppConstants.DEFAULT_MY_ACCOUNT_STATUS;

            if (myAccountStatus) {
                const enableProperty: string = myAccountStatus["value"];

                if (enableProperty && enableProperty === "false") {
                    status = false;
                }
            }
            setMyAccountEnabled(status);
            setIsLoadingForTheFirstTime(false);
        }
    }, [ isMyAccountStatusLoading, isLoadingForTheFirstTime ]);

    /**
     * Handle connector advance setting selection.
     */
    const handleSelection = () => {
        history.push(AppConstants.getPaths().get("MY_ACCOUNT_EDIT"));
    };

    /**
     * This function returns loading placeholder.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        return (
            <Grid.Row columns={ 1 }>
                <div>
                    <div
                        className="ui card fluid settings-card"
                        data-testid={ `${componentId}-loading-card` }
                    >
                        <div className="content no-padding">
                            <div className="header-section">
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="full" />
                                    </Placeholder.Header>
                                </Placeholder>
                                <Divider hidden />
                            </div>
                        </div>
                        <div className="content extra extra-content">
                            <div className="action-button">
                                <Placeholder>
                                    <Placeholder.Line length="very short" />
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                    <Divider hidden/>
                </div>
            </Grid.Row>
        );
    };

    return (
        <PageLayout
            pageTitle={ t("extensions:manage.myAccount.pageTitle") }
            title={ t("extensions:manage.myAccount.pageTitle") }
            description={ t("extensions:manage.myAccount.description") }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <GridLayout
                    showTopActionPanel={ false }
                >
                    {
                        isMyAccountStatusLoading || isLoadingForTheFirstTime
                            ? renderLoadingPlaceholder()
                            : (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 12 }>
                                        <Section
                                            data-componentid={ `${componentId}-settings-section` }
                                            description={ "Self-service portal for your users." }
                                            icon={ null }
                                            header={ "My Account" }
                                            onPrimaryActionClick={ handleSelection }
                                            primaryAction={ "Configure" }
                                            connectorEnabled={ isMyAccountEnabled }
                                        >
                                            <Divider hidden/>
                                        </Section>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                    }
                </GridLayout>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
MyAccountSettingsPage.defaultProps = {
    "data-componentid": "my-account-settings-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default MyAccountSettingsPage;
