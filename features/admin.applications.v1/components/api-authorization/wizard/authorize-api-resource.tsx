/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { useAPIResources } from "@wso2is/admin.api-resources.v2/api";
import { APIResourceCategories, APIResourcesConstants } from "@wso2is/admin.api-resources.v2/constants";
import { APIResourceInterface, APIResourcePermissionInterface } from "@wso2is/admin.api-resources.v2/models";
import { APIResourceUtils } from "@wso2is/admin.api-resources.v2/utils/api-resource-utils";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, LinkInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Code,
    ContentLoader,
    DocumentationLink,
    Heading,
    Hint,
    LinkButton,
    Message,
    PrimaryButton,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import startCase from "lodash-es/startCase";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, Grid, Header, Label, Modal } from "semantic-ui-react";
import useScopesOfAPIResources from "../../../api/use-scopes-of-api-resources";
import { Policy, PolicyInfo, policyDetails } from "../../../constants/api-authorization";
import { AuthorizedAPIListItemInterface } from "../../../models/api-authorization";
import { ApplicationTemplateIdTypes } from "../../../models/application";

interface AuthorizeAPIResourcePropsInterface extends IdentifiableComponentInterface {
    /**
     * Template ID.
     */
    templateId: string,
    /**
     * Original Template ID.
     */
    originalTemplateId?: string,
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
 */
export const AuthorizeAPIResource: FunctionComponent<AuthorizeAPIResourcePropsInterface> = (
    props: AuthorizeAPIResourcePropsInterface
): ReactElement => {

    const {
        templateId,
        originalTemplateId,
        subscribedAPIResourcesListData,
        closeWizard,
        handleCreateAPIResource,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const resourceText: string = originalTemplateId === "mcp-client-application"
        ? t("extensions:develop.applications.edit.sections.apiAuthorization.resourceText.genericResource")
        : t("extensions:develop.applications.edit.sections.apiAuthorization.resourceText.apiResource");

    const [ allAPIResourcesListData, setAllAPIResourcesListData ] = useState<APIResourceInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isAPIResourcesListLoading, setIsAPIResourcesListLoading ] = useState<boolean>(false);
    const [ apiCallNextAfterValue, setAPICallNextAfterValue ] = useState<string>(null);
    const [ selectedAPIResource, setSelectedAPIResource ] = useState<APIResourceInterface>(null);
    const [ selectedAPIResourceRequiresAuthorization, setSelectedAPIResourceRequiresAuthorization ]
        = useState<boolean>(true);
    const [ authorizedScopes, setAuthorizedScopes ] = useState<DropdownItemProps[]>([]);
    const [ allAPIResourcesDropdownOptions, setAllAPIResourcesDropdownOptions ] = useState<DropdownItemProps[]>([]);
    const [ scopesDropdownOptions, setScopesDropdownOptions ] = useState<DropdownItemProps[]>([]);
    const [ isScopesDropdownLoading, setIsScopesDropdownLoading ] = useState<boolean>(false);
    const [ policyDropdownOptions, setPolicyDropdownOptions ] = useState<DropdownItemProps[]>([]);
    const [ isPolicyDropdownLoading, setIsPolicyDropdownLoading ] = useState<boolean>(false);
    const [ selectedPolicy, setSelectedPolicy ] = useState<DropdownItemProps>({
        key: Policy.ROLE,
        text: policyDetails.get(Policy.ROLE).name(),
        value: policyDetails.get(Policy.ROLE).policyIdentifier()
    });
    const [ isSelectAllHidden, setIsSelectAllHidden ] = useState<boolean>(false);
    const [ isSelectNoneHidden, setIsSelectNoneHidden ] = useState<boolean>(true);
    const [ m2mApplication, setM2MApplication ] = useState<boolean>(false);
    const [ isScopeSelectDropdownReady, setIsScopeSelectDropdownReady ] = useState<boolean>(true);

    const {
        data: currentAPIResourcesListData,
        isLoading: iscurrentAPIResourcesListLoading,
        error: currentAPIResourcesFetchRequestError,
        mutate: mutatecurrentAPIResourcesList
    } = useAPIResources(apiCallNextAfterValue);

    const {
        data: currentAPIResourceScopeListData,
        isLoading: isCurrentAPIResourceScopeListDataLoading,
        error: currentAPIResourceScopeListFetchError,
        mutate: mutatecurrentAPIResourceScopeList
    } = useScopesOfAPIResources(selectedAPIResource?.id);

    useEffect(() => {
        setIsScopeSelectDropdownReady(selectedAPIResource && (
            !currentAPIResourceScopeListData
            || isCurrentAPIResourceScopeListDataLoading
            || currentAPIResourceScopeListData?.length === 0
        ));
    },[ selectedAPIResource,currentAPIResourceScopeListData, iscurrentAPIResourcesListLoading ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching API resources.
     */
    useEffect(() => {
        if (currentAPIResourcesFetchRequestError || currentAPIResourceScopeListFetchError) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.description", {
                    resourceText: resourceText
                }),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.message", {
                    resourceText: resourceText
                })
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
                                subscribedAPIResource.identifier === apiResource.identifier);

                    if (isCurrentAPIResourceSubscribed) {
                        const isCurrentAPIResourceAlreadyAdded: boolean = allAPIResourcesDropdownOptions.length === 0
                            || !allAPIResourcesDropdownOptions?.some(
                                (dropdownOption: DropdownItemProps) => dropdownOption.key === apiResource.id);

                        if (isCurrentAPIResourceAlreadyAdded) {
                            filtered.push({
                                identifier: apiResource?.identifier,
                                key: apiResource.id,
                                text: apiResource.name,
                                type: apiResource.type,
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
                if (value.rel === APIResourcesConstants.NEXT_REL) {
                    afterValue = value.href.split(`${APIResourcesConstants.AFTER}=`)[1];

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
        if (selectedAPIResource && !isCurrentAPIResourceScopeListDataLoading) {

            setScopesDropdownOptions(currentAPIResourceScopeListData?.map((scope: APIResourcePermissionInterface) => {
                return {
                    key: scope.name,
                    text: scope.displayName,
                    value: scope.name
                };
            }));
            setAuthorizedScopes([]);
            setIsScopesDropdownLoading(false);
        }
    }, [ selectedAPIResource, currentAPIResourceScopeListData ]);

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
        setIsSelectAllHidden(currentAPIResourceScopeListData?.length === authorizedScopes?.length);
    }, [ selectedAPIResource, authorizedScopes ]);

    /**
     * Update the select none visibility.
     */
    useEffect(() => {
        setIsSelectNoneHidden(authorizedScopes?.length === 0);
    }, [ authorizedScopes ]);

    /**
     * Check whether application is an M2M application.
     */
    useEffect(() => {
        setM2MApplication(templateId == ApplicationTemplateIdTypes.M2M_APPLICATION);
    }, [ templateId ]);

    /**
     * Set the selected API resource ID.
     */
    const handleAPIResourceSelect = (data: DropdownProps) => {
        const currentAPIResourceId: string = data?.key;

        if (currentAPIResourceId !== selectedAPIResource?.id) {
            const currentAPIResource: APIResourceInterface = allAPIResourcesListData?.find(
                (apiResource: APIResourceInterface) => {
                    return apiResource.id === currentAPIResourceId;
                }
            );

            setSelectedAPIResource(currentAPIResource);
            mutatecurrentAPIResourceScopeList();

            const selectedAPIResourceRequiresAuthorization: boolean = currentAPIResource?.requiresAuthorization;

            if (selectedAPIResourceRequiresAuthorization) {
                setSelectedPolicy({
                    key: Policy.ROLE,
                    text: policyDetails.get(Policy.ROLE).name(),
                    value: policyDetails.get(Policy.ROLE).policyIdentifier()
                });
            }
        }
    };

    /**
     * Handle the scopes dropdown change.
     */
    const handleScopesDropdownChange = (event: SyntheticEvent<HTMLElement>, selectedScopes: DropdownItemProps[]) => {
        // Set the authorized scopes that are only in the selected API resource.
        setAuthorizedScopes(scopesDropdownOptions.filter((option: DropdownItemProps) => {
            if (selectedScopes.find((selectedScope: DropdownItemProps) =>
                selectedScope?.value?.toString() === option?.value?.toString())) {
                return option;
            }
        }));
    };

    const handleBulkDropdownChange = (remove: boolean) => {

        if (remove) {
            setAuthorizedScopes([]);
        } else {
            const selectingAuthorizedScopes: DropdownItemProps[] = currentAPIResourceScopeListData?.map(
                (scope: APIResourcePermissionInterface) => {
                    return {
                        key: scope.name,
                        text: scope.displayName,
                        value: scope.name
                    };
                }) ?? [];

            setAuthorizedScopes(selectingAuthorizedScopes);
        }
    };

    /**
     * Handle the form submission.
     */
    const handleFormSubmit = () => {
        setIsSubmitting(true);
        const processedAuthorizedScopes: string[] = authorizedScopes?.map((scope: DropdownItemProps) => {
            return scope?.value?.toString();
        });

        handleCreateAPIResource(selectedAPIResource.id, processedAuthorizedScopes,
            selectedPolicy?.key?.toString(), callBack);
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
                    "wizards.authorizeAPIResource.title", {
                    resourceText: resourceText
                }) }
                <Heading as="h6">
                    { t("extensions:develop.applications.edit.sections.apiAuthorization.sections.apiSubscriptions." +
                        "wizards.authorizeAPIResource.subTitle", {
                        resourceText: resourceText
                    }) }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                {
                    iscurrentAPIResourcesListLoading || isAPIResourcesListLoading
                        ? <ContentLoader inline="centered" active />
                        : (
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={ 12 } className="mb-2">
                                        <Grid.Row className="mb-3">
                                            <Autocomplete
                                                disablePortal
                                                fullWidth
                                                aria-label="API resource selection"
                                                className="pt-2"
                                                componentsProps={ {
                                                    paper: {
                                                        elevation: 2
                                                    },
                                                    popper: {
                                                        modifiers: [
                                                            {
                                                                enabled: false,
                                                                name: "flip"
                                                            },
                                                            {
                                                                enabled: false,
                                                                name: "preventOverflow"
                                                            }
                                                        ]
                                                    }
                                                } }
                                                data-componentid={ `${componentId}-api` }
                                                getOptionLabel={ (apiResourcesListOption: DropdownProps) =>
                                                    apiResourcesListOption.text }
                                                groupBy={ (apiResourcesListOption: DropdownItemProps) =>
                                                    APIResourceUtils
                                                        .resolveApiResourceGroup(apiResourcesListOption?.type) }
                                                isOptionEqualToValue={
                                                    (option: DropdownItemProps, value: DropdownItemProps) =>
                                                        option.value === value.value
                                                }
                                                renderOption={ (props: any, apiResourcesListOption: any) =>
                                                    (<div { ...props }>
                                                        <Header.Content>
                                                            { apiResourcesListOption.text }
                                                            { (
                                                                apiResourcesListOption.type ===
                                                                    APIResourcesConstants.BUSINESS
                                                                || apiResourcesListOption.type ==
                                                                    APIResourcesConstants.MCP
                                                            ) && (
                                                                <Header.Subheader>
                                                                    <Code
                                                                        className="inline-code compact transparent"
                                                                        withBackground={ false }
                                                                    >
                                                                        { apiResourcesListOption?.identifier }
                                                                    </Code>
                                                                    <Label
                                                                        pointing="left"
                                                                        size="mini"
                                                                        className="client-id-label">
                                                                        { t("extensions:develop.apiResource.table." +
                                                                            "identifier.label", {
                                                                            resourceText: resourceText
                                                                        }) }
                                                                    </Label>
                                                                </Header.Subheader>
                                                            ) }
                                                        </Header.Content>
                                                    </div>) }
                                                options={ allAPIResourcesDropdownOptions
                                                    ?.filter((item: DropdownItemProps) =>
                                                        item?.type === APIResourceCategories.TENANT ||
                                                        item?.type === APIResourceCategories.ORGANIZATION ||
                                                        item?.type === APIResourceCategories.BUSINESS ||
                                                        (originalTemplateId === "mcp-client-application" &&
                                                            item?.type === APIResourceCategories.MCP)
                                                    ).sort((a: DropdownItemProps, b: DropdownItemProps) =>
                                                        APIResourceUtils.sortApiResourceTypes(a, b)
                                                    )
                                                }
                                                onChange={ (
                                                    event: SyntheticEvent<HTMLElement>,
                                                    data: DropdownProps
                                                ) => handleAPIResourceSelect(data) }
                                                noOptionsText={ t("common:noResultsFound") }
                                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                                    <TextField
                                                        { ...params }
                                                        label={ startCase(t("extensions:develop.applications.edit." +
                                                            "sections.apiAuthorization.sections.apiSubscriptions." +
                                                            "wizards.authorizeAPIResource.fields.apiResource.label", {
                                                            resourceText: resourceText
                                                        })) }
                                                        placeholder={ t("extensions:develop.applications.edit." +
                                                            "sections.apiAuthorization.sections.apiSubscriptions." +
                                                            "wizards.authorizeAPIResource.fields.apiResource." +
                                                            "placeholder", {
                                                            resourceText: resourceText
                                                        }) }
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ) }
                                                key="apiResource"
                                            />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Autocomplete
                                                disablePortal
                                                fullWidth
                                                multiple
                                                aria-label="Authorized scope selection"
                                                className="pt-2"
                                                componentsProps={ {
                                                    paper: {
                                                        elevation: 2
                                                    },
                                                    popper: {
                                                        modifiers: [
                                                            {
                                                                enabled: false,
                                                                name: "flip"
                                                            },
                                                            {
                                                                enabled: false,
                                                                name: "preventOverflow"
                                                            }
                                                        ]
                                                    }
                                                } }
                                                data-componentid={ `${componentId}-scopes` }
                                                disabled={
                                                    !selectedAPIResource || isScopeSelectDropdownReady
                                                }
                                                getOptionLabel={ (scopesDropdownOption: DropdownProps) =>
                                                    scopesDropdownOption?.text?.toString() }
                                                isOptionEqualToValue={
                                                    (option: DropdownItemProps, value: DropdownItemProps) =>
                                                        option?.value === value?.value
                                                }
                                                loading={ isScopesDropdownLoading }
                                                options={ scopesDropdownOptions }
                                                onChange={ (
                                                    event: SyntheticEvent<HTMLElement>,
                                                    data: DropdownItemProps[]
                                                ) => handleScopesDropdownChange(event, data) }
                                                noOptionsText={ t("common:noResultsFound") }
                                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                                    <TextField
                                                        { ...params }
                                                        label={ (
                                                            <div
                                                                className="authorized-scope-select-input"
                                                            >
                                                                <Typography
                                                                    variant="subtitle1"
                                                                >
                                                                    { t("extensions:develop.applications" +
                                                                        ".edit.sections." +
                                                                        "apiAuthorization.sections.apiSubscriptions" +
                                                                        ".wizards.authorizeAPIResource.fields" +
                                                                        ".scopes.label", {
                                                                        resourceText: resourceText
                                                                    })
                                                                    }
                                                                </Typography>
                                                                {
                                                                    isScopeSelectDropdownReady
                                                                        ? (
                                                                            <Typography>
                                                                                { t("common:loading") }
                                                                            </Typography>
                                                                        )
                                                                        : (
                                                                            <Text
                                                                                className="mb-0"
                                                                                muted
                                                                                subHeading
                                                                                size={ 12 }
                                                                            >
                                                                                <Button
                                                                                    variant="text"
                                                                                    size="small"
                                                                                    disabled={
                                                                                        !selectedAPIResource
                                                                                        || isSelectAllHidden
                                                                                    }
                                                                                    onClick={
                                                                                        () =>
                                                                                            handleBulkDropdownChange(
                                                                                                false
                                                                                            )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        t("extensions:develop" +
                                                                                          ".applications.edit" +
                                                                                          ".sections.apiAuthorization" +
                                                                                          ".sections." +
                                                                                          "apiSubscriptions" +
                                                                                          ".scopesSection.selectAll")
                                                                                    }
                                                                                </Button>
                                                                |
                                                                                <Button
                                                                                    variant="text"
                                                                                    size="small"
                                                                                    disabled={
                                                                                        !selectedAPIResource
                                                                                        || isSelectNoneHidden
                                                                                    }
                                                                                    onClick={
                                                                                        () =>
                                                                                            handleBulkDropdownChange(
                                                                                                true
                                                                                            )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        t("extensions:develop" +
                                                                                          ".applications.edit" +
                                                                                          ".sections" +
                                                                                          ".apiAuthorization.sections" +
                                                                                          ".apiSubscriptions." +
                                                                                          "scopesSection.selectNone")
                                                                                    }
                                                                                </Button>
                                                                            </Text>)
                                                                }
                                                            </div>)
                                                        }
                                                        disabled={ !selectedAPIResource }
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ) }
                                                key="apiResource"
                                                value={ authorizedScopes }
                                            />
                                            <Hint disabled={ !selectedAPIResource }>
                                                { t("extensions:develop.applications.edit.sections." +
                                                    "apiAuthorization.sections.apiSubscriptions.wizards." +
                                                    "authorizeAPIResource.fields.scopes.hint", {
                                                    resourceText: resourceText
                                                }) }
                                            </Hint>
                                        </Grid.Row>
                                        {
                                            !m2mApplication && originalTemplateId !== "mcp-client-application" && (
                                                <Grid.Row columns={ 1 } className="pt-2">
                                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                        <Autocomplete
                                                            disablePortal
                                                            fullWidth
                                                            aria-label="Authorization policy selection"
                                                            className="pt-2"
                                                            componentsProps={ {
                                                                paper: {
                                                                    elevation: 2
                                                                },
                                                                popper: {
                                                                    modifiers: [
                                                                        {
                                                                            enabled: false,
                                                                            name: "flip"
                                                                        },
                                                                        {
                                                                            enabled: false,
                                                                            name: "preventOverflow"
                                                                        }
                                                                    ]
                                                                }
                                                            } }
                                                            data-componentid={ `${componentId}-policy` }
                                                            disabled={
                                                                !selectedAPIResource
                                                                || selectedAPIResourceRequiresAuthorization
                                                            }
                                                            getOptionLabel={ (scopesDropdownOption: DropdownProps) =>
                                                                scopesDropdownOption?.text?.toString() }
                                                            isOptionEqualToValue={ (
                                                                option: DropdownItemProps,
                                                                value: Policy) =>
                                                                option?.value === value
                                                            }
                                                            loading={ isPolicyDropdownLoading }
                                                            options={ policyDropdownOptions }
                                                            onChange={ (
                                                                event: SyntheticEvent<HTMLElement>,
                                                                data: DropdownItemProps
                                                            ) => {
                                                                setSelectedPolicy(data);
                                                            } }
                                                            noOptionsText={ t("common:noResultsFound") }
                                                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                                                <TextField
                                                                    { ...params }
                                                                    label={ t(
                                                                        "extensions:develop.applications." +
                                                                        "edit.sections.apiAuthorization." +
                                                                        "sections.apiSubscriptions.wizards." +
                                                                        "authorizeAPIResource.fields.policy" +
                                                                        ".label"
                                                                    ) }
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            ) }
                                                            key="policy"
                                                            defaultValue={ selectedPolicy }
                                                        />
                                                        <Hint
                                                            className="mb-1"
                                                            disabled={
                                                                !selectedAPIResource
                                                                || selectedAPIResourceRequiresAuthorization
                                                            }
                                                        >
                                                            {
                                                                t(
                                                                    "extensions:develop.applications.edit.sections." +
                                                                    "apiAuthorization.sections.apiSubscriptions." +
                                                                    "wizards.authorizeAPIResource.fields.policy.hint"
                                                                )
                                                            }
                                                        </Hint>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            )
                                        }
                                        { /* Need to add doc links to the following content of the message box */ }
                                        {
                                            !m2mApplication
                                            && selectedAPIResource
                                            && selectedPolicy
                                            && (
                                                <Grid.Row columns={ 1 } className="pt-0">
                                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                        <Message
                                                            type="info"
                                                            header={ policyDetails
                                                                .get(selectedPolicy.key as Policy).name() }
                                                            content={
                                                                (<>
                                                                    { policyDetails.get(selectedPolicy.key as Policy)
                                                                        .hint() }
                                                                    <DocumentationLink
                                                                        link={
                                                                            getLink(
                                                                                policyDetails
                                                                                    .get(selectedPolicy.key as Policy)
                                                                                    .documentationLink())
                                                                        }
                                                                    >
                                                                        { t("common:learnMore") }
                                                                    </DocumentationLink>
                                                                </>)
                                                            }
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            )
                                        }
                                        {
                                            m2mApplication && (
                                                <Grid.Row columns={ 1 } className="pt-0">
                                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                        <Alert severity="info">
                                                            {
                                                                t(
                                                                    "applications:edit." +
                                                                    "sections.apiAuthorization.m2mPolicyMessage"
                                                                )
                                                            }
                                                        </Alert>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            )
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        )
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
                                onClick={ handleFormSubmit }
                                loading={ isSubmitting }
                                disabled={ !selectedAPIResource || !selectedPolicy }
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
