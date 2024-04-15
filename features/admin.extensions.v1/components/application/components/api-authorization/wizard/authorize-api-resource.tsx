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

import Button from "@oxygen-ui/react/Button";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, LinkInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, useTrigger } from "@wso2is/forms";
import {
    Code,
    ContentLoader,
    DocumentationLink,
    Heading,
    Hint,
    LinkButton,
    Message,
    Popup,
    PrimaryButton,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Grid, Header, Modal } from "semantic-ui-react";
import { AppState } from "../../../../../../admin.core.v1/store";
import { useAPIResources } from "../../../../../../admin.api-resources.v1/api";
import { APIResourcesConstants } from "../../../../../../admin.api-resources.v1/constants";
import { APIResourceInterface, APIResourcePermissionInterface } from "../../../../../../admin.api-resources.v1/models";
import { Policy, PolicyInfo, policyDetails } from "../../../constants";
import { AuthorizedAPIListItemInterface } from "../../../models";

interface AuthorizeAPIResourcePropsInterface extends IdentifiableComponentInterface {
    /**
     * List of subscribed API Resources
     */
    subscribedAPIResourcesListData: AuthorizedAPIListItemInterface[],
    /**
     * Close the wizard.
     */
    closeWizard: () => void;
    /**
     * Invoke authorized API resource creation.
     */
    handleCreateAPIResource: (apiId: string, scopes: string[], policyIdentifier: string, callback: () => void) => void;
}

/**
 * API resource wizard.
 * TODO: Add a message box to show why authorized scopes field is disabled.
 */
export const AuthorizeAPIResource: FunctionComponent<AuthorizeAPIResourcePropsInterface> = (
    props: AuthorizeAPIResourcePropsInterface
): ReactElement => {

    const {
        subscribedAPIResourcesListData,
        closeWizard,
        handleCreateAPIResource,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();
    const [ submitForm, setSubmitForm ] = useTrigger();
    const productName: string = useSelector((state: AppState) => state.config.ui.productName);

    const [ allAPIResourcesListData, setAllAPIResourcesListData ] = useState<APIResourceInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isAPIResourcesListLoading, setIsAPIResourcesListLoading ] = useState<boolean>(false);
    const [ apiCallNextAfterValue, setAPICallNextAfterValue ] = useState<string>(null);
    const [ selectedAPIResource, setSelectedAPIResource ] = useState<APIResourceInterface>(null);
    const [ selectedAPIResourceRequiresAuthorization, setSelectedAPIResourceRequiresAuthorization ]
        = useState<boolean>(true);
    const [ authorizedScopes, setAuthorizedScopes ] = useState<string[]>([]);
    const [ allAPIResourcesDropdownOptions, setAllAPIResourcesDropdownOptions ] = useState<DropdownItemProps[]>([]);
    const [ scopesDropdownOptions, setScopesDropdownOptions ] = useState<DropdownItemProps[]>([]);
    const [ isScopesDropdownLoading, setIsScopesDropdownLoading ] = useState<boolean>(false);
    const [ policyDropdownOptions, setPolicyDropdownOptions ] = useState<DropdownItemProps[]>([]);
    const [ isPolicyDropdownLoading, setIsPolicyDropdownLoading ] = useState<boolean>(false);
    const [ selectedPolicy, setSelectedPolicy ] = useState<Policy>(Policy.ROLE);
    const [ isSelectAllHidden, setIsSelectAllHidden ] = useState<boolean>(false);
    const [ isSelectNoneHidden, setIsSelectNoneHidden ] = useState<boolean>(true);

    const {
        data: currentAPIResourcesListData,
        isLoading: iscurrentAPIResourcesListLoading,
        error: currentAPIResourcesFetchRequestError,
        mutate: mutatecurrentAPIResourcesList
    } = useAPIResources(apiCallNextAfterValue);

    /**
     * The following useEffect is used to handle if any error occurs while fetching API resources.
     */
    useEffect(() => {
        if (currentAPIResourcesFetchRequestError) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                    ".apiSubscriptions.notifications.createAuthorizedAPIResource.initialError" +
                    ".description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                    ".apiSubscriptions.notifications.createAuthorizedAPIResource.initialError.message")
            }));
            closeWizard();
        }
    }, [ currentAPIResourcesFetchRequestError ]);

    /**
     * Assign all the API resources to the dropdown options if the after value is not null.
     */
    useEffect(() => {
        if (!isAPIResourcesListLoading) {
            setIsAPIResourcesListLoading(true);
        }

        let afterValue: string;

        if (currentAPIResourcesListData) {
            const filteredDropdownItemOptions: DropdownItemProps[] =
                (currentAPIResourcesListData?.apiResources.reduce(function (filtered: DropdownItemProps[],
                    apiResource: APIResourceInterface) {

                    const isCurrentAPIResourceSubscribed: boolean = subscribedAPIResourcesListData?.length === 0
                        || !subscribedAPIResourcesListData?.some(
                            (subscribedAPIResource: AuthorizedAPIListItemInterface) =>
                                subscribedAPIResource.apiIdentifier === apiResource.identifier);

                    if (isCurrentAPIResourceSubscribed) {
                        const isCurrentAPIResourceAlreadyAdded: boolean = allAPIResourcesDropdownOptions.length === 0
                            || !allAPIResourcesDropdownOptions?.some(
                                (dropdownOption: DropdownItemProps) => dropdownOption.key === apiResource.id);

                        if (isCurrentAPIResourceAlreadyAdded) {
                            filtered.push({
                                key: apiResource.id,
                                text: apiResource.displayName,
                                value: apiResource.id
                            });
                        }
                    }

                    return filtered;
                }, []));

            setAllAPIResourcesDropdownOptions([
                ...allAPIResourcesDropdownOptions,
                ...filteredDropdownItemOptions ? filteredDropdownItemOptions : []
            ]);

            // Add the current API resources to the all API resources list.
            setAllAPIResourcesListData([ ...allAPIResourcesListData, ...currentAPIResourcesListData.apiResources ]);

            // Check if there are more API resources to be fetched.
            let isAfterValueExists: boolean = false;

            currentAPIResourcesListData?.links?.forEach((value: LinkInterface) => {
                if (value.rel === APIResourcesConstants.AFTER_REL) {
                    afterValue = value.href.split(`${APIResourcesConstants.AFTER_REL}=`)[1];

                    if (afterValue !== apiCallNextAfterValue) {
                        setAPICallNextAfterValue(afterValue);
                        isAfterValueExists = true;
                    }
                }
            });

            if (isAfterValueExists) {
                mutatecurrentAPIResourcesList();
            } else {
                setIsAPIResourcesListLoading(false);
            }
        }
    }, [ currentAPIResourcesListData ]);

    /**
     * Assign scopes to the scopes dropdown options.
     */
    useEffect(() => {
        setIsScopesDropdownLoading(true);
        if (selectedAPIResource) {

            setScopesDropdownOptions(selectedAPIResource?.permissions.map((scope: APIResourcePermissionInterface) => {
                return {
                    content: (
                        <Header
                            as="h6"
                            className="header-with-icon"
                        >
                            <Header.Content>
                                { scope.displayName }
                                <Header.Subheader>
                                    <Code withBackground>{ scope.name }</Code>
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    ),
                    key: scope.name,
                    text: scope.displayName,
                    value: scope.name
                };
            }));
            setAuthorizedScopes([]);

        }
        setIsScopesDropdownLoading(false);
    }, [ selectedAPIResource ]);

    /**
     * Assign policies to the policies dropdown options.
     */
    useEffect(() => {
        setIsPolicyDropdownLoading(true);

        const policies: DropdownItemProps[] = [];

        policyDetails.forEach((value: PolicyInfo, key: Policy) => {
            policies.push({
                key: key,
                text: value.name(),
                value: value.policyIdentifier()
            });
        });

        setPolicyDropdownOptions(policies);

        setIsPolicyDropdownLoading(false);
    }, []);

    /**
     * Update the selected API resource requires authorization value.
     */
    useEffect(() => {
        if (selectedAPIResource) {
            setSelectedAPIResourceRequiresAuthorization(selectedAPIResource.requiresAuthorization);
        }
    }, [ selectedAPIResource ]);

    /**
     * Update the select all visibility.
     */
    useEffect(() => {
        setIsSelectAllHidden(selectedAPIResource?.permissions.length === authorizedScopes?.length);
    }, [ selectedAPIResource, authorizedScopes ]);

    /**
     * Update the select none visibility.
     */
    useEffect(() => {
        setIsSelectNoneHidden(authorizedScopes?.length === 0);
    }, [ authorizedScopes ]);


    /**
     * Set the selected API resource ID.
     */
    const handleAPIResourceDropdownChange = (isPure: boolean, values: Map<string, FormValue>) => {
        const currentAPIResourceId: string = values.get("apiResource").toString();
        const currentPolicy: Policy = values.get("policy").toString() as Policy;

        if (currentAPIResourceId !== selectedAPIResource?.id) {
            const currentAPIResource: APIResourceInterface = allAPIResourcesListData?.find(
                (apiResource: APIResourceInterface) => {
                    return apiResource.id === currentAPIResourceId;
                }
            );

            setSelectedAPIResource(currentAPIResource);

            const selectedAPIResourceRequiresAuthorization: boolean = currentAPIResource.requiresAuthorization;

            if (selectedAPIResourceRequiresAuthorization) {
                values.set("policy", Policy.ROLE);
                setSelectedPolicy(Policy.ROLE);
            }
        }

        if (currentPolicy !== selectedPolicy) {
            setSelectedPolicy(currentPolicy);
        }
    };

    /**
     * Handle the scopes dropdown change.
     */
    const handleScopesDropdownChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const scopes: string[] = data.value as string[];

        // Set the authorized scopes that are only in the selected API resource.
        setAuthorizedScopes(data.options.filter((option: DropdownItemProps) => {
            if (scopes.includes(option.value.toString())) {
                return option;
            }
        }).map((option: DropdownItemProps) => option.value.toString()));
    };

    const handleBulkDropdownChange = (remove: boolean) => {

        if (remove) {
            setAuthorizedScopes([]);
        } else {
            setAuthorizedScopes(selectedAPIResource?.permissions.map((scope: APIResourcePermissionInterface) => {
                return scope.name;
            }));
        }
    };

    /**
     * Handle the form submission.
     */
    const handleFormSubmit = () => {
        setIsSubmitting(true);
        handleCreateAPIResource(selectedAPIResource.id, authorizedScopes, selectedPolicy.toString(), callBack);
    };

    /**
     * Callback after the API resource is authorized.
     */
    const callBack = () => {
        setIsSubmitting(false);
        setAllAPIResourcesDropdownOptions([]);
    };

    return (
        <Modal
            data-testid={ componentId }
            open={ true }
            className="wizard api-resource-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("extensions:develop.applications.edit.sections.apiAuthorization.sections.apiSubscriptions." +
                    "wizards.authorizeAPIResource.title") }
                <Heading as="h6">
                    { t("extensions:develop.applications.edit.sections.apiAuthorization.sections.apiSubscriptions." +
                        "wizards.authorizeAPIResource.subTitle") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                {
                    iscurrentAPIResourcesListLoading || isAPIResourcesListLoading
                        ? <ContentLoader inline="centered" active />
                        : (<Forms
                            data-componentid={ `${componentId}-form` }
                            uncontrolledForm={ false }
                            onChange={ handleAPIResourceDropdownChange }
                            onSubmit={ handleFormSubmit }
                            submitState={ submitForm }
                        >
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                        <Field
                                            data-componentid={ `${componentId}-api` }
                                            label={ t("extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                "authorizeAPIResource.fields.apiResource.label") }
                                            placeholder={ t("extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                "authorizeAPIResource.fields.apiResource.placeholder") }
                                            type="dropdown"
                                            name="apiResource"
                                            key="apiResource"
                                            children={ allAPIResourcesDropdownOptions }
                                            tabIndex={ 3 }
                                            required={ true }
                                            requiredErrorMessage={ t("extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                "authorizeAPIResource.fields.apiResource.requiredErrorMessage") }
                                            search
                                            selection
                                            scrolling
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                        <Grid>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column
                                                    className="pb-1"
                                                    floated="left"
                                                    stretched
                                                    verticalAlign="bottom"
                                                >
                                                    <label>
                                                        <Text
                                                            size={ 13 }
                                                            className="mb-1"
                                                            muted={ !selectedAPIResource }
                                                        >
                                                            { t("extensions:develop.applications.edit.sections." +
                                                                "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                                "authorizeAPIResource.fields.scopes.label") }
                                                        </Text>
                                                    </label>
                                                </Grid.Column>
                                                <Grid.Column floated="right" textAlign="right">
                                                    <Text className="mb-0" muted subHeading size={ 12 }>
                                                        <Button
                                                            variant="text"
                                                            size="small"
                                                            disabled={ !selectedAPIResource || isSelectAllHidden }
                                                            onClick={ () => handleBulkDropdownChange(false) }
                                                        >
                                                            {
                                                                t("extensions:develop.applications.edit." +
                                                                    "sections.apiAuthorization.sections." +
                                                                    "apiSubscriptions.scopesSection.selectAll")
                                                            }
                                                        </Button>
                                                        |
                                                        <Button
                                                            variant="text"
                                                            size="small"
                                                            disabled={ !selectedAPIResource || isSelectNoneHidden }
                                                            onClick={ () => handleBulkDropdownChange(true) }
                                                        >
                                                            {
                                                                t("extensions:develop.applications.edit.sections" +
                                                                    ".apiAuthorization.sections.apiSubscriptions." +
                                                                    "scopesSection.selectNone")
                                                            }
                                                        </Button>
                                                    </Text>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                        <Dropdown
                                            className="mb-3"
                                            data-componentid={ `${componentId}-scopes` }
                                            placeholder={ t("extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                "authorizeAPIResource.fields.scopes.placeholder") }
                                            fluid
                                            multiple
                                            search
                                            selection
                                            required={ true }
                                            value={ authorizedScopes }
                                            onChange={ handleScopesDropdownChange }
                                            loading={ isScopesDropdownLoading }
                                            options={ scopesDropdownOptions }
                                            disabled={ !selectedAPIResource }
                                        />
                                        <Hint disabled={ !selectedAPIResource }>
                                            { t("extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                "authorizeAPIResource.fields.scopes.hint") }
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={ 1 } className="pt-2">
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                        <Popup
                                            content={ t("extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                "authorizeAPIResource.rbacPolicyMessage",
                                            { productName }) }
                                            disabled={ !selectedAPIResource
                                                || !selectedAPIResourceRequiresAuthorization }
                                            inverted
                                            trigger={ (
                                                <label>
                                                    <Text
                                                        size={ 13 }
                                                        className="mb-1"
                                                        muted={ !selectedAPIResource
                                                            || selectedAPIResourceRequiresAuthorization }
                                                    >
                                                        { t("extensions:develop.applications.edit.sections." +
                                                            "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                            "authorizeAPIResource.fields.policy.label") }
                                                    </Text>
                                                </label>
                                            ) }
                                        />
                                        <Field
                                            data-componentid={ `${componentId}-policy` }
                                            type="dropdown"
                                            name="policy"
                                            key="policy"
                                            children={ policyDropdownOptions }
                                            tabIndex={ 4 }
                                            default={ policyDetails.get(Policy.ROLE).policyIdentifier() }
                                            loading={ isPolicyDropdownLoading }
                                            disabled={ !selectedAPIResource
                                                || selectedAPIResourceRequiresAuthorization }
                                            search
                                            selection
                                            scrolling
                                        />
                                        <Hint
                                            className="mb-1"
                                            disabled={ !selectedAPIResource
                                                || selectedAPIResourceRequiresAuthorization }>
                                            { t("extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                "authorizeAPIResource.fields.policy.hint") }
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                                { /* Need to add doc links to the following content of the message box */ }
                                {
                                    selectedAPIResource && (
                                        <Grid.Row columns={ 1 } className="pt-0">
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                <Message
                                                    type="info"
                                                    header={ policyDetails.get(selectedPolicy).name() }
                                                    content={
                                                        (<>
                                                            { policyDetails.get(selectedPolicy).hint() }
                                                            <DocumentationLink
                                                                link={
                                                                    getLink(policyDetails.get(selectedPolicy)
                                                                        .documentationLink())
                                                                }
                                                            >
                                                                { t("extensions:common.learnMore") }
                                                            </DocumentationLink>
                                                        </>)
                                                    }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                }
                            </Grid>
                        </Forms>)
                }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                tabIndex={ 5 }
                                data-testid={ `${componentId}-cancel-button` }
                                floated="left"
                                onClick={ closeWizard }
                                disabled={ isSubmitting }
                            >
                                { t("extensions:develop.applications.edit.sections." +
                                        "apiAuthorization.sections.apiSubscriptions.wizards." +
                                        "authorizeAPIResource.buttons.cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                tabIndex={ 6 }
                                data-testid={ `${componentId}-finish-button` }
                                floated="right"
                                onClick={ setSubmitForm }
                                loading={ isSubmitting }
                            >
                                { t("extensions:develop.applications.edit.sections." +
                                        "apiAuthorization.sections.apiSubscriptions.wizards." +
                                        "authorizeAPIResource.buttons.finish") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

AuthorizeAPIResource.defaultProps = {
    "data-componentid": "authorize-api-resource"
};
