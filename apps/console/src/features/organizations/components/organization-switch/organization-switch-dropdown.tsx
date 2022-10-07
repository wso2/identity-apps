/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Divider,
    Dropdown,
    Grid,
    Icon,
    Input,
    Item,
    Loader,
    Menu,
    Placeholder,
    Popup,
    Segment
} from "semantic-ui-react";
import OrganizationListItem from "./organization-list-item";
import OrganizationSwitcherList from "./organization-switcher-list";
import { organizationConfigs } from "../../../../extensions";
import { ReactComponent as CrossIcon } from "../../../../themes/default/assets/images/icons/cross-icon.svg";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    getMiscellaneousIcons
} from "../../../core";
import { getOrganizations, useGetOrganizationBreadCrumb } from "../../api";
import {
    BreadcrumbItem,
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationListInterface,
    OrganizationResponseInterface
} from "../../models";
import { AddOrganizationModal } from "../add-organization-modal";

/**
 * Interface for component dropdown.
 */
type OrganizationSwitchDropdownInterface = IdentifiableComponentInterface;

const OrganizationSwitchDropdown: FunctionComponent<OrganizationSwitchDropdownInterface> = (
    props: OrganizationSwitchDropdownInterface
): ReactElement => {
    const { "data-componentid": componentId } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );
    const feature: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );
    const scopes = useSelector((state: AppState) => state.auth.allowedScopes);
    const tenantDomain: string = useSelector(
        (state: AppState) => state?.auth?.tenantDomain
    );

    const [ associatedOrganizations, setAssociatedOrganizations ] = useState<
        OrganizationInterface[]
    >([]);
    const [ listFilter, setListFilter ] = useState("");
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const [ search, setSearch ] = useState<string>("");
    const [ isOrganizationsLoading, setIsOrganizationsLoading ] = useState<
        boolean
    >(false);
    const [ showNewOrgWizard, setShowNewOrgWizard ] = useState<boolean>(false);
    const [ showBreadcrumb, setShowBreadcrumb ] = useState<boolean>(false);

    const {
        data: breadcrumbList,
        error: breadcrumbError
    } = useGetOrganizationBreadCrumb();

    const [ parents, setParents ] = useState<
        (OrganizationInterface | OrganizationResponseInterface)[]
            >([]);

    const noOfItems = 10;

    /**
     * Handles the pagination change.
     *
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (): void => {
        getOrganizationList(listFilter, afterCursor, null);
    };

    const getOrganizationList = useCallback(
        async (
            filter: string,
            after: string,
            before: string,
            parentId?: OrganizationInterface | OrganizationResponseInterface
        ) => {
            const filterStrWithDisableFilter = `status eq ACTIVE ${ filter ? "and " + filter : ""
            }`;

            !after && setIsOrganizationsLoading(true);

            getOrganizations(
                filterStrWithDisableFilter,
                noOfItems,
                after,
                before,
                false,
                false
            )
                .then((response: OrganizationListInterface) => {
                    if (!response || !response.organizations) {
                        setAssociatedOrganizations(organizations =>
                            after ? [ ...organizations ] : []
                        );
                        setPaginationData(response.links);
                    } else {
                        const organizations: OrganizationInterface[] = [
                            ...response?.organizations
                        ];

                        setAssociatedOrganizations(associatedOrganizations =>
                            after
                                ? [ ...associatedOrganizations, ...organizations ]
                                : [ ...organizations ]
                        );

                        setPaginationData(response.links);
                    }
                    parentId && setParents(parents => [ ...parents, parentId ]);
                })
                .catch(error => {
                    if (error?.description) {
                        dispatch(
                            addAlert({
                                description: error.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.organizations.notifications." +
                                    "getOrganizationList.error.message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.organizations.notifications.getOrganizationList" +
                                ".genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications." +
                                "getOrganizationList.genericError.message"
                            )
                        })
                    );
                })
                .finally(() => {
                    setIsOrganizationsLoading(false);
                });
        },
        []
    );

    const setPaginationData = (links: OrganizationLinkInterface[]) => {
        setAfterCursor(undefined);
        if (!links || links.length === 0) {
            return;
        }

        links.forEach(link => {
            if (link.rel === "next") {
                const afterCursorLink = link.href.toString().split("after=")[ 1 ];

                setAfterCursor(afterCursorLink);
            }
        });
    };

    useEffect(() => {
        if (!isDropDownOpen) {
            return;
        }

        getOrganizationList(listFilter, null, null);
    }, [ getOrganizationList, listFilter, isDropDownOpen ]);

    /**
     * Stops the dropdown from closing on click.
     *
     * @param e - Click event.
     */
    const handleDropdownClick = (e: SyntheticEvent<HTMLElement>): void => {
        e.stopPropagation();
    };

    const handleOrgRowClick = (
        organization: OrganizationInterface | OrganizationResponseInterface
    ): void => {
        getOrganizationList(
            "parentId eq " + organization.id,
            null,
            null,
            organization
        );
    };

    const handleBackButtonClick = (): void => {
        const parentIdsCopy = [ ...parents ];

        parentIdsCopy.pop();
        setParents(parentIdsCopy);
        setIsOrganizationsLoading(true);
        getOrganizationList(
            parentIdsCopy?.length > 0
                ? "parentId eq " + parentIdsCopy[ parentIdsCopy.length - 1 ].id
                : "",
            null,
            null
        );
    };

    /**
     * Search the organization list.
     *
     * @param search - Search query.
     */
    const searchOrganizationList = (search: string): void => {
        const changeValue = search.trim();

        setListFilter(
            changeValue
                ? parents.length > 0
                    ? `name co ${ changeValue } and parentId eq ${ parents[ parents.length - 1 ]
                    }`
                    : `name co ${ changeValue }`
                : ""
        );
    };

    /**
     * Resets the dropdown states.
     */
    const resetTenantDropdown = (): void => {
        setListFilter("");
        setAfterCursor(undefined);
        setIsDropDownOpen(false);
    };

    const handleNewClick = (): void => {
        setIsDropDownOpen(false);
        setShowNewOrgWizard(true);
    };

    const closeNewOrgWizard = (): void => {
        setShowNewOrgWizard(false);
    };
    const handleCurrentOrgClick = (): void => {
        setParents([]);
        setIsDropDownOpen(!isDropDownOpen);
    };
    const tenantDropdownMenu = (name: string, isBreadcrumbItem?: boolean) => (
        <Dropdown
            onBlur={ resetTenantDropdown }
            item
            floating
            pointing="top left"
            className="tenant-dropdown"
            data-componentid={ "component-dropdown" }
            open={ isDropDownOpen }
            onClick={ handleCurrentOrgClick }
            trigger={
                isBreadcrumbItem ? (
                    <div className="item">
                        <span>{ name }</span>
                        <Icon name="caret down" className="separator-icon" />
                    </div>
                ) : (
                    <div className="organization-breadcrumb trigger">
                        <div className="icon-wrapper">
                            <GenericIcon
                                transparent
                                data-componentid="component-dropdown-trigger-icon"
                                data-testid="tenant-dropdown-trigger-icon"
                                icon={ getMiscellaneousIcons().tenantIcon }
                                size="micro"
                            />
                        </div>
                        <div className="item">
                            <span>{ name }</span>
                            <Icon
                                name="caret down"
                                className="separator-icon"
                            />
                        </div>
                    </div>
                )
            }
            icon=""
        >
            <Dropdown.Menu className="organization-dropdown-menu">
                { isDropDownOpen && (
                    <>
                        <Grid padded>
                            <OrganizationListItem
                                organization={ currentOrganization }
                                isClickable={ false }
                                showSwitch={ false }
                                handleOrgRowClick={ handleOrgRowClick }
                                setShowDropdown={ setIsDropDownOpen }
                            />
                        </Grid>
                        <Divider />
                        <Segment basic secondary>
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column
                                        width={ 12 }
                                        verticalAlign="middle"
                                    >
                                        <h5>
                                            { t(
                                                "console:manage.features.organizations." +
                                                "switching.subOrganizations"
                                            ) }
                                        </h5>
                                    </Grid.Column>
                                    <Grid.Column width={ 4 }>
                                        <Button
                                            basic
                                            floated="right"
                                            onClick={ handleNewClick }
                                        >
                                            <Icon name="add" />
                                            { t("common:new") }
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Item.Group className="search-bar">
                                <div className="advanced-search-wrapper aligned-left fill-default">
                                    <Input
                                        className="advanced-search with-add-on"
                                        data-componentid="list-search-input"
                                        icon="search"
                                        iconPosition="left"
                                        value={ search }
                                        onChange={ event => {
                                            setSearch(event.target.value);
                                        } }
                                        onKeyDown={ (
                                            event: React.KeyboardEvent
                                        ) => {
                                            event.key === "Enter" &&
                                                searchOrganizationList(search);
                                            event.stopPropagation();
                                        } }
                                        placeholder={ t(
                                            "console:manage.features.organizations.switching.search.placeholder"
                                        ) }
                                        floated="right"
                                        size="small"
                                        action={
                                            search ? (
                                                <Popup
                                                    trigger={
                                                        (<Button
                                                            data-componentid={ `${ componentId }-clear-button` }
                                                            basic
                                                            compact
                                                            className="input-add-on organizations"
                                                        >
                                                            <GenericIcon
                                                                size="nano"
                                                                defaultIcon
                                                                transparent
                                                                icon={ CrossIcon }
                                                                onClick={ () => {
                                                                    setSearch(
                                                                        ""
                                                                    );
                                                                    searchOrganizationList(
                                                                        ""
                                                                    );
                                                                } }
                                                            />
                                                        </Button>)
                                                    }
                                                    position="top center"
                                                    content={ t(
                                                        "console:common.advancedSearch.popups.clear"
                                                    ) }
                                                    inverted={ true }
                                                />
                                            ) : null
                                        }
                                    />
                                </div>
                            </Item.Group>
                            { associatedOrganizations ? (
                                isOrganizationsLoading ? (
                                    <Segment basic>
                                        <Loader active inline="centered" />
                                    </Segment>
                                ) : (
                                    <OrganizationSwitcherList
                                        organizations={ associatedOrganizations }
                                        handleOrgRowClick={ handleOrgRowClick }
                                        handleBackButtonClick={
                                            handleBackButtonClick
                                        }
                                        parents={ parents }
                                        hasMore={ !!afterCursor }
                                        currentOrganization={
                                            currentOrganization
                                        }
                                        loadMore={ handlePaginationChange }
                                        setShowDropdown={ setIsDropDownOpen }
                                    />
                                )
                            ) : null }
                        </Segment>
                    </>
                ) }
            </Dropdown.Menu>
        </Dropdown>
    );

    const generateBreadcrumb = (): ReactElement => {
        if (breadcrumbList.length < 4) {
            return (
                <Menu className="organization-breadcrumb">
                    { breadcrumbList.map(
                        (breadcrumb: BreadcrumbItem, index: number) => {
                            if (index !== breadcrumbList.length - 1) {
                                return (
                                    <Menu.Item
                                        name="super"
                                        onClick={ () => null }
                                        key={ index }
                                    >
                                        <span>{ breadcrumb.name }</span>
                                        <Icon
                                            name="caret right"
                                            className="separator-icon"
                                        />
                                    </Menu.Item>
                                );
                            }

                            {
                                tenantDropdownMenu(breadcrumb.name);
                            }
                        }
                    ) }
                </Menu>
            );
        }

        return (
            <Menu className="organization-breadcrumb">
                <Menu.Item name="super" onClick={ () => null }>
                    <span>{ breadcrumbList[ 0 ].name }</span>
                    <Icon name="caret right" className="separator-icon" />
                </Menu.Item>
                <Dropdown
                    item
                    text="..."
                    icon="caret right"
                    className="breadcrumb-dropdown"
                >
                    <Dropdown.Menu>
                        { breadcrumbList.map(
                            (breadcrumb: BreadcrumbItem, index: number) => {
                                if (
                                    index === 0 ||
                                    index > breadcrumbList.length - 3
                                ) {
                                    return;
                                }

                                return (
                                    <Dropdown.Item
                                        key={ index }
                                        onClick={ () => null }
                                        icon="caret right"
                                        text={ breadcrumb.name }
                                    />
                                );
                            }
                        ) }
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item name="super" onClick={ () => null }>
                    <span>
                        { breadcrumbList[ breadcrumbList.length - 2 ].name }
                    </span>
                    <Icon name="caret right" className="separator-icon" />
                </Menu.Item>
                { tenantDropdownMenu(
                    breadcrumbList[ breadcrumbList.length - 1 ].name,
                    true
                ) }
            </Menu>
        );
    };

    const breadcrumb = (): ReactElement => {
        if (!breadcrumbList || breadcrumbList.length === 0) {
            return;
        }

        if (breadcrumbList.length === 1) {
            return (
                <div className="organization-breadcrumb-wrapper">
                    { tenantDropdownMenu(currentOrganization.name) }
                </div>
            );
        }

        return (
            <div className="organization-breadcrumb-wrapper">
                { !showBreadcrumb ? (
                    <Menu className="organization-breadcrumb">
                        <div className="icon-wrapper">
                            <GenericIcon
                                transparent
                                data-componentid="component-dropdown-trigger-icon"
                                data-testid="tenant-dropdown-trigger-icon"
                                icon={ getMiscellaneousIcons().tenantIcon }
                                size="micro"
                            />
                        </div>
                        <Menu.Item
                            name="super"
                            onClick={ () => setShowBreadcrumb(true) }
                        >
                            <span>{ currentOrganization?.name }</span>
                            <Icon
                                name="caret right"
                                className="separator-icon"
                            />
                        </Menu.Item>
                    </Menu>
                ) : generateBreadcrumb() }
            </div>
        );
    };

    return (
        <>
            { breadcrumb() }
            { showNewOrgWizard && (
                <AddOrganizationModal
                    parent={ parents[ parents.length - 1 ] }
                    closeWizard={ closeNewOrgWizard }
                />
            ) }
        </>
    );
};

export default OrganizationSwitchDropdown;

OrganizationSwitchDropdown.defaultProps = {
    "data-componentid": "organization-switch-dropdown"
};
