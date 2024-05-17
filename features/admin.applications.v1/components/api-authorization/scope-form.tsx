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

import Button from "@oxygen-ui/react/Button";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Code,
    ContentLoader,
    EmphasizedSegment,
    Hint,
    LinkButton,
    PrimaryButton,
    Text
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Form, Grid, Header } from "semantic-ui-react";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { patchScopesOfAuthorizedAPI } from "../../api/api-authorization";
import useScopesOfAPIResources from "../../api/use-scopes-of-api-resources";
import {
    AuthorizedAPIListItemInterface,
    AuthorizedPermissionListItemInterface
} from "../../models/api-authorization";

/**
 * Prop-types for the API resources page component.
 */
interface ScopeFormInterface extends
    SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Application ID.
     */
    appId: string;
    /**
     * Currently selected API resource.
     */
    subscribedAPIResource: AuthorizedAPIListItemInterface;
    /**
     * Flag to check if the scopes are available for update.
     */
    isScopesAvailableForUpdate: boolean;
    /**
     * Bulk change all authorized scopes.
     */
    bulkChangeAllAuthorizedScopes: (scopes: AuthorizedPermissionListItemInterface[], removed: boolean) => void;
}

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const ScopeForm: FunctionComponent<ScopeFormInterface> = (
    props: ScopeFormInterface
): ReactElement => {

    const {
        appId,
        subscribedAPIResource,
        isScopesAvailableForUpdate,
        bulkChangeAllAuthorizedScopes,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isUpdateButtonDisabled, setIsUpdateButtonDisabled ] = useState<boolean>(true);
    const [ dropdownOptions, setDropdownOptions ] = useState<DropdownItemProps[]>(null);
    const [ defaultDropdownValues, setDefaultDropdownValues ] = useState<string[]>(null);
    const [ previousSelectedScopes, setPreviousSelectedScopes ]
        = useState<AuthorizedPermissionListItemInterface[]>(subscribedAPIResource.authorizedScopes);
    const [ selectedScopes, setSelectedScopes ] = useState<string[]>(null);
    const [ addedScopesIdentifiers, setAddedScopesIdentifiers ] = useState<string[]>([]);
    const [ removedScopesIdentifiers, setRemovedScopesIdentifiers ] = useState<string[]>([]);
    const [ isSelectAllDisabled, setIsSelectAllDisabled ] = useState<boolean>(false);
    const [ isSelectNoneDisabled, setIsSelectNoneDisabled ] = useState<boolean>(false);

    const {
        data: currentAPIResourceScopeListData,
        isLoading: isCurrentAPIResourceScopeListDataLoading,
        error: currentAPIResourceScopeListFetchError
    } = useScopesOfAPIResources(subscribedAPIResource?.id);

    /**
     * The following useEffect is used to handle if any error occurs while fetching API resource scopes.
     */
    useEffect(() => {
        if (currentAPIResourceScopeListFetchError) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.message")
            }));
        }
    }, [ currentAPIResourceScopeListFetchError ]);

    /**
     * Check if the place holders should be shown.
     */
    const showPlaceHolders: boolean = isLoading ||
        dropdownOptions === null ||
        defaultDropdownValues === null ||
        selectedScopes === null ;

    /**
     * Initialize the dropdown options.
     */
    useEffect(() => {
        const options: DropdownItemProps[] = [];

        if (!isCurrentAPIResourceScopeListDataLoading) {
            currentAPIResourceScopeListData?.forEach((scope: AuthorizedPermissionListItemInterface) => {
                options.push({
                    content: (
                        <Header
                            as="h6"
                            className="header-with-icon"
                            data-componentId={ `${componentId}-heading` }
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
                });
            });
            setDropdownOptions(options);
        }
    }, [ currentAPIResourceScopeListData ]);

    /**
     * Intialize the default dropdown values.
     */
    useEffect(() => {
        const defaultValues: string[] = [];

        subscribedAPIResource.authorizedScopes.forEach((scope: AuthorizedPermissionListItemInterface) => {
            defaultValues.push(scope.name);
        });
        setDefaultDropdownValues(defaultValues);
        setSelectedScopes(defaultValues);
    }, [ subscribedAPIResource ]);

    /**
     * Handles the disabled state of the select all button.
     */
    useEffect(() => {
        setIsSelectAllDisabled(currentAPIResourceScopeListData?.length === selectedScopes?.length);
    }, [ selectedScopes, subscribedAPIResource ]);

    /**
     * Handles the disabled state of the select none button.
     */
    useEffect(() => {
        setIsSelectNoneDisabled(selectedScopes?.length === 0);
    }, [ selectedScopes ]);


    /**
     * Handles patch request to update the scopes of the API resource.
     *
     * @param apiResourceId - API resource ID.
     */
    const updateScopesOfAPIResource = (): void => {

        setIsLoading(true);
        patchScopesOfAuthorizedAPI(appId, subscribedAPIResource?.id, addedScopesIdentifiers, removedScopesIdentifiers)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization" +
                        ".sections.apiSubscriptions.notifications.patchScopes.success.description" ),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization" +
                        ".sections.apiSubscriptions.notifications.patchScopes.success.message")
                }));

                const addedScopes: AuthorizedPermissionListItemInterface[]
                    = currentAPIResourceScopeListData?.map((scope: AuthorizedPermissionListItemInterface) => {
                        if (addedScopesIdentifiers.includes(scope.name)) {
                            return scope;
                        }
                    }).filter((scope: AuthorizedPermissionListItemInterface) => scope !== undefined);

                const removedScopes: AuthorizedPermissionListItemInterface[]
                    = currentAPIResourceScopeListData?.map((scope: AuthorizedPermissionListItemInterface) => {
                        if (removedScopesIdentifiers.includes(scope.name)) {
                            return scope;
                        }
                    }).filter((scope: AuthorizedPermissionListItemInterface) => scope !== undefined);

                if (addedScopes?.length !== 0) {
                    bulkChangeAllAuthorizedScopes(addedScopes, false);
                }

                if (removedScopes?.length !== 0) {
                    bulkChangeAllAuthorizedScopes(removedScopes, true);
                }

                // Update the added and removed scopes.
                setAddedScopesIdentifiers([]);
                setRemovedScopesIdentifiers([]);

                // Update the default dropdown values.
                setDefaultDropdownValues(selectedScopes);

                // Set the update button to disabled.
                setIsUpdateButtonDisabled(true);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization" +
                        ".sections.apiSubscriptions.notifications.patchScopes.genericError.description" ),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization" +
                        ".sections.apiSubscriptions.notifications.patchScopes.genericError.message" )
                }));
            })
            .finally(() => setIsLoading(false));
    };

    /**
     * Placeholder for the scope form.
     */
    const getPlaceholders = (): ReactElement => {
        if (
            selectedScopes === null ||
            dropdownOptions === null ||
            defaultDropdownValues === null ||
            isLoading
        ) {
            return <ContentLoader inline="centered" active />;
        }

        return null;
    };

    /**
     * The following function is used to handle the dropdown change.
     */
    const handleDropdownChange = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
        const scopes: string[] = data.value as string[];

        setSelectedScopes(scopes);

        // Set the update button to disabled if the scopes are not changed.
        if (scopes.toString() !== defaultDropdownValues.toString()) {
            setIsUpdateButtonDisabled(false);
        } else {
            setIsUpdateButtonDisabled(true);
        }

        // Handles if a scope is added.
        if (scopes.length >= previousSelectedScopes.length) {
            const scopeObject: AuthorizedPermissionListItemInterface = currentAPIResourceScopeListData?.find(
                (scopeObject: AuthorizedPermissionListItemInterface) =>
                    scopeObject.name === scopes[scopes.length - 1]);

            // Update the all authorized scopes.
            if (scopeObject) {
                setPreviousSelectedScopes([ ...previousSelectedScopes, scopeObject ]);
            }

            // Set the added scopes identifiers.
            if (!defaultDropdownValues.includes(scopeObject.name)) {
                setAddedScopesIdentifiers([ ...addedScopesIdentifiers, scopeObject.name ]);
            }

            // Remove the scope from the removed scopes identifiers if it is already added.
            if (removedScopesIdentifiers.includes(scopeObject.name)) {
                setRemovedScopesIdentifiers(removedScopesIdentifiers.filter(
                    (scopeIdentifier: string) => scopeIdentifier !== scopeObject.name));
            }
        } else {
            // Handles if a scope is removed.
            const scopeObject: AuthorizedPermissionListItemInterface = previousSelectedScopes?.filter(
                (scope: AuthorizedPermissionListItemInterface) =>
                    !scopes.includes(scope.name))[0];

            // Update the all authorized scopes.
            if (scopeObject) {
                setPreviousSelectedScopes(previousSelectedScopes.filter(
                    (scope: AuthorizedPermissionListItemInterface) => scope.name !== scopeObject.name));
            }

            // Set the removed scopes identifiers.
            if (defaultDropdownValues.includes(scopeObject.name)) {
                setRemovedScopesIdentifiers([ ...removedScopesIdentifiers, scopeObject.name ]);
            }

            // Remove the scope from the added scopes identifiers if it is already added.
            if (addedScopesIdentifiers.includes(scopeObject.name)) {
                setAddedScopesIdentifiers(addedScopesIdentifiers.filter(
                    (scopeIdentifier: string) => scopeIdentifier !== scopeObject.name));
            }
        }
    };

    /**
     * Handle bulk dropdown change.
     */
    const handleBulkDropdownChange = (scopeObjectList: AuthorizedPermissionListItemInterface[],
        remove: boolean): void => {
        const scopeNameList: string[] =
            scopeObjectList.map((scope: AuthorizedPermissionListItemInterface) => scope.name);

        // Handles `Select None` option.
        if (remove) {
            // Set the update button to disabled if the scopes are not changed.
            if (defaultDropdownValues?.toString().length !== 0) {
                setIsUpdateButtonDisabled(false);
            } else {
                setIsUpdateButtonDisabled(true);
            }

            setPreviousSelectedScopes([]);

            setSelectedScopes([]);
            // Set the removed scopes identifiers.
            setRemovedScopesIdentifiers(defaultDropdownValues);

            // Remove the scope from the added scopes identifiers if it is already added.
            setAddedScopesIdentifiers([]);
        } else {
            // Handles `Select All` option.
            // Set the update button to disabled if the scopes are not changed.
            if (defaultDropdownValues.toString() !== scopeNameList.toString()) {
                setIsUpdateButtonDisabled(false);
            } else {
                setIsUpdateButtonDisabled(true);
            }

            setPreviousSelectedScopes(scopeObjectList);

            setSelectedScopes(scopeNameList);
            // Set the added scopes identifiers.
            setAddedScopesIdentifiers(scopeNameList.filter(
                (scopeName: string) => !defaultDropdownValues.includes(scopeName)));

            // Remove the scope from the removed scopes identifiers if it is already added.
            setRemovedScopesIdentifiers([]);
        }
    };

    const resetDropdown = (): void => {
        setSelectedScopes(defaultDropdownValues);
        setPreviousSelectedScopes(subscribedAPIResource.authorizedScopes);
        setAddedScopesIdentifiers([]);
        setRemovedScopesIdentifiers([]);
        setIsUpdateButtonDisabled(true);
    };

    return (
        <EmphasizedSegment padded="very">
            {
                showPlaceHolders
                    ? getPlaceholders()
                    : (
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column>
                                    <Form>
                                        <Form.Field>
                                            <Grid>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column
                                                        className="pb-1"
                                                        floated="left"
                                                        stretched
                                                        verticalAlign="bottom"
                                                    >
                                                        <label>
                                                            { t("extensions:develop.applications.edit.sections." +
                                                                "apiAuthorization.sections.apiSubscriptions." +
                                                                "scopesSection.label" ) }
                                                        </label>
                                                    </Grid.Column>
                                                    <Grid.Column floated="right" textAlign="right">
                                                        {
                                                            isScopesAvailableForUpdate && (
                                                                <Text className="mb-0" muted subHeading size={ 12 }>
                                                                    <Button
                                                                        variant="text"
                                                                        size="small"
                                                                        tabIndex={ 6 }
                                                                        disabled={ isSelectAllDisabled }
                                                                        onClick={ () =>
                                                                            handleBulkDropdownChange(
                                                                                currentAPIResourceScopeListData
                                                                                    ? currentAPIResourceScopeListData
                                                                                    : [],
                                                                                false ) }
                                                                    >
                                                                        {
                                                                            t("extensions:develop.applications.edit." +
                                                                            "sections.apiAuthorization.sections." +
                                                                            "apiSubscriptions.scopesSection.selectAll" )
                                                                        }
                                                                    </Button>
                                                                    |
                                                                    <Button
                                                                        variant="text"
                                                                        size="small"
                                                                        tabIndex={ 7 }
                                                                        disabled={ isSelectNoneDisabled }
                                                                        onClick={ () =>
                                                                            handleBulkDropdownChange(
                                                                                currentAPIResourceScopeListData
                                                                                    ? currentAPIResourceScopeListData
                                                                                    : [],
                                                                                true ) }
                                                                    >
                                                                        {
                                                                            t("extensions:develop.applications.edit." +
                                                                            "sections.apiAuthorization.sections." +
                                                                            "apiSubscriptions.scopesSection." +
                                                                            "selectNone" )
                                                                        }
                                                                    </Button>
                                                                </Text>
                                                            )
                                                        }
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Dropdown
                                                placeholder={ t("extensions:develop.applications.edit.sections." +
                                                    "apiAuthorization.sections.apiSubscriptions.scopesSection." +
                                                    "placeholder") }
                                                fluid
                                                multiple
                                                search
                                                selection
                                                options={
                                                    dropdownOptions
                                                        ? dropdownOptions
                                                        : []
                                                }
                                                defaultValue={ defaultDropdownValues }
                                                value={ selectedScopes }
                                                onChange={ handleDropdownChange }
                                                disabled={ !isScopesAvailableForUpdate }
                                            />
                                            <Hint>
                                                { t("extensions:develop.applications.edit.sections." +
                                                    "apiAuthorization.sections.apiSubscriptions.scopesSection." +
                                                    "hint") }
                                            </Hint>
                                        </Form.Field>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                            {
                                isScopesAvailableForUpdate && (
                                    <Grid.Row>
                                        <Grid.Column floated="left">
                                            <LinkButton
                                                size="small"
                                                floated="left"
                                                tabIndex={ 8 }
                                                onClick={ resetDropdown }
                                                data-componentid={ `${componentId}-cancel-btn` }
                                                disabled={ isUpdateButtonDisabled }
                                            >
                                                { t("common:cancel") }
                                            </LinkButton>

                                            <PrimaryButton
                                                size="small"
                                                floated="right"
                                                tabIndex={ 9 }
                                                onClick={ updateScopesOfAPIResource }
                                                data-componentid={ `${componentId}-update-btn` }
                                                disabled={ isUpdateButtonDisabled }
                                            >
                                                { t("extensions:develop.applications.edit.sections.apiAuthorization." +
                                                    "sections.policySection.buttons.update") }
                                            </PrimaryButton>
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }
                        </Grid>
                    )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
ScopeForm.defaultProps = {
    "data-componentid": "permission-form"
};
