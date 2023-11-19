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

import { AsgardeoSPAClient, DecodedIDTokenPayload } from "@asgardeo/auth-react";
import { ArrowLeftArrowRightIcon, BuildingCircleCheckIcon, HierarchyIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import {
    AlertInterface,
    AlertLevels,
    TenantAssociationsInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert, setTenants } from "@wso2is/core/store";
import {
    Button,
    GenericIcon,
    HeaderPropsInterface as ReusableHeaderPropsInterface
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Divider,
    Dropdown,
    Grid,
    Icon,
    Input,
    Item,
    Menu,
    Placeholder,
    SemanticICONS
} from "semantic-ui-react";
import { getMiscellaneousIcons } from "../../../../../features/core/configs";
import { AppConstants } from "../../../../../features/core/constants";
import { history } from "../../../../../features/core/helpers/history";
import { AppState } from "../../../../../features/core/store";
import { OrganizationType } from "../../../../../features/organizations/constants";
import { useGetCurrentOrganizationType } from "../../../../../features/organizations/hooks/use-get-organization-type";
import { FeatureGateConstants } from "../../../feature-gate/constants/feature-gate";
import { getAssociatedTenants, makeTenantDefault } from "../../api";
import { TenantInfo, TenantRequestResponse, TriggerPropTypesInterface } from "../../models";
import { handleTenantSwitch } from "../../utils";
import { AddTenantWizard } from "../add-modal";

/**
 * Dashboard layout Prop types.
 */
interface TenantDropdownLinkInterface extends Omit<ReusableHeaderPropsInterface, "basicProfileInfo" | "profileInfo"> {
    /**
     * Content of dropdown item.
     */
    content?: string;
    /**
     * Name of dropdown item.
     */
    name: string;
    /**
     * Icon of dropdown item.
     */
    icon: SemanticICONS | ReactNode;
    /**
     * Function called when dropdown item is clicked.
     */
    onClick: () => void;
}

/**
 * Interface for tenant dropdown.
 */
interface TenantDropdownInterface extends TestableComponentInterface {
    trigger?: FunctionComponent<TriggerPropTypesInterface>;
    contained?: boolean;
    dropdownTrigger?: ReactElement;
    disable?: boolean;
}

const TenantDropdown: FunctionComponent<TenantDropdownInterface> = (props: TenantDropdownInterface): ReactElement => {

    const { dropdownTrigger, disable } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const username: string = useSelector((state: AppState) => state.auth.username);
    const email: string = useSelector((state: AppState) => state.auth.email);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const [ tenantAssociations, setTenantAssociations ] = useState<TenantAssociationsInterface>(undefined);
    const [ tempTenantAssociationsList, setTempTenantAssociationsList ] = useState<string[]>(undefined);
    const [ showTenantAddModal, setShowTenantAddModal ] = useState<boolean>(false);
    const [ isSwitchTenantsSelected, setIsSwitchTenantsSelected ] = useState<boolean>(false);
    const [ isSetDefaultTenantInProgress, setIsSetDefaultTenantInProgress ] = useState<boolean>(false);
    const [ associatedTenants, setAssociatedTenants ] = useState<string[]>([]);
    const [ defaultTenant, setDefaultTenant ] = useState<string>("");
    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const [ organizationId, setOrganizationId ] = useState<string>("");
    const [ organizationName, setOrganizationName ] = useState<string>("");
    const [ isCopying, setIsCopying ] = useState<boolean>(false);

    const { organizationType } = useGetCurrentOrganizationType();

    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    useEffect(() => {
        if (!isPrivilegedUser && saasFeatureStatus !== FeatureStatus.DISABLED) {
            getAssociatedTenants()
                .then((response: TenantRequestResponse) => {
                    let defaultDomain: string = "";
                    const tenants: string[] = [];

                    response.associatedTenants.forEach((tenant: TenantInfo) => {
                        if (tenant.default) {
                            defaultDomain = tenant.domain;
                        }

                        tenants.push(tenant.domain);
                    });

                    dispatch(setTenants<TenantInfo>(response.associatedTenants));
                    setAssociatedTenants(tenants);
                    setDefaultTenant(defaultDomain);
                })
                .catch((error: any) => {
                    dispatch(
                        addAlert({
                            description:
                                error?.description &&
                                t("extensions:manage.features.tenant.notifications." + "getTenants.description"),
                            level: AlertLevels.ERROR,
                            message:
                                error?.description &&
                                t("extensions:manage.features.tenant.notifications." + "getTenants.message")
                        })
                    );
                });
        }
        getOrganizationData();
    }, []);

    useEffect(() => {

        const association: TenantAssociationsInterface = {
            associatedTenants: associatedTenants,
            currentTenant: tenantDomain,
            defaultTenant: defaultTenant,
            username: email ? email : username
        };

        if (Array.isArray(association.associatedTenants)) {
            // Remove the current tenant from the associated tenants list.
            const currentTenantIndex: number = association.associatedTenants.indexOf(association.currentTenant);

            if (currentTenantIndex != -1) {
                association.associatedTenants.splice(currentTenantIndex, 1);
            }
            setTempTenantAssociationsList(association.associatedTenants);
        }
        setTenantAssociations(association);
    }, [ associatedTenants, defaultTenant, tenantDomain ]);

    /**
     * Stops the dropdown from closing on click.
     *
     * @param event - Click event.
     */
    const handleDropdownClick = (event: SyntheticEvent<HTMLElement>): void => {
        event.stopPropagation();
    };

    /**
     * This will copy the organization id to the clipboard.
     */
    const copyOrganizationId = () => {
        setIsCopying(true);
        navigator.clipboard.writeText(organizationId);
        setTimeout(() => {
            setIsCopying(false);
        }, 1000);
    };

    /**
     * Gets the organization id from the id token.
     */
    const getOrganizationData = () => {
        AsgardeoSPAClient.getInstance().getDecodedIDToken()
            .then((decodedToken: DecodedIDTokenPayload) => {
                setOrganizationId(decodedToken?.org_id);
                setOrganizationName(decodedToken?.org_name);
            }).catch(() => {
                dispatch(
                    addAlert({
                        description: t("extensions:console.organizationInfo." +
                        "notifications.getConfiguration.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:console.organizationInfo." +
                        "notifications.getConfiguration.error.message")
                    })
                );
            });
    };

    const resolveAssociatedTenants = (): ReactElement => {
        if (Array.isArray(tempTenantAssociationsList)) {
            return (
                <Item.Group
                    className="tenants-list"
                    unstackable
                    data-testid={ "associated-tenants-container" }
                >
                    {
                        tempTenantAssociationsList.length > 0 ?
                            (
                                tempTenantAssociationsList.map((association: string, index: number) => (
                                    (association !== tenantAssociations.currentTenant)
                                        ? (
                                            <Item
                                                className="tenant-account"
                                                key={ index }
                                                onClick={ () => handleTenantSwitch(association) }
                                            >
                                                <GenericIcon
                                                    icon={ getMiscellaneousIcons().tenantIcon }
                                                    inline
                                                    size="x22"
                                                    fill="white"
                                                    className="mt-3"
                                                />
                                                <Item.Content className="tenant-list-item-content">
                                                    <div
                                                        className="name"
                                                        data-testid={ `${ association }-tenant-la-name` }
                                                    >
                                                        { association }
                                                    </div>
                                                </Item.Content>
                                            </Item>
                                        )
                                        : null
                                ))
                            )
                            :
                            (
                                <Item
                                    className="empty-list"
                                >
                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <div className="message">
                                                { t("extensions:manage.features.tenant."
                                                + "header.tenantSearch.emptyResultMessage") }
                                            </div>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            )
                    }
                </Item.Group>
            );
        }
    };

    const tenantDropdownLinks: TenantDropdownLinkInterface[] = [
        {
            icon: <PlusIcon fill="black" />,
            name: t("extensions:manage.features.tenant.header.tenantAddHeader"),
            onClick: () => { setShowTenantAddModal(true); }
        }
    ];

    const setDefaultTenantInDropdown = (tenantName: string): void => {
        setIsSetDefaultTenantInProgress(true);
        makeTenantDefault(tenantName)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:manage.features.tenant.notifications.defaultTenant.success." +
                            "description", { tenantName: tenantName }),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:manage.features.tenant.notifications.defaultTenant.success.message")
                    }));

                    setDefaultTenant(tenantName);
                }
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description:
                    t("extensions:manage.features.tenant.notifications.defaultTenant.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.features.tenant.notifications.defaultTenant.genericError.message")
                }));
            })
            .finally(() => {
                setIsSetDefaultTenantInProgress(false);
                setIsDropDownOpen(!isDropDownOpen);
            });
    };

    /**
     * Search the tenant list.
     *
     * @param event - Input event
     */
    const searchTenantList = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const changeValue: string = event.target.value;

        if (tenantAssociations && Array.isArray(tenantAssociations.associatedTenants)) {
            let result: string | string[];

            if (changeValue.length > 0) {
                result = tenantAssociations.associatedTenants.filter((item: string) =>
                    item.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
            } else {
                result = tenantAssociations.associatedTenants;
            }
            setTempTenantAssociationsList(result);
        }
    };

    /**
     * Resets the dropdown states.
     */
    const resetTenantDropdown = (): void => {
        setIsSwitchTenantsSelected(false);
        if (tenantAssociations && Array.isArray(tenantAssociations.associatedTenants)) {
            setTempTenantAssociationsList(tenantAssociations.associatedTenants);
        }
    };

    const handleTenantDropdown = (): void => {
        if (!disable) {
            setIsDropDownOpen(!isDropDownOpen);
        }
    };

    const handleOrganizationsPageRoute = () => {
        history.push(AppConstants.getPaths().get("ORGANIZATIONS"));
        setIsDropDownOpen(!isDropDownOpen);
    };

    const tenantDropdownMenu: ReactElement = (
        <Menu.Item
            compact
            className={ "contained-trigger-wrapper" }
            key="tenant-dropdown"
        >
            <Dropdown
                onClick={ handleTenantDropdown }
                open={ isDropDownOpen }
                onBlur={ () => {
                    setIsDropDownOpen(false);
                    resetTenantDropdown();
                } }
                item
                floating
                className="tenant-dropdown"
                data-testid={ "tenant-dropdown" }
                data-componentid={ "tenant-dropdown" }
                trigger={ dropdownTrigger }
            >
                {
                    !isSwitchTenantsSelected ? (
                        <Dropdown.Menu className="tenant-dropdown-menu" onClick={ handleDropdownClick }>
                            <Item.Group className="current-tenant" unstackable>
                                <Item
                                    className={ isSubOrg ? "header sub-org-header" : "header" } 
                                    key={ "current-tenant" }
                                >
                                    {
                                        <GenericIcon
                                            transparent
                                            inline
                                            className="associated-tenant-icon"
                                            data-testid="associated-tenant-icon"
                                            icon={ getMiscellaneousIcons().tenantIcon }
                                            size="mini"
                                        />
                                    }
                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <div
                                                className="name ellipsis"
                                                data-testid={
                                                    "tenant-dropdown-display-name"
                                                }
                                            >
                                                {
                                                    organizationType === OrganizationType.SUBORGANIZATION
                                                        ? organizationName
                                                        : tenantAssociations
                                                            ? tenantAssociations.currentTenant
                                                            : (
                                                                <Placeholder>
                                                                    <Placeholder.Line />
                                                                </Placeholder>
                                                            )
                                                }
                                            </div>
                                            <Grid className="middle aligned content">
                                                <Grid.Row>
                                                    <div
                                                        className="org-id ellipsis"
                                                        data-componentId={
                                                            "tenant-dropdown-organization-id"
                                                        }
                                                    >
                                                        { organizationId }
                                                    </div>
                                                    <div>
                                                        <Button
                                                            basic
                                                            inline
                                                            data-componentid="org-id-copy-icon"
                                                            data-inverted
                                                            data-tooltip={ isCopying
                                                                ? t("extensions:manage.features.tenant." +
                                                                    "header.copied") 
                                                                : t("extensions:manage.features.tenant." +
                                                                    "header.copyOrganizationId")
                                                            }
                                                            icon={ (
                                                                <Icon
                                                                    name="copy outline"
                                                                    color="grey"
                                                                />
                                                            ) }
                                                            className="org-id-copy-btn"
                                                            onClick={ () => copyOrganizationId() }
                                                        />
                                                    </div>
                                                </Grid.Row>
                                            </Grid>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                            {
                                !isSubOrg && (
                                    <Dropdown.Header
                                        className="tenant-dropdown-links-category-header"
                                        content="Primary organizations"
                                    />
                                )
                            }
                            {
                                !isSubOrg &&
                                organizationType !== OrganizationType.SUBORGANIZATION &&
                                tenantAssociations ? (
                                        tenantAssociations.currentTenant ===
                                        tenantAssociations.defaultTenant ? (
                                                <Dropdown.Item
                                                    className="action-panel"
                                                    data-testid={ "default-button" }
                                                    disabled={ true }
                                                >
                                                    <BuildingCircleCheckIcon fill="black" />
                                                    { 
                                                        t("extensions:manage.features.tenant." +
                                                            "header.makeDefaultOrganization")
                                                    }
                                                </Dropdown.Item>
                                            ) : (
                                                <Dropdown.Item
                                                    className="action-panel"
                                                    onClick={ () =>
                                                        setDefaultTenantInDropdown(tenantAssociations.
                                                            currentTenant)
                                                    }
                                                    data-testid={ "default-button" }
                                                    disabled={ isSetDefaultTenantInProgress }
                                                >
                                                    <BuildingCircleCheckIcon fill="black" />
                                                    { 
                                                        t("extensions:manage.features.tenant." +
                                                            "header.makeDefaultOrganization")
                                                    }
                                                </Dropdown.Item>
                                            )
                                    ) : null
                            }
                            {
                                !isSubOrg &&
                                tenantAssociations &&
                                tenantAssociations.associatedTenants &&
                                Array.isArray(tenantAssociations.associatedTenants) &&
                                tenantAssociations.associatedTenants.length > 0
                                    ? (
                                        <Dropdown.Item
                                            className="action-panel"
                                            onClick={ () => setIsSwitchTenantsSelected(true) }
                                            data-testid={ "tenant-switch-menu" }
                                        >
                                            <ArrowLeftArrowRightIcon fill="black" />
                                            { t("extensions:manage.features.tenant.header.tenantSwitchHeader") }
                                        </Dropdown.Item>
                                    )
                                    : null
                            }
                            {
                                !isSubOrg &&
                                (tenantDropdownLinks
                                    && tenantDropdownLinks.length
                                    && tenantDropdownLinks.length > 0)
                                    ? tenantDropdownLinks.map((link: TenantDropdownLinkInterface, index: number) => {
                                        const {
                                            content,
                                            icon,
                                            name,
                                            onClick
                                        } = link;

                                        return (
                                            <Dropdown.Item
                                                key={ index }
                                                className="action-panel"
                                                onClick={ onClick }
                                                // Temporarily hiding dropdown item until
                                                // modal is implemented.
                                                // style={{display:'none'}}
                                                data-testid={ `tenant-dropdown-link-${ name.replace(" ", "-") }` }
                                            >
                                                {
                                                    icon
                                                }
                                                { name }
                                                { content }
                                            </Dropdown.Item>
                                        );
                                    })
                                    : null
                            }
                            {
                                !isSubOrg && (
                                    <>
                                        <Divider />
                                        <Dropdown.Item
                                            className="action-panel"
                                            onClick={ handleOrganizationsPageRoute }
                                            data-componentid={ "sub-organizations-menu" }
                                        >
                                            <HierarchyIcon fill="black" />
                                            Organizations
                                        </Dropdown.Item>
                                    </>
                                )
                            }
                        </Dropdown.Menu>
                    ) : (
                        <Dropdown.Menu onClick={ handleDropdownClick }>
                            <Item.Group className="current-tenant" unstackable>
                                <Item
                                    className="header back-button-wrapper"
                                    key={ "current-tenant" }
                                >
                                    <div className="link pointing" onClick={ resetTenantDropdown }>
                                        <Icon
                                            className="link-icon spaced-right"
                                            name="arrow left"
                                        />
                                        {
                                            t("extensions:manage.features.tenant.header.backButton")
                                        }
                                    </div>
                                </Item>
                            </Item.Group>
                            <Item.Group className="search-bar tenant">
                                <div
                                    className={ `tenant-dropdown-search
                                    advanced-search-wrapper aligned-left fill-default` }>
                                    <Input
                                        className="advanced-search with-add-on"
                                        data-testid="list-search-input"
                                        icon="search"
                                        iconPosition="left"
                                        onChange={ searchTenantList }
                                        placeholder={
                                            t("extensions:manage.features.tenant.header.tenantSearch.placeholder")
                                        }
                                        floated="right"
                                        size="small"
                                    />
                                </div>
                            </Item.Group>
                            {
                                tenantAssociations
                                    ? resolveAssociatedTenants()
                                    : null
                            }
                        </Dropdown.Menu>
                    )
                }
            </Dropdown>
        </Menu.Item>
    );

    return (
        <>
            {
                !isPrivilegedUser && showTenantAddModal
                    ? (
                        <AddTenantWizard
                            openModal={ showTenantAddModal }
                            onCloseHandler={ () => setShowTenantAddModal(false) } />
                    )
                    : null
            }
            { !isPrivilegedUser && tenantDropdownMenu }
        </>
    );
};

export default TenantDropdown;
