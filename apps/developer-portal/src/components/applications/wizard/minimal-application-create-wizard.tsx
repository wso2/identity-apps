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

import React, { ReactElement, FunctionComponent, useState } from "react";
import { TestableComponentInterface, AlertLevels } from "@wso2is/core/models";
import { ApplicationTemplateListItemInterface } from "../../../models";
import { Modal, Grid, Icon } from "semantic-ui-react";
import { Heading, PrimaryButton, LinkButton, URLInput } from "@wso2is/react-components";
import { useTranslation } from "react-i18next";
import { Forms, Field, useTrigger } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import { createApplication } from "../../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { history } from "../../../helpers";
import { AppConstants } from "../../../constants";
import isEmpty from "lodash/isEmpty";

/**
 * Specifies the template ID of SPAs.
 *
 * @constant
 *
 * @type {string}
 */
const SPA_TEMPLATE_ID = "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7";

interface MinimalApplicationCreateWizardPropsInterface extends TestableComponentInterface {
    title: string;
    closeWizard: () => void;
    template?: ApplicationTemplateListItemInterface;
    subTitle?: string;
    addProtocol: boolean;
    selectedProtocols?: string[];
    appId?: string;
    /**
     * Callback to update the application details.
     */
    onUpdate?: (id: string) => void;
}

export const MinimalAppCreateWizard: FunctionComponent<MinimalApplicationCreateWizardPropsInterface> = (
    props: MinimalApplicationCreateWizardPropsInterface
): ReactElement => {
    const [ callBackUrls, setCallBackUrls ] = useState("");
    const [ showURLError, setShowURLError ] = useState(false);

    const {
        title,
        closeWizard,
        template,
        subTitle,
        addProtocol,
        selectedProtocols,
        appId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [ submit, setSubmit ] = useTrigger();

    const handleWizardClose = (): void => {
        closeWizard();
    };

    /**
     * submitURL function.
     */
    let submitUrl: (callback: (url?: string) => void) => void;

    /**
     * Add regexp to multiple callbackUrls and update configs.
     *
     * @param {string} urls - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackUrlWithRegExp = (urls: string): string => {
        let callbackURL = urls.replace(/['"]+/g, "");
        if (callbackURL.split(",").length > 1) {
            callbackURL = "regexp=(" + callbackURL.split(",").join("|") + ")";
        }
        return callbackURL;
    };

    const resolveContent = (): ReactElement => {
        if (template.id === SPA_TEMPLATE_ID) {
            return (
                <Forms
                    onSubmit={ (values) => {
                        submitUrl((url: string) => {
                            if (isEmpty(callBackUrls) && isEmpty(url)) {
                                setShowURLError(true);
                            } else {
                                createApplication({
                                    accessUrl: "",
                                    advancedConfigurations: {
                                        discoverableByEndUsers: false,
                                    },
                                    authenticationSequence: {
                                        attributeStepId: 1,
                                        steps: [ {
                                            id: 1,
                                            options: [ {
                                                authenticator: "basic",
                                                idp: "LOCAL"
                                            } ]
                                        } ],
                                        subjectStepId: 1,
                                        type: "DEFAULT",
                                    },
                                    description: "OIDC web application::",
                                    imageUrl: "",
                                    inboundProtocolConfiguration: {
                                        oidc: {
                                            callbackURLs: [ buildCallBackUrlWithRegExp(url ? url : callBackUrls) ],
                                            grantTypes: [ "authorization_code" ],
                                            publicClient: false,
                                            state: "ACTIVE",
                                            validateRequestObjectSignature: false
                                        }
                                    },
                                    name: values.get("name")
                                }).then((response) => {
                                    dispatch(
                                        addAlert({
                                            description: t(
                                                "devPortal:components.applications.notifications." +
                                                "addApplication.success.description"
                                            ),
                                            level: AlertLevels.SUCCESS,
                                            message: t(
                                                "devPortal:components.applications.notifications." +
                                                "addApplication.success.message"
                                            )
                                        })
                                    );

                                    // The created resource's id is sent as a location header.
                                    // If that's available, navigate to the edit page.
                                    if (!isEmpty(response.headers.location)) {
                                        const location = response.headers.location;
                                        const createdAppID = location.substring(location.lastIndexOf("/") + 1);

                                        history.push(
                                            AppConstants.PATHS.get("APPLICATION_EDIT").replace(":id", createdAppID)
                                        );

                                        return;
                                    }

                                    // Fallback to applications page, if the location header is not present.
                                    history.push(AppConstants.PATHS.get("APPLICATIONS"));
                                }).catch((error) => {
                                    if (error.response && error.response.data && error.response.data.description) {
                                        dispatch(addAlert({
                                            description: error.response.data.description,
                                            level: AlertLevels.ERROR,
                                            message: t("devPortal:components.applications.notifications." +
                                                "addApplication.error.message")
                                        }));

                                        return;
                                    }

                                    dispatch(addAlert({
                                        description: t("devPortal:components.applications.notifications." +
                                            "addApplication.genericError" +
                                            ".description"),
                                        level: AlertLevels.ERROR,
                                        message: t("devPortal:components.applications.notifications." +
                                            "addApplication.genericError.message")
                                    }));
                                });
                            }
                        });
                    } }
                    submitState={ submit }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    name="name"
                                    label={ t(
                                        "devPortal:components.applications.forms.generalDetails.fields.name.label"
                                    ) }
                                    required={ true }
                                    requiredErrorMessage={ t(
                                        "devPortal:components.applications.forms.generalDetails.fields.name" +
                                        ".validations.empty"
                                    ) }
                                    placeholder={ t(
                                        "devPortal:components.applications.forms.generalDetails.fields.name.placeholder"
                                    ) }
                                    type="text"
                                    data-testid={ `${ testId }-application-name-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <URLInput
                                    urlState={ callBackUrls }
                                    setURLState={ setCallBackUrls }
                                    labelName={ t(
                                        "devPortal:components.applications.forms.inboundOIDC.fields.callBackUrls.label"
                                    ) }
                                    placeholder={ t(
                                        "devPortal:components.applications.forms.inboundOIDC.fields.callBackUrls" +
                                        ".placeholder"
                                    ) }
                                    validationErrorMsg={ t(
                                        "devPortal:components.applications.forms.inboundOIDC.fields.callBackUrls" +
                                        ".validations.empty"
                                    ) }
                                    validation={ (value: string) => {
                                        return FormValidation.url(value);
                                    } }
                                    computerWidth={ 10 }
                                    setShowError={ setShowURLError }
                                    showError={ showURLError }
                                    hint={ t(
                                        "devPortal:components.applications.forms.inboundOIDC.fields.callBackUrls.hint"
                                    ) }
                                    addURLTooltip={ t("common:addURL") }
                                    duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                    data-testid={ `${ testId }-callback-url-input` }
                                    getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                                        submitUrl = submitFunction;
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            );
        }
    };

    return (
        <Modal
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            onClose={ handleWizardClose }
            closeOnDimmerClick
            closeOnEscape
            data-testid={ `${ testId }-modal` }
        >
            <Modal.Header className="wizard-header">
                { title }
                { subTitle && <Heading as="h6">{ subTitle }</Heading> }
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { resolveContent() }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ handleWizardClose }>
                                Cancel
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                onClick={ () => {
                                    setSubmit();
                                } }
                                data-testid={ `${ testId }-next-button` }
                            >
                                { t("common:register") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
            <div>

            </div>
        </Modal>
    );
};

/**
 * Default props for the application creation wizard.
 */
MinimalAppCreateWizard.defaultProps = {
    "data-testid": "application-create-wizard"
};
