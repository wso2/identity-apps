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
import { EmphasizedSegment, Heading, Hint, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { ScriptBasedFlow } from "./script-based-flow";
import { StepBasedFlow } from "./step-based-flow";
import { AppState, FeatureConfigInterface } from "../../../../core";
import { getRequestPathAuthenticators, updateAuthenticationSequence } from "../../../api";
import {
    AdaptiveAuthTemplateInterface,
    AuthenticationSequenceInterface,
    AuthenticationStepInterface
} from "../../../models";

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
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
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
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ sequence, setSequence ] = useState<AuthenticationSequenceInterface>(authenticationSequence);
    const [ updateTrigger, setUpdateTrigger ] = useState<boolean>(false);
    const [ adaptiveScript, setAdaptiveScript ] = useState<string | string[]>(undefined);
    const [ requestPathAuthenticators, setRequestPathAuthenticators ] = useState<any>(undefined);
    const [ selectedRequestPathAuthenticators, setSelectedRequestPathAuthenticators ] = useState<any>(undefined);
    const [ steps, setSteps ] = useState<number>(1);
    const [ isDefaultScript, setIsDefaultScript ] = useState<boolean>(true);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

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
    }, [] );

    /**
     * Updates the number of authentication steps.
     *
     * @param {boolean} add - Set to `true` to add and `false` to remove.
     */
    const updateSteps = (add: boolean): void => {
        setSteps(add ? steps + 1 : steps - 1);
    };

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

        setIsDefaultScript(false);
        let newSequence = { ...sequence };

        if (template.code) {
            newSequence = {
                ...newSequence,
                requestPathAuthenticators: selectedRequestPathAuthenticators,
                script: JSON.stringify(template.code)
            };
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
                        };
                    })
                });
            }

            newSequence = {
                ...newSequence,
                attributeStepId: 1,
                steps,
                subjectStepId: 1
            };
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
                script: JSON.stringify(adaptiveScript).replace(/\\n/g, "").slice(1, -1)
            }
        };

        updateAuthenticationSequence(appId, requestBody)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
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
                        description: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.error.description",
                            { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.error.message")
                    }));
                } else {
                    // Generic error message
                    dispatch(addAlert({
                        description: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.genericError." +
                            "description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "requestPathAuthenticators.notifications.getRequestPathAuthenticators.genericError.message")
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
            <Heading as="h4">{ t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                "requestPathAuthenticators.title") }</Heading>
            <Hint>{ t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                "requestPathAuthenticators.subTitle") }</Hint>
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
                                        };
                                    })
                                }
                                listen={
                                    (values) => {
                                        setSelectedRequestPathAuthenticators(values.get("requestPathAuthenticators"));
                                    }
                                }
                                readOnly={ readOnly }
                                data-testid={ `${ testId }-request-path-authenticators` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        </>
    );

    return (
        <EmphasizedSegment className="sign-on-methods-tab-content">
            <StepBasedFlow
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onUpdate={ handleSequenceUpdate }
                triggerUpdate={ updateTrigger }
                readOnly={
                    readOnly
                    || !hasRequiredScopes(featureConfig?.applications,
                        featureConfig?.applications?.scopes?.update,
                        allowedScopes)
                }
                data-testid={ `${ testId }-step-based-flow` }
                updateSteps={ updateSteps }
            />
            <ScriptBasedFlow
                authenticationSequence={ sequence }
                isLoading={ isLoading }
                onTemplateSelect={ handleLoadingDataFromTemplate }
                onScriptChange={ handleAdaptiveScriptChange }
                readOnly={
                    readOnly
                    || !hasRequiredScopes(featureConfig?.applications,
                        featureConfig?.applications?.scopes?.update,
                        allowedScopes)
                }
                data-testid={ `${ testId }-script-based-flow` }
                authenticationSteps={ steps }
                isDefaultScript={ isDefaultScript }
            />
            { requestPathAuthenticators && showRequestPathAuthenticators }
            {
                !readOnly
                && hasRequiredScopes(
                    featureConfig?.applications,
                    featureConfig?.applications?.scopes?.update,
                    allowedScopes)
                && (
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
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application sign-on-methods component.
 */
SignOnMethods.defaultProps = {
    "data-testid": "sign-on-methods"
};
