/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, Claim, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { useTrigger } from "@wso2is/forms";
import { AnimatedAvatar, EmphasizedSegment, ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import {
    Divider,
    DropdownItemProps,
    DropdownProps,
    Grid,
    Header,
    Icon,
    Input,
    Label,
    Placeholder
} from "semantic-ui-react";
import { getAllExternalClaims, getAllLocalClaims } from "../../claims/api";
import { AppConstants, AppState, FeatureConfigInterface, UIConstants, history, sortList } from "../../core";
import { getOIDCScopeDetails, updateOIDCScopeDetails } from "../api";
import { EditOIDCScope } from "../components";
import { OIDCScopesManagementConstants } from "../constants";
import { OIDCScopesListInterface } from "../models";

/**
 * Path params interface
 */
interface OIDCScopesEditPagePathParams {
    id: string;
}

/**
 * Proptypes for the OIDC scopes edit page component.
 */
type OIDCScopesEditPageInterface = TestableComponentInterface;

const FORM_ID: string = "oidc-scope-form";

/**
 * OIDC Scopes Edit page component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
const OIDCScopesEditPage: FunctionComponent<RouteComponentProps<OIDCScopesEditPagePathParams> &
    OIDCScopesEditPageInterface> = (
        props: RouteComponentProps<OIDCScopesEditPagePathParams> & OIDCScopesEditPageInterface
    ): ReactElement => {
        const {
            [ "data-testid" ]: testId,
            match: {
                params: { id: scopeName }
            }
        } = props;

        const { t } = useTranslation();

        /**
         * Sets the attributes by which the list can be sorted
         */
        const SORT_BY = [
            {
                key: 0,
                text: t("console:manage.features.claims.external.attributes.attributeURI", { type: "OIDC" }),
                value: "localClaimDisplayName"
            },
            {
                key: 1,
                text: t("console:manage.features.claims.local.attributes.attributeURI"),
                value: "mappedLocalClaimURI"
            }
        ];

        const dispatch = useDispatch();

        const [ scope, setScope ] = useState<OIDCScopesListInterface>({});
        const [ claims, setClaims ] = useState<Claim[]>([]);
        const [ isScopeRequestLoading, setScopeRequestLoading ] = useState<boolean>(true);
        const [ isAttributeRequestLoading, setIsAttributeRequestLoading ] = useState<boolean>(true);
        const [ listItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        const [ OIDCAttributes, setOIDCAttributes ] = useState<ExternalClaim[]>(undefined);
        const [ selectedAttributes, setSelectedAttributes ] = useState<ExternalClaim[]>([]);
        const [ tempSelectedAttributes, setTempSelectedAttributes ] = useState<ExternalClaim[]>([]);
        const [ unselectedAttributes, setUnselectedAttributes ] = useState<ExternalClaim[]>([]);
        const [ triggerAddAttributeModal, setTriggerAttributeModal ] = useTrigger();
        const [ sortOrder, setSortOrder ] = useState(true);
        const [ sortByStrategy, setSortByStrategy ] = useState<DropdownItemProps>(SORT_BY[ 0 ]);
        const [ attributeSearchQuery, setAttributeSearchQuery ] = useState<string>("");
        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

        const initialRender = useRef(true);

        const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
        const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
        const SCOPE_DESCRIPTION_MAX_LENGTH: number = 100;

        const isReadOnly = useMemo(() => (
            !hasRequiredScopes(
                featureConfig?.oidcScopes, featureConfig?.oidcScopes?.scopes?.update, allowedScopes)
        ), [ featureConfig, allowedScopes ]);

        useEffect(() => {
            if (initialRender.current) {
                initialRender.current = false;
            } else {
                setTempSelectedAttributes(sortList(tempSelectedAttributes, sortByStrategy.value as string, sortOrder));
            }
        }, [ sortBy, sortOrder ]);

        useEffect(() => {
            getAllLocalClaims(null)
                .then((response) => {
                    setClaims(response);
                })
                .catch((error) => {
                    dispatch(
                        addAlert({
                            description:
                                error?.response?.data?.description ||
                                t("console:manage.features.claims.local.notifications." +
                                    "getClaims.genericError.description"),
                            level: AlertLevels.ERROR,
                            message:
                                error?.response?.data?.message ||
                                t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
                        })
                    );
                });
        }, []);

        useEffect(() => {
            if (OIDCAttributes) {
                return;
            }
            const OIDCAttributeId = OIDCScopesManagementConstants.OIDC_ATTRIBUTE_ID;

            if (!claims || claims.length === 0) {
                return;
            }

            getOIDCAttributes(OIDCAttributeId);
        }, [ claims, OIDCAttributes ]);

        useEffect(() => {
            if (OIDCAttributes == undefined) {
                return;
            }

            mapSelectedAttributes();
        }, [ OIDCAttributes, scope ]);

        const mapSelectedAttributes = () => {
            if (!scope.claims) {
                return;
            }

            const selected = [];

            scope?.claims?.map((claim) => {
                selected.push(OIDCAttributes.find((item) => item?.claimURI == claim));
            });

            const filteredSelected = selected.filter(item => !!item);
            const sortedSelected = sortBy(filteredSelected, "localClaimDisplayName");

            setSelectedAttributes(sortedSelected);
            setTempSelectedAttributes(sortedSelected);
            setUnselectedAttributes(OIDCAttributes.filter((x) => !filteredSelected?.includes(x)));
        };

        /**
         * Fetch the scope details on initial component load.
         */
        useEffect(() => {
            if (!scopeName) {
                return;
            }

            const scope = scopeName;

            getScope(scope);
        }, [ scopeName ]);

        const getOIDCAttributes = (claimId: string) => {
            setIsAttributeRequestLoading(true);
            getAllExternalClaims(claimId, null)
                .then((response) => {
                    response?.forEach((externalClaim) => {
                        const mappedLocalClaimUri = externalClaim.mappedLocalClaimURI;
                        const matchedLocalClaim = claims.filter((localClaim) => {
                            return localClaim.claimURI === mappedLocalClaimUri;
                        });

                        if (matchedLocalClaim && matchedLocalClaim[ 0 ] && matchedLocalClaim[ 0 ].displayName) {
                            externalClaim.localClaimDisplayName = matchedLocalClaim[ 0 ].displayName;
                        }
                    });
                    setOIDCAttributes(response);
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(
                            addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.oidcScopes.notifications.fetchOIDClaims.error"
                                    + ".message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.oidcScopes.notifications.fetchOIDClaims" +
                                ".genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.oidcScopes.notifications.fetchOIDClaims"
                                + ".genericError.message"
                            )
                        })
                    );
                })
                .finally(() => {
                    setIsAttributeRequestLoading(false);
                });
        };

        const searchSelectedAttributes = (event) => {
            const changeValue = event.target.value;

            setAttributeSearchQuery(changeValue);
            if (changeValue.length > 0) {
                setTempSelectedAttributes(
                    selectedAttributes.filter(
                        (claim: ExternalClaim) =>
                            claim.localClaimDisplayName.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1
                    )
                );
            } else {
                setTempSelectedAttributes(selectedAttributes);
            }
        };

        /**
         * Retrieves scope details from the API.
         *
         * @param scopeName - name of the scope.
         */
        const getScope = (scopeName: string): void => {
            setScopeRequestLoading(true);

            getOIDCScopeDetails(scopeName)
                .then((response: OIDCScopesListInterface) => {
                    setScope(response);
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(
                            addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.oidcScopes.notifications."
                                    + "fetchOIDCScope.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.oidcScopes.notifications.fetchOIDCScope" +
                                ".genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.oidcScopes.notifications.fetchOIDCScope.genericError."
                                + "message"
                            )
                        })
                    );
                })
                .finally(() => {
                    setScopeRequestLoading(false);
                });
        };

        /**
         * Handles the back button click event.
         */
        const handleBackButtonClick = (): void => {
            history.push(AppConstants.getPaths().get("OIDC_SCOPES"));
        };


        /**
        * Handles sort order change.
        *
        * @param isAscending - Is ascending or not.
        */
        const handleSortOrderChange = (isAscending: boolean) => {
            setSortOrder(isAscending);
        };

        /**
        * Handle sort strategy change.
        *
        * @param event - Sort event..
        * @param data - Dropdown data.
        */
        const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
            setSortByStrategy(SORT_BY.filter(option => option.value === data.value)[ 0 ]);
        };

        /**
         * Handles clearing the searched attributes.
         */
        const clearSearchedAttributes = (): void => {
            setAttributeSearchQuery("");
            setTempSelectedAttributes(selectedAttributes);
        };

        const onSubmit = (values: any): void => {
            setIsSubmitting(true);

            updateOIDCScopeDetails(scope.name, {
                claims: scope.claims,
                description: values?.description !== undefined ?  values?.description?.toString() : scope.description,
                displayName: values?.displayName !== undefined ? values?.displayName?.toString() : scope.displayName
            })
                .then(() => {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.oidcScopes.notifications." +
                                "updateOIDCScope.success.description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                "console:manage.features.oidcScopes." +
                                "notifications.updateOIDCScope.success.message"
                            )
                        })
                    );
                    getScope(scopeName);
                })
                .catch((error: IdentityAppsApiException) => {
                    dispatch(
                        addAlert({
                            description:
                                error?.response?.data?.description ??
                                t(
                                    "console:manage.features.oidcScopes." +
                                    "notifications.updateOIDCScope.genericError." +
                                    "description"
                                ),
                            level: AlertLevels.ERROR,
                            message:
                                error?.response?.data?.message ??
                                t(
                                    "console:manage.features.oidcScopes." +
                                    "notifications.updateOIDCScope.genericError." +
                                    "message"
                                )
                        })
                    );
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        };


        return (
            <PageLayout
                pageTitle={ "Update Scope" }
                isLoading={ isScopeRequestLoading || isAttributeRequestLoading }
                title={ scope.displayName }
                contentTopMargin={ true }
                description={
                    (<>
                        <Label className="no-margin-left">
                            <code>{ scope.name }</code>
                        </Label>
                        { " " + (scope.description || t("console:manage.pages.oidcScopesEdit.subTitle")) }
                    </>)
                }
                image={ <AnimatedAvatar name={ scope.name } size="tiny" floated="left" /> }
                backButton={ {
                    onClick: handleBackButtonClick,
                    text: t("console:manage.pages.oidcScopesEdit.backButton")
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                data-testid={ `${ testId }-page-layout` }
            >
                <Header>Update Scope</Header>
                <EmphasizedSegment className="padded very">
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 6 }>
                                { !isScopeRequestLoading && !isAttributeRequestLoading ? (
                                    <Form
                                        id={ FORM_ID }
                                        uncontrolledForm={ false }
                                        onSubmit={ (values): void => {
                                            onSubmit(values);
                                        } }
                                        data-testid={ testId }
                                    >
                                        <Field.Input
                                            ariaLabel="displayName"
                                            inputType="name"
                                            name="displayName"
                                            label={ t(
                                                "console:manage.features.oidcScopes.forms.addScopeForm." +
                                                "inputs.displayName.label"
                                            ) }
                                            placeholder={ t(
                                                "console:manage.features.oidcScopes.forms." +
                                                "addScopeForm.inputs." +
                                                "displayName.placeholder"
                                            ) }
                                            value={ scope.displayName }
                                            required={ true }
                                            message={ t(
                                                "console:manage.features.oidcScopes.forms." +
                                                "addScopeForm.inputs.displayName.validations.empty"
                                            ) }
                                            maxLength={ 40 }
                                            minLength={ 3 }
                                            readOnly={ isReadOnly }
                                        />
                                        <Field.Input
                                            ariaLabel="description"
                                            inputType="description"
                                            name="description"
                                            label={ t(
                                                "console:manage.features.oidcScopes.forms.addScopeForm." +
                                                "inputs.description.label"
                                            ) }
                                            placeholder={ t(
                                                "console:manage.features." +
                                                "oidcScopes.forms.addScopeForm.inputs." +
                                                "description.placeholder"
                                            ) }
                                            value={ scope.description }
                                            required={ false }
                                            maxLength={ SCOPE_DESCRIPTION_MAX_LENGTH }
                                            minLength={ 3 }
                                            readOnly={ isReadOnly }
                                        />
                                        { !isReadOnly && (
                                            <Field.Button
                                                form={ FORM_ID }
                                                ariaLabel="submit"
                                                size="small"
                                                loading={ isSubmitting }
                                                disabled={ isSubmitting }
                                                buttonType="primary_btn"
                                                label={ t("common:update") }
                                                name="submit"
                                            />
                                        ) }
                                    </Form>
                                ) : (
                                    <Placeholder>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="short" />
                                    </Placeholder>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EmphasizedSegment>
                <Divider hidden />
                <Header>Manage Attributes</Header>
                <EmphasizedSegment className="padded">
                    <ListLayout
                        rightActionPanel={
                            (<Show when={ AccessControlConstants.SCOPE_WRITE }>
                                <PrimaryButton
                                    data-testid="user-mgt-roles-list-update-button"
                                    size="medium"
                                    icon={ <Icon name="add" /> }
                                    floated="right"
                                    onClick={ () => setTriggerAttributeModal() }
                                >
                                    <Icon name="add" />
                                    { t("console:manage.features.oidcScopes.editScope." + "claimList.addClaim") }
                                </PrimaryButton>
                            </Show>)
                        }
                        showTopActionPanel={ isScopeRequestLoading || !(scope.claims?.length == 0) }
                        listItemLimit={ listItemLimit }
                        showPagination={ false }
                        onPageChange={ () => null }
                        totalPages={ Math.ceil(scope.claims?.length / listItemLimit) }
                        data-testid={ `${ testId }-list-layout` }
                        leftActionPanel={
                            (<div className="advanced-search-wrapper aligned-left fill-default">
                                <Input
                                    className="advanced-search with-add-on"
                                    data-testid={ `${ testId }-list-search-input` }
                                    icon="search"
                                    iconPosition="left"
                                    onChange={ searchSelectedAttributes }
                                    placeholder={ t("console:manage.features.oidcScopes.editScope."
                                    + "claimList.searchClaims") }
                                    floated="right"
                                    size="small"
                                    value={ attributeSearchQuery }
                                />
                            </div>)
                        }
                        onSortOrderChange={ handleSortOrderChange }
                        sortOptions={ SORT_BY }
                        sortStrategy={ sortBy }
                        onSortStrategyChange={ handleSortStrategyChange }
                    >
                        <EditOIDCScope
                            scope={ scope }
                            isLoading={ isScopeRequestLoading || isAttributeRequestLoading }
                            onUpdate={ getScope }
                            data-testid={ testId }
                            selectedAttributes={ selectedAttributes }
                            tempSelectedAttributes ={ tempSelectedAttributes }
                            unselectedAttributes={ unselectedAttributes }
                            isRequestLoading={ isScopeRequestLoading || isAttributeRequestLoading }
                            triggerAddAttributeModal={ triggerAddAttributeModal }
                            clearSearchedAttributes={ clearSearchedAttributes }
                        />
                    </ListLayout>
                </EmphasizedSegment>
            </PageLayout>
        );
    };

/**
 * Default proptypes for the application edit page component.
 */
OIDCScopesEditPage.defaultProps = {
    "data-testid": "oidc-scopes-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OIDCScopesEditPage;
