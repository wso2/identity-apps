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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, Heading, LabeledCard, Text } from "@wso2is/react-components";
import classNames from "classnames";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, Label, Popup } from "semantic-ui-react";
import { GenericAuthenticatorInterface } from "../../../../../identity-providers";
import { getGeneralIcons } from "../../../../configs";
import { ApplicationManagementConstants } from "../../../../constants";

/**
 * Proptypes for the authenticators component.
 */
interface AuthenticatorsPropsInterface extends TestableComponentInterface {
    /**
     * Allow social login addition.
     */
    allowSocialLoginAddition: boolean;
    /**
     * List of authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Authenticators category.
     */
    category: string;
    /**
     * Default name for authenticators with no name.
     */
    defaultName?: string;
    /**
     * Empty placeholder.
     */
    emptyPlaceholder?: ReactNode;
    /**
     * Heading for the authenticators section.
     */
    heading?: string;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Denotes whether the authenticator is a social login.
     */
    isSocialLogin?: boolean;
    /**
     * Handles on click of social login add.
     */
    handleSocialLoginAdd?: any;
    /**
     * Callback triggered when authenticators are selected.
     */
    onAuthenticatorSelect: (selectedAuthenticators: GenericAuthenticatorInterface[]) => void;
}

/**
 * Component to render the list of authenticators.
 *
 * @param {AuthenticatorsPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const Authenticators: FunctionComponent<AuthenticatorsPropsInterface> = (
    props: AuthenticatorsPropsInterface
): ReactElement => {

    const {
        allowSocialLoginAddition,
        authenticators,
        className,
        category,
        defaultName,
        emptyPlaceholder,
        heading,
        isSocialLogin,
        handleSocialLoginAdd,
        onAuthenticatorSelect,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ selectedAuthenticators, setSelectedAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);

    const classes = classNames("authenticators", className);

    const isAuthenticatorDisabled = (authenticator) => {
        if (category === ApplicationManagementConstants.AUTHENTICATOR_CATEGORIES.SECOND_FACTOR) {
            return !(authenticator?.isEnabled);
        }
        if (category === ApplicationManagementConstants.AUTHENTICATOR_CATEGORIES.SOCIAL) {
            return !(authenticator
                && authenticator.authenticators[ 0 ]
                && authenticator.authenticators[ 0 ].isEnabled);
        }
    };

    const resolvePopupContent = () => {
        if (category === ApplicationManagementConstants.AUTHENTICATOR_CATEGORIES.SECOND_FACTOR) {
            return (
                <Text>
                    <Trans
                        i18nKey={
                            "console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "authenticationFlow.sections.stepBased.secondFactorDisabled"
                        }
                    >
                        The second-factor authenticators can only be used if the <Code withBackground>basic</Code>
                        authenticator has been added in a previous step.
                        The second-factor authenticators can only be used if <Code withBackground>Username & Password
                        </Code> or any other handlers such as <Code withBackground> Identifier First</Code> 
                        that can handler these factors are present in a previous step.
                    </Trans>
                </Text>
            );
        } else if (category === ApplicationManagementConstants.AUTHENTICATOR_CATEGORIES.SOCIAL) {
            return (
                <Text>
                    {
                        t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "authenticationFlow.sections.stepBased.authenticatorDisabled")
                    }
                </Text>
            );
        }
    };
    
    const handleAuthenticatorSelect = (selectedAuthenticator): void => {
        
        if (isAuthenticatorDisabled(selectedAuthenticator)) {
            return;
        }
         
        if (selectedAuthenticators.some((authenticator) => authenticator.id === selectedAuthenticator.id)) {
            
            const filtered = selectedAuthenticators.filter((authenticator) => {
                return authenticator.id !== selectedAuthenticator.id;
            });

            onAuthenticatorSelect(filtered);
            setSelectedAuthenticators(filtered);
            
            return;
        }

        onAuthenticatorSelect([ ...selectedAuthenticators, selectedAuthenticator ]);
        setSelectedAuthenticators([ ...selectedAuthenticators, selectedAuthenticator ]);
    };

    return authenticators && authenticators instanceof Array
        ? (
            <>
                { heading && <Heading as="h6">{ heading }</Heading> }
                <div
                    className={ classes }
                    data-testid={ testId }
                >
                    {
                        authenticators.map((authenticator, index) => (
                            <div key={ index } className="inline">
                                <Popup
                                    on="hover"
                                    disabled={ !isAuthenticatorDisabled(authenticator) }
                                    content={ (
                                        <>
                                            <Label attached="top">
                                                <Icon name="info circle"/> Info
                                            </Label>
                                            { resolvePopupContent() }
                                        </>
                                    ) }
                                    trigger={ (
                                        <div>
                                            <LabeledCard
                                                multilineLabel
                                                className="authenticator-card"
                                                size="tiny"
                                                disabled={ isAuthenticatorDisabled(authenticator) }
                                                selected={
                                                    selectedAuthenticators.some((evalAuthenticator) => {
                                                        return evalAuthenticator.id === authenticator.id
                                                    })
                                                }
                                                image={ authenticator.image }
                                                label={
                                                    ApplicationManagementConstants
                                                        .AUTHENTICATOR_DISPLAY_NAMES.get(authenticator.name)
                                                    || authenticator.displayName
                                                    || defaultName
                                                }
                                                labelEllipsis={ true }
                                                data-testid={
                                                    `${ testId }-authenticator-${ authenticator.name }`
                                                }
                                                onClick={ () => handleAuthenticatorSelect(authenticator) }
                                            />
                                        </div>
                                    ) }
                                />
                            </div>
                        ))
                    }
                    {
                        isSocialLogin && allowSocialLoginAddition && (
                            <div className="inline">
                                <div>
                                    <LabeledCard
                                        multilineLabel
                                        className="authenticator-card"
                                        size="tiny"
                                        image={ getGeneralIcons()?.addCircleOutline }
                                        label={ t("common:add") }
                                        labelEllipsis={ true }
                                        data-testid={
                                            `${ testId }-authenticator-add`
                                        }
                                        imageOptions={ {
                                            as: "data-url"
                                        } }
                                        onClick={ handleSocialLoginAdd }
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
            </>
        )
        : (
            <>{ emptyPlaceholder }</>
        );
};

/**
 * Default props for the authenticators component.
 */
Authenticators.defaultProps = {
    "data-testid": "authenticators",
    defaultName: "Unknown",
    isSocialLogin: false
};
