/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    EmphasizedSegment,
    EmptyPlaceholder,
    LinkButton,
    ListLayout,
    PrimaryButton,
    SegmentedAccordion,
    SegmentedAccordionTitleActionInterface,
    URLInput
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Header, Icon, Input } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../../../admin.core.v1";
import {
    FIDOTrustedAppTypes,
    FIDOTrustedAppsListInterface,
    FIDOTrustedAppsValuesInterface
} from "../../../../models/identity-provider";
import { isValidSHA256 } from "../../../../utils/validation-utils";

/**
 * Prop types for the FIDO trusted apps list component.
 */
interface FIDOTrustedAppsList extends IdentifiableComponentInterface {
    /**
     * List of added trusted apps.
     */
    trustedApps: FIDOTrustedAppsValuesInterface;
    /**
     * Function to modify the current list of trusted apps.
     * @param values - Updated list of trusted apps.
     */
    setTrustedApps: (values: FIDOTrustedAppsValuesInterface) => void;
    /**
     * Whether the FIDO trusted apps fetch request has failed or not.
     */
    isTrustedAppsFetchErrorOccurred: boolean;
    /**
     * Whether the trusted apps are read-only or not.
     */
    readOnly: boolean;
    /**
     * Function to open the trusted app addition modal.
     */
    setIsTrustedAppsAddWizardOpen: (value: boolean) => void;
}

/**
 * FIDO trusted apps listing page.
 *
 * @param props - Props injected to the component.
 * @returns FIDO trusted apps list component.
 */
export const FIDOTrustedAppsList: FunctionComponent<FIDOTrustedAppsList> = (
    props: FIDOTrustedAppsList
): ReactElement => {

    const {
        trustedApps,
        setTrustedApps,
        isTrustedAppsFetchErrorOccurred,
        readOnly,
        setIsTrustedAppsAddWizardOpen,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ activeTrustedApp, setActiveTrustedApp ] = useState<string>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ searchedTrustedAppsList, setSearchedTrustedAppsList ] =
        useState<FIDOTrustedAppsListInterface[]>(null);

    /**
     * Format the data of the trusted apps for display in the list view.
     */
    const trustedAppListData: FIDOTrustedAppsListInterface[] = useMemo(() => {
        const trustedAppsList: FIDOTrustedAppsListInterface[] = [];

        if (!trustedApps) {
            return trustedAppsList;
        }

        if (trustedApps?.android) {
            for (const app in trustedApps?.android) {
                trustedAppsList.push({
                    appName: app,
                    appType: FIDOTrustedAppTypes.ANDROID,
                    shaValues: trustedApps?.android?.[app]
                });
            }
        }

        if (trustedApps?.ios) {
            for (const app in trustedApps?.ios) {
                trustedAppsList.push({
                    appName: app,
                    appType: FIDOTrustedAppTypes.IOS
                });
            }
        }

        return trustedAppsList;
    }, [ trustedApps ]);

    /**
     * Initialize the trusted apps list to the searched trusted apps list.
     */
    useEffect(() => {
        if (trustedAppListData) {
            setSearchedTrustedAppsList(trustedAppListData);
        }
    }, [ trustedAppListData ]);

    /**
     * Placeholder for the trusted apps list.
     */
    const getPlaceholders = (): ReactElement => {
        if (isTrustedAppsFetchErrorOccurred) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                    title={ t("authenticationProvider:forms.authenticatorSettings." +
                                "fido2.trustedApps.placeHolderTexts.errorText.title") }
                    subtitle={ [ t("authenticationProvider:forms.authenticatorSettings." +
                                "fido2.trustedApps.placeHolderTexts.errorText.subtitles.1"),
                    t("authenticationProvider:forms.authenticatorSettings." +
                        "fido2.trustedApps.placeHolderTexts.errorText.subtitles.0") ] }
                    data-componentid={ `${componentId}-fetch-error-occurred-placeholder` }
                />
            );
        } else if (trustedAppListData?.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    action={ (
                        !readOnly &&
                            ( <PrimaryButton
                                data-componentid={ `${componentId}-empty-placeholder-trusted-app-add-button` }
                                onClick={ (): void => setIsTrustedAppsAddWizardOpen(true) }
                            >
                                <Icon name="add" />
                                { t("authenticationProvider:forms.authenticatorSettings." +
                                    "fido2.trustedApps.buttons.addButton") }
                            </PrimaryButton> )
                    ) }
                    imageSize="tiny"
                    subtitle={ [ t("authenticationProvider:forms.authenticatorSettings." +
                        "fido2.trustedApps.placeHolderTexts.emptyText") ] }
                    data-componentid={ `${componentId}-empty-placeholder` }
                />
            );
        } else if (searchedTrustedAppsList?.length === 0) {
            return (
                <EmptyPlaceholder
                    title={ t("authenticationProvider:forms.authenticatorSettings." +
                        "fido2.trustedApps.placeHolderTexts.emptySearch.title") }
                    subtitle={ [ t("authenticationProvider:forms.authenticatorSettings." +
                        "fido2.trustedApps.placeHolderTexts.emptySearch.subTitle.0"),
                    t("authenticationProvider:forms.authenticatorSettings." +
                        "fido2.trustedApps.placeHolderTexts.emptySearch.subTitle.1") ] }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    action={
                        (<LinkButton onClick={ clearSearchQuery }>
                            { t("authenticationProvider:forms.authenticatorSettings." +
                                "fido2.trustedApps.buttons.emptySearchButton") }
                        </LinkButton>)
                    }
                    imageSize="tiny"
                />
            );
        } else {
            return null;
        }
    };

    /**
     * Update the current list of trusted apps with the given app.
     *
     * @param appName - Name of the updating app.
     * @param appType - Type of the updating app.
     * @param deleteApp - Whether the app should be removed.
     * @param shaValues - SHA values associated with the app.
     */
    const updateCurrentTrustedAppsList = (
        appName: string,
        appType: FIDOTrustedAppTypes,
        deleteApp?: boolean,
        shaValues?: string[]
    ) => {
        const clonedTrustedApps: FIDOTrustedAppsValuesInterface = cloneDeep(trustedApps);

        if (deleteApp) {
            delete clonedTrustedApps?.[appType]?.[appName];
        } else {
            if (!clonedTrustedApps?.[appType]?.[appName]) {
                clonedTrustedApps[appType][appName] = [];
            }

            if (shaValues) {
                clonedTrustedApps[appType][appName] = shaValues;
            }
        }

        setTrustedApps(clonedTrustedApps);
    };

    /**
     * Resolves the header of the trusted apps list item.
     *
     * @param trustedApp - The details of the selected trusted app.
     * @returns List item header component.
     */
    const resolveTrustedAppsListItemHeader = (trustedApp: FIDOTrustedAppsListInterface):
        ReactElement => (
        <Header
            as="h6"
            className="header-with-icon"
            data-componentId={ `${componentId}-heading` }
        >
            <Grid verticalAlign="middle">
                <Grid.Row>
                    <Grid.Column width={ 8 }>
                        <Header.Content>
                            <Grid verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column width={ 16 }>
                                        { trustedApp?.appName }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Header.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Header>
    );

    /**
     * Creates the actions of the trusted apps list item.
     *
     * @param trustedApp - The details of the selected trusted app.
     * @returns List item actions.
     */
    const createAccordionAction = (trustedApp: FIDOTrustedAppsListInterface):
        SegmentedAccordionTitleActionInterface[] => {

        return [
            {
                disabled: readOnly,
                icon: "trash alternate",
                onClick: () => updateCurrentTrustedAppsList(trustedApp?.appName, trustedApp?.appType, true),
                popoverText: t("authenticationProvider:forms.authenticatorSettings." +
                    "fido2.trustedApps..removeTrustedAppPopOver"),
                type: "icon"
            }
        ];
    };

    /**
     * Resolves the content of the trusted apps list item.
     *
     * @param trustedApp - The details of the selected trusted app.
     * @returns List item content.
     */
    const resolveTrustedAppListItemContent = (trustedApp: FIDOTrustedAppsListInterface):
        ReactElement => (
        trustedApp?.appType === FIDOTrustedAppTypes.ANDROID
            ? (
                <URLInput
                    urlState={ trustedApp?.shaValues?.join(",") }
                    setURLState={ (shaValues: string) => {
                        if (shaValues !== undefined) {
                            updateCurrentTrustedAppsList(
                                trustedApp?.appName, trustedApp?.appType, false, shaValues?.split(","));
                        }
                    } }
                    labelName={
                        t("authenticationProvider:forms." +
                                "authenticatorSettings.fido2.trustedAppSHAValues.label")
                    }
                    placeholder={
                        t("authenticationProvider:forms." +
                                "authenticatorSettings.fido2.trustedAppSHAValues.placeholder")
                    }
                    validationErrorMsg={
                        t("authenticationProvider:forms." +
                                "authenticatorSettings.fido2.trustedAppSHAValues.validations.invalid")
                    }
                    computerWidth={ 10 }
                    hint={
                        t("authenticationProvider:forms." +
                            "authenticatorSettings.fido2.trustedAppSHAValues.hint")
                    }
                    addURLTooltip={ t("common:addURL") }
                    duplicateURLErrorMessage={ t("common:duplicateURLError") }
                    data-testid={ `${ componentId }-fido-trusted-app-key-hashes-input` }
                    required = { false }
                    showPredictions={ false }
                    isAllowEnabled={ false }
                    skipInternalValidation
                    validation={ isValidSHA256 }
                    readOnly={ readOnly }
                />
            ): null
    );

    /**
     * Handle the click event of the trusted apps list item.
     *
     * @param trustedApp - The details of the selected trusted app.
     */
    const handleTrustedAppsListItemClick = (trustedApp: FIDOTrustedAppsListInterface) => {
        if (trustedApp?.appType === FIDOTrustedAppTypes.IOS) {
            return;
        }

        activeTrustedApp === trustedApp?.appName
            ? setActiveTrustedApp(null)
            : setActiveTrustedApp(trustedApp?.appName);
    };

    /**
     * Clear the search query.
     */
    const clearSearchQuery = (): void => {
        setSearchQuery("");
        setSearchedTrustedAppsList(trustedAppListData);
    };

    /**
     * Search the trusted apps list.
     *
     * @param event - Search Event.
     */
    const searchTrustedAppsList = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query: string = event?.target?.value;

        setSearchQuery(query);

        if (query?.length > 0) {
            // Filter the trusted app using `appName`.
            setSearchedTrustedAppsList(
                trustedAppListData?.filter((trustedApp: FIDOTrustedAppsListInterface) => {
                    return trustedApp?.appName?.toLowerCase()?.includes(query?.toLowerCase());
                })
            );
        } else {
            setSearchedTrustedAppsList(trustedAppListData);
        }
    };

    return (
        trustedAppListData?.length === 0
            ? (
                <EmphasizedSegment>
                    { getPlaceholders() }
                </EmphasizedSegment>
            )
            : (
                <Grid className="mt-3">
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                            <ListLayout
                                showTopActionPanel={ true }
                                showPagination={ false }
                                onPageChange={ () => null }
                                totalPages={ 100 }
                                data-componentid={ `${componentId}-list-layout` }
                                totalListSize={ trustedAppListData?.length }
                                leftActionPanel={
                                    (<div className="advanced-search-wrapper aligned-left fill-default">
                                        <Input
                                            className="advanced-search with-add-on"
                                            data-componentid={ `${componentId}-list-search-input` }
                                            icon="search"
                                            iconPosition="left"
                                            onChange={ searchTrustedAppsList }
                                            placeholder={ t("authenticationProvider:forms.authenticatorSettings." +
                                                "fido2.trustedApps.search") }
                                            floated="right"
                                            size="small"
                                            value={ searchQuery }
                                        />
                                    </div>)
                                }
                            >
                                {
                                    searchedTrustedAppsList?.length !== 0
                                        ? (
                                            <SegmentedAccordion
                                                data-componentid={ `${componentId}-trusted-apps` }
                                                viewType="table-view"
                                            >
                                                {
                                                    searchedTrustedAppsList?.map(
                                                        (trustedApp: FIDOTrustedAppsListInterface) => (
                                                            <Fragment key={ trustedApp?.appName }>
                                                                <SegmentedAccordion.Title
                                                                    id={ trustedApp?.appName }
                                                                    data-componentid={
                                                                        `${componentId}-${trustedApp?.appName}
                                                                                -title`
                                                                    }
                                                                    active={ activeTrustedApp
                                                                        === trustedApp?.appName }
                                                                    accordionIndex={ trustedApp?.appName }
                                                                    onClick={ () =>
                                                                        handleTrustedAppsListItemClick(trustedApp)
                                                                    }
                                                                    content={
                                                                        resolveTrustedAppsListItemHeader(trustedApp)
                                                                    }
                                                                    hideChevron={ false }
                                                                    actions={
                                                                        createAccordionAction(trustedApp)
                                                                    }
                                                                />
                                                                <SegmentedAccordion.Content
                                                                    active={ activeTrustedApp
                                                                        === trustedApp?.appName }
                                                                    data-componentid={
                                                                        `${componentId}-${trustedApp?.appName}
                                                                                    -content`
                                                                    }
                                                                    children={
                                                                        resolveTrustedAppListItemContent(trustedApp)
                                                                    }
                                                                />
                                                            </Fragment>
                                                        )
                                                    )
                                                }
                                            </SegmentedAccordion>
                                        )
                                        : getPlaceholders()
                                }
                            </ListLayout>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
    );

};

/**
 * Default props for the component.
 */
FIDOTrustedAppsList.defaultProps = {
    "data-componentid": "fido-trusted-apps-list"
};
