/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    AlertLevels, IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    GridLayout,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Grid, Icon, Message } from "semantic-ui-react";
import { AppConstants, history } from "../../core";
import { ServerConfigurationsConstants } from "../../server-configurations";
import { updateJWTConfig, useTokenReuseConfigData } from "../api";

/**
 * Private key JWT client authentication for OIDC configuration page.
 *
 * @param props - Props injected to the component.
 * @returns Private key JWT client authentication for OIDC configuration page component.
 */
export const PrivateKeyJWTConfigEditPage: FunctionComponent<IdentifiableComponentInterface> = (
    props: IdentifiableComponentInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const [ enableTokenReuse, setEnableTokenReuse ] = useState<boolean>(true);


    const {
        data: tokenReuseData,
        isLoading: isLoading
    } = useTokenReuseConfigData();

    useEffect(() => {

        if (tokenReuseData) {
            setEnableTokenReuse(tokenReuseData?.enableTokenReuse);
        }

    }, []);


    /**
     * Handles back button click event
     */
    const handleBackButtonClick = () => {
        history.push(
            AppConstants.getPaths()
                .get("GOVERNANCE_CONNECTOR")
                .replace(
                    ":id",
                    ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
                )
        );
    };

    const resolveConnectorUpdateErrorMessage = (error: any): string => {
        
        return (
            t("console:manage.features.jwtPrivateKeyConfiguration.notifications.error.description",
                { description: error.response.data.description })
        );
    };
    const resolveConnectorUpdateSuccessMessage = (): string => {

        return (
            t("console:manage.features.jwtPrivateKeyConfiguration.notifications.success.description")
        );
    };

    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: resolveConnectorUpdateSuccessMessage(),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.jwtPrivateKeyConfiguration.notifications." +
                    "success.message"
                )
            })
        );
    };

    const handleUpdateError = (error) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: resolveConnectorUpdateErrorMessage(error),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.jwtPrivateKeyConfiguration.notifications.error.message"
                    )
                })
            );
        } else {
            // Generic error message
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.jwtPrivateKeyConfiguration.notifications." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.jwtPrivateKeyConfiguration.notifications." +
                        ".genericError.message"
                    )
                })
            );
        }
    };

    /**
     * Handles token reuse toggle button
     */
    const handleTokenReuseToggle: () => void = () => {
        setEnableTokenReuse(!enableTokenReuse);
    };


    /**
     * Handles token reuse toggle button
     */
    const handleToggle = (e: SyntheticEvent, data: CheckboxProps) => {
        setEnableTokenReuse(data.checked);
        const updateData = {
            operation: "ADD",
            path: "/enableTokenReuse",
            value: data.checked
        };
        console.log(updateData);
        updateJWTConfig(updateData)
        .then(() => {
            handleUpdateSuccess();
        })
        .catch((error) => {
            handleUpdateError(error);
        });
    };

    /**
     * This renders the enable toggle.
     */
    const connectorToggle = (): ReactElement => {
        return (
            <>
                <Checkbox
                    label={ enableTokenReuse ? "Token Reuse Enabled" : "Token Reuse Disabled" }
                    toggle
                    onChange={
                        handleToggle
                    }
                    checked={ enableTokenReuse }
                    readOnly={
                        false
                    }
                    data-testId={ `${ componentId }-enable-toggle` }
                />
            </>
        );
    };


    return (!isLoading ? 
        <PageLayout
            pageTitle="Private Key JWT Client Authentication for OIDC"
            title={ t(
                "console:manage.features.jwtPrivateKeyConfiguration.pageTitle"
            ) }
            description={ (
                <>
                {t("console:manage.features.jwtPrivateKeyConfiguration.description" )}
                    <DocumentationLink
                        link={ getLink("manage.validation.passwordValidation.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t(
                    "console:manage.features.jwtPrivateKeyConfiguration.goBackToAccountSecurityConfig"
                )
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
        >
            {
                connectorToggle()
            }
            {
            <Grid className={ "mt-2" } >
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 10 }>
                        <Message
                            info
                            content={ (
                                <>
                                    <Icon name="info circle"/>
                                    If enabled, the JTI in the JWT will be unique per the request if the previously
                                    used JWT is not already expired. JTI (JWT ID) is a claim that provides a unique
                                    identifier for the JWT.
                                </>
                            ) }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            }
        </PageLayout> : (
        <GridLayout
            isLoading={ isLoading }
            className={ "pt-5" }
        />)
    );
};

/**
 * Default props for the component.
 */
PrivateKeyJWTConfigEditPage.defaultProps = {
    "data-componentid": "private-key-jwt-config-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default PrivateKeyJWTConfigEditPage;
