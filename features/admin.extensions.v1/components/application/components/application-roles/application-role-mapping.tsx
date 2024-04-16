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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import {
    ContentLoader,
    EmphasizedSegment,
    Heading,
    PrimaryButton
} from "@wso2is/react-components";
import React, { MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import { updateApplicationDetails } from "../../../../../admin.applications.v1/api";
import {
    AuthenticatorInterface as ApplicationAuthenticatorInterface,
    ApplicationInterface,
    IdpRoleMappingInterface
} from "../../../../../admin.applications.v1/models";
import { getAuthenticators } from "../../../../../admin.identity-providers.v1/api";
import { AuthenticatorInterface, AuthenticatorTypes } from "../../../../../admin.identity-providers.v1/models";
import { ApplicationRolesConstants } from "../../constants";

const FORM_ID: string = "application-role-mapping-form";

/**
 * Interface which captures create group props.
 */
interface AssignGroupProps extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    isReadOnly: boolean
    onUpdate: () => void;
}

/**
 * Component to handle the role mapping configuration in applications.
 *
 */
const ApplicationRoleMapping = (props: AssignGroupProps): ReactElement => {
    const {
        application,
        isReadOnly,
        onUpdate,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const [ isAuthenticatorRequestLoading, setAuthenticatorRequestLoading ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ attributeStepAuthenticators, setAttributeStepAuthenticators ]
        = useState<ApplicationAuthenticatorInterface[]>([]);
    const [ formInitialValues, setFormInitialValues ] = useState<Record<string, boolean>>({});
    const [ federatedAuthenticators, setFederatedAuthenticators ] = useState<AuthenticatorInterface[]>([]);
    const [ authenticatorGroups, setAuthenticatorGroups ] = useState<ApplicationAuthenticatorInterface[]>([]);

    useEffect(() => {
        getFederatedAuthenticators();
    }, []);

    useEffect(() => {
        getAttributeStepAuthenticators();
    }, [ application ]);

    useEffect(() => {
        if(federatedAuthenticators.length <= 0 || attributeStepAuthenticators.length <= 0) {
            return;
        }

        getAutheticatorGroups();
    }, [ federatedAuthenticators, attributeStepAuthenticators ]);

    /**
     * This functions gets the authenticators of the attribute step.
     */
    const getAttributeStepAuthenticators = () => {
        const attributeStepId: number = application?.authenticationSequence?.attributeStepId;

        if (attributeStepId) {
            setAttributeStepAuthenticators(application?.authenticationSequence?.steps[attributeStepId - 1]?.options);
        }
    };

    /**
     * Retrieves federated authenticators from the API.
     */
    const getFederatedAuthenticators = () => {
        setAuthenticatorRequestLoading(true);

        getAuthenticators(null, AuthenticatorTypes.FEDERATED)
            .then((response: AuthenticatorInterface[]) => {
                // Remove Organization Login federated authenticator from the list
                const filteredFederatedAuthenticators: AuthenticatorInterface[]
                = response.filter((authenticator: AuthenticatorInterface) => {
                    return authenticator.name !== ApplicationRolesConstants.ORGANIZATION_LOGIN;
                });

                setFederatedAuthenticators(filteredFederatedAuthenticators);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(
                        addAlert({
                            description: t(
                                "authenticationProvider:notifications" +
                                ".getIDPList.error.message",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "authenticationProvider:notifications.getIDPList.error.message"
                            )
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t(
                            "authenticationProvider:notifications" +
                            ".getIDPList.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "authenticationProvider:notifications" +
                            ".getIDPList.genericError.message"
                        )
                    })
                );
            }).finally(() => {
                setAuthenticatorRequestLoading(false);
            });
    };

    const getAutheticatorGroups = () => {
        // Filter the federated autheticators that are in the attribute step
        const filteredFederatedAuthenticators: ApplicationAuthenticatorInterface[]
        = attributeStepAuthenticators.filter((attributeStepAuthenticator: ApplicationAuthenticatorInterface) => {
            return federatedAuthenticators.find((federatedAuthenticator: AuthenticatorInterface) => {
                return federatedAuthenticator.name === attributeStepAuthenticator.idp;
            });
        });

        resolveApplicationRoleConfigurationFormValues(filteredFederatedAuthenticators);
        setAuthenticatorGroups(filteredFederatedAuthenticators);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * This function handles the submit action of the form.
     */
    const updateApplicationRoleConfigurations = (data: Record<string, boolean>) => {
        const appRoleConfigurationData: IdpRoleMappingInterface[] = [];

        // Iterate through the object
        for (const [ key, value ] of Object.entries(data)) {
            const appRoleConfiguration: IdpRoleMappingInterface = {
                idp: key,
                useAppRoleMappings: value
            };

            appRoleConfigurationData.push(appRoleConfiguration);
        }

        const applicationData: ApplicationInterface = {
            appRoleConfigurations: appRoleConfigurationData,
            id: application.id,
            name: application.name
        };

        setIsSubmitting(true);
        updateApplicationDetails(applicationData)
            .then(() => {
                handleAlerts({
                    description: t("extensions:console.applicationRoles.roleMapping.notifications.updateRole."+
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:console.applicationRoles.roleMapping.notifications.updateRole."+
                        "success.message")
                });
                onUpdate();
            })
            .catch(() => {
                handleAlerts({
                    description: t("extensions:console.applicationRoles.roleMapping.notifications.updateRole."+
                    "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:console.applicationRoles.roleMapping.notifications.updateRole."+
                    "genericError.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Get the application role configuration by idp name.
     */
    const getApplicationRoleConfigurationByIdpName = (idpName: string) => {
        const appRoleConfigurations: IdpRoleMappingInterface[] = application.appRoleConfigurations;

        if (appRoleConfigurations.length > 0) {
            const appRoleConfiguration: IdpRoleMappingInterface =  appRoleConfigurations.find(
                (appRoleConfiguration: IdpRoleMappingInterface) => (
                    appRoleConfiguration.idp === idpName
                ));

            return appRoleConfiguration?.useAppRoleMappings ?? false;
        }

        return false;
    };

    /**
     * Resolves the initial form values.
     */
    const resolveApplicationRoleConfigurationFormValues = (authenticators: ApplicationAuthenticatorInterface[] ) => {
        const initialFormValues: Record<string, boolean> = {};

        authenticators?.forEach((authenticator: ApplicationAuthenticatorInterface) => {
            initialFormValues[authenticator.idp] = getApplicationRoleConfigurationByIdpName(authenticator.idp);
        });

        setFormInitialValues(initialFormValues);
    };

    if (isAuthenticatorRequestLoading) {
        return (
            <EmphasizedSegment padded="very">
                <ContentLoader/>
            </EmphasizedSegment>
        );
    }

    return (
        authenticatorGroups?.length > 0
            ? (
                <>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column className="heading-wrapper" computer={ 10 }>
                                <Heading as="h4">
                                    {
                                        t("extensions:console.applicationRoles.roleMapping.heading")
                                    }
                                </Heading>
                                <Heading subHeading ellipsis as="h6" >
                                    {
                                        t("extensions:console.applicationRoles.roleMapping.subHeading")
                                    }
                                </Heading>
                            </Grid.Column >
                        </Grid.Row>
                    </Grid>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column computer={ 10 }>
                                <Form
                                    id={ FORM_ID }
                                    onSubmit={ (values: any) => updateApplicationRoleConfigurations(values) }
                                    ref={ formRef }
                                    uncontrolledForm={ false }
                                    initialValues={ formInitialValues }
                                >
                                    {
                                        authenticatorGroups?.map((
                                            authenticator: ApplicationAuthenticatorInterface,
                                            index: number
                                        ) => {
                                            return (
                                                <Field.Checkbox
                                                    key={ index }
                                                    ariaLabel={ `${ authenticator.idp }-checkbox` }
                                                    name={ authenticator.idp }
                                                    label={ authenticator.idp }
                                                    tabIndex={ 3 }
                                                    width={ 16 }
                                                    data-componentid={
                                                        `${ componentId }-${ authenticator.idp }-checkbox` }
                                                />
                                            );
                                        })
                                    }
                                </Form>
                                <Divider hidden />
                                <Grid.Row columns={ 1 } className="mt-6">
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <PrimaryButton
                                            size="small"
                                            loading={ isSubmitting }
                                            disabled={ isReadOnly }
                                            onClick={ () => {
                                                formRef?.current?.triggerSubmit();
                                            } }
                                            ariaLabel="Email provider form update button"
                                            data-componentid={ `${ componentId }-update-button` }
                                        >
                                            { t("extensions:develop.emailProviders" +
                                                    ".updateButton") }
                                        </PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </>
            )
            : null
    );
};

export default ApplicationRoleMapping;
