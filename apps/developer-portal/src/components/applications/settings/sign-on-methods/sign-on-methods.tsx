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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms } from "@wso2is/forms";
import { Heading, Hint, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { ScriptBasedFlow } from "./script-based-flow";
import { StepBasedFlow } from "./step-based-flow";
import { getRequestPathAuthenticators, updateAuthenticationSequence } from "../../../../api";
import {
    AdaptiveAuthTemplateInterface,
    AuthenticationSequenceInterface,
    AuthenticationStepInterface,
    FeatureConfigInterface
} from "../../../../models";

/**
 * Proptypes for the sign on methods component.
 */
interface SignOnMethodsPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * ID of the application.
     */
    appId?: string;
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
}

/**
 * Configure the different sign on strategies for an application.
 *
 * @param {SignOnMethodsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SignOnMethods: FunctionComponent<SignOnMethodsPropsInterface> = (
    props: SignOnMethodsPropsInterface
): ReactElement => {

    const {
        appId,
        authenticationSequence,
        featureConfig,
        isLoading,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ sequence, setSequence ] = useState<AuthenticationSequenceInterface>(authenticationSequence);
    const [ updateTrigger, setUpdateTrigger ] = useState<boolean>(false);
    const [ adaptiveScript, setAdaptiveScript ] = useState<string | string[]>(undefined);
    const [ requestPathAuthenticators, setRequestPathAuthenticators ] = useState<any>(undefined);
    const [ selectedRequestPathAuthenticators, setSelectedRequestPathAuthenticators ] = useState<any>(undefined);

    /**
     * Toggles the update trigger.
     */
    useEffect(() => {
        if (!updateTrigger) {
            return;
        }

        setUpdateTrigger(false);
    }, [ updateTrigger ]);

    /**
     * Fetch data on component load
     */
    useEffect(() => {
        fetchRequestPathAuthenticators();
    }, [ props ]);

    /**
     * Handles the data loading from a adaptive auth template when it is selected
     * from the panel.
     *
     * @param {AdaptiveAuthTemplateInterface} template - Adaptive authentication templates.
     */
    const handleLoadingDataFromTemplate = (template: AdaptiveAuthTemplateInterface) => {
        if (!template) {
            return;
        }

        let newSequence = { ...sequence };

        if (template.code) {
            newSequence = {
                ...newSequence,
                requestPathAuthenticators: selectedRequestPathAuthenticators,
                script: JSON.stringify(template.code)
            }
        }

        if (template.defaultAuthenticators) {
            const steps: AuthenticationStepInterface[] = [];

            for (const [ key, value ] of Object.entries(template.defaultAuthenticators)) {
                steps.push({
                    id: parseInt(key, 10),
                    options: value.local.map((authenticator) => {
                        return {
                            authenticator,
                            idp: "LOCAL"
                        }
                    })
                })
            }

            newSequence = {
                ...newSequence,
                attributeStepId: 1,
                steps,
                subjectStepId: 1
            }
        }

        setSequence(newSequence);
    };

    /**
     * Handles authentication sequence update.
     */
    const handleSequenceUpdate = (sequence: AuthenticationSequenceInterface) => {
        const requestBody = {
            authenticationSequence: {
                ...sequence,
                requestPathAuthenticators: selectedRequestPathAuthenticators,
                script: JSON.stringify(adaptiveScript)
            }
        };

        updateAuthenticationSequence(appId, requestBody)
            .then(() => {
                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.updateAuthenticationFlow" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.applications.notifications.updateAuthenticationFlow" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.updateAuthenticationFlow" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.updateAuthenticationFlow" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.updateAuthenticationFlow" +
                        ".genericError.message")
                }));
            });
    };

    const fetchRequestPathAuthenticators = (): void => {
        getRequestPathAuthenticators()
            .then((response) => {
                setRequestPathAuthenticators(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert({
                        description: t("devPortal:components.serverConfigs.requestPathAuthenticators." +
                            "notifications.getRequestPathAuthenticators.error.description",
                            { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.serverConfigs.requestPathAuthenticators." +
                            "notifications.getRequestPathAuthenticators.error.message")
                    }));
                } else {
                    // Generic error message
                    dispatch(addAlert({
                        description: t("devPortal:components.serverConfigs.requestPathAuthenticators." +
                            "notifications.getRequestPathAuthenticators.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.serverConfigs.requestPathAuthenticators." +
                            "notifications.getRequestPathAuthenticators.genericError.message")
                    }));
                }
            });
    };

    /**
     * Handles adaptive script change event.
     *
     * @param {string | string[]} script - Adaptive script from the editor.
     */
    const handleAdaptiveScriptChange = (script: string | string[]): void => {
        setAdaptiveScript(script);
    };

    /**
     * Handles the update button click event.
     */
    const handleUpdateClick = (): void => {
        setUpdateTrigger(true);
    };

    const showRequestPathAuthenticators: ReactElement = (
        <>
            <Divider />
            <Heading as="h4">{ t("devPortal:components.serverConfigs.requestPathAuthenticators.title") }</Heading>
            <Hint>{ t("devPortal:components.serverConfigs.requestPathAuthenticators.subTitle") }</Hint>
            <Forms>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name="requestPathAuthenticators"
                                label=""
                                type="checkbox"
                                required={ false }
                                value={ authenticationSequence?.requestPathAuthenticators }
                                requiredErrorMessage=""
                                children={
                                    requestPathAuthenticators?.map(authenticator => {
                                        return {
                                            label: authenticator.displayName,
                                            value: authenticator.name
                                        }
                                    })
                                }
                                listen={
                                    (values) => {
                                        setSelectedRequestPathAuthenticators(values.get("requestPathAuthenticators"));
                                    }
                                }
                                data-testid={ `${ testId }-request-path-authenticators` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        </>
    );

    return (
        <div className="sign-on-methods-tab-content">
            <StepBasedFlow
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onUpdate={ handleSequenceUpdate }
                triggerUpdate={ updateTrigger }
                readOnly={
                    !hasRequiredScopes(featureConfig?.applications, featureConfig?.applications?.scopes?.update)
                }
                data-testid={ `${ testId }-step-based-flow` }
            />
            <Divider />
            <ScriptBasedFlow
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onTemplateSelect={ handleLoadingDataFromTemplate }
                onScriptChange={ handleAdaptiveScriptChange }
                readOnly={
                    !hasRequiredScopes(featureConfig?.applications, featureConfig?.applications?.scopes?.update)
                }
                data-testid={ `${ testId }-script-based-flow` }
            />
            { requestPathAuthenticators && showRequestPathAuthenticators }
            {
                hasRequiredScopes(featureConfig?.applications, featureConfig?.applications?.scopes?.update) && (
                    <>
                        <Divider hidden />
                        <PrimaryButton
                            onClick={ handleUpdateClick }
                            data-testid={ `${ testId }-update-button` }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </>
                )
            }
        </div>
    );
};

/**
 * Default props for the application sign-on-methods component.
 */
SignOnMethods.defaultProps = {
    "data-testid": "sign-on-methods"
};
