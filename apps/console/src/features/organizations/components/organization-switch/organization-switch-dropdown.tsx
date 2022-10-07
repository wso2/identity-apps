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

import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { SessionStorageUtils } from "@wso2is/core/utils";
import { GenericIcon } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
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
    Popup,
    Segment
} from "semantic-ui-react";
import OrganizationListItem from "./organization-list-item";
import OrganizationSwitcherList from "./organization-switcher-list";
import { ReactComponent as CrossIcon } from "../../../../themes/default/assets/images/icons/cross-icon.svg";
import {
    AppState,
    getMiscellaneousIcons
} from "../../../core";
import { getOrganizations, useGetOrganizationBreadCrumb } from "../../api";
import {
    BreadcrumbItem,
    GenericOrganization,
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationListInterface,
    OrganizationResponseInterface
} from "../../models";
import { OrganizationUtils } from "../../utils";
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

    const { data: breadcrumbList } = useGetOrganizationBreadCrumb();

    const [ parents, setParents ] = useState<GenericOrganization[]>([]);

    const noOfItems = 10;

    /**
     * Handles the pagination change.
     *
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (): void => {
        getOrganizationList(listFilter, afterCursor, null);
    };

    const handleOrganizationSwitch = (
        organization: GenericOrganization
    ): void => {
        let newOrgPath: string = "";

        if (OrganizationUtils.isRootOrganization(organization)) {
            newOrgPath = `${ window[ "AppUtils" ].getConfig().tenantPathWithoutSuperTenant
            } /${ window[ "AppUtils" ].getConfig().appBase }`;
        } else {
            newOrgPath =
                window[ "AppUtils" ].getConfig().tenantPathWithoutSuperTenant +
                "/o/" +
                organization.id +
                "/" +
                window[ "AppUtils" ].getConfig().appBase;
        }

        // Clear the callback url of the previous organization.
        SessionStorageUtils.clearItemFromSessionStorage(
            "auth_callback_url_console"
        );

        // Redirect the user to the newly selected organization path.
        window.location.replace(newOrgPath);

        setIsDropDownOpen(false);
    };

    const getOrganizationList = useCallback(
        async (
            filter: string,
            after: string,
            before: string,
            parentId?: GenericOrganization
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

    const handleOrgRowClick = (organization: GenericOrganization): void => {
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
            className="tenant-dropdown breadcrumb"
            data-componentid={ "component-dropdown" }
            open={ isDropDownOpen }
            onClick={ handleCurrentOrgClick }
            trigger={
                isBreadcrumbItem ? (
                    <div
                        className="item breadcrumb"
                        onClick={ e => e.stopPropagation() }
                    >
                        <span
                            onClick={ () => setIsDropDownOpen(!isDropDownOpen) }
                        >
                            { name }
                            <Icon
                                name="caret down"
                                className="separator-icon"
                            />
                        </span>
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
                        <div className="item breadcrumb">
                            <span>{ name }</span>
                            <Icon
                                name="caret down"
                                className="separator-icon"
                            />
                        </div>
                    </div>
                )
            }
            icon={ null }
        >
            <Dropdown.Menu
                className="organization-dropdown-menu"
                onClick={ e => e.stopPropagation() }
            >
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
                                        handleOrganizationSwitch={
                                            handleOrganizationSwitch
                                        }
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
        if (breadcrumbList.length <= 4) {
            return (
                <Menu className="organization-breadcrumb">
                    { breadcrumbList.map(
                        (breadcrumb: BreadcrumbItem, index: number) => {
                            if (index !== breadcrumbList.length - 1) {
                                return (
                                    <Menu.Item
                                        key={ index }
                                        className="breadcrumb"
                                    >
                                        <span
                                            onClick={ () =>
                                                handleOrganizationSwitch(
                                                    breadcrumb
                                                )
                                            }
                                        >
                                            { breadcrumb.name }
                                        </span>
                                        <Icon
                                            name="caret right"
                                            className="separator-icon"
                                        />
                                    </Menu.Item>
                                );
                            }

                            return tenantDropdownMenu(breadcrumb.name, true);
                        }
                    ) }
                    <Menu.Item className="breadcrumb">
                        <GenericIcon
                            size="nano"
                            defaultIcon
                            transparent
                            icon={ CrossIcon }
                            onClick={ () => setShowBreadcrumb(false) }
                            className="close-icon"
                        />
                    </Menu.Item>
                </Menu>
            );
        }

        return (
            <Menu className="organization-breadcrumb">
                <Menu.Item className="breadcrumb">
                    <span
                        onClick={ () =>
                            handleOrganizationSwitch(breadcrumbList[ 0 ])
                        }
                    >
                        { breadcrumbList[ 0 ].name }
                    </span>
                    <Icon name="caret right" className="separator-icon" />
                </Menu.Item>
                <Dropdown
                    item
                    text="..."
                    icon="caret right"
                    className="breadcrumb-dropdown breadcrumb"
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
                                        onClick={ () =>
                                            handleOrganizationSwitch(breadcrumb)
                                        }
                                        icon="caret right"
                                        text={ breadcrumb.name }
                                        className="breadcrumb-dropdown-item"
                                    />
                                );
                            }
                        ) }
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item className="breadcrumb">
                    <span
                        onClick={ () =>
                            handleOrganizationSwitch(
                                breadcrumbList[ breadcrumbList.length - 2 ]
                            )
                        }
                    >
                        { breadcrumbList[ breadcrumbList.length - 2 ].name }
                    </span>
                    <Icon name="caret right" className="separator-icon" />
                </Menu.Item>
                { tenantDropdownMenu(
                    breadcrumbList[ breadcrumbList.length - 1 ].name,
                    true
                ) }
                <Menu.Item className="breadcrumb">
                    <GenericIcon
                        size="nano"
                        defaultIcon
                        transparent
                        icon={ CrossIcon }
                        onClick={ () => setShowBreadcrumb(false) }
                    />
                </Menu.Item>
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
                    <div
                        className="organization-breadcrumb trigger"
                        onClick={ () => setShowBreadcrumb(true) }
                    >
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
                            <span>{ currentOrganization?.name }</span>
                            <Icon
                                name="caret right"
                                className="separator-icon"
                            />
                        </div>
                    </div>
                ) : (
                    generateBreadcrumb()
                ) }
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
