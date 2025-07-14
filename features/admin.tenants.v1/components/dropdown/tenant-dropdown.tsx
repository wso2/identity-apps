/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import Chip from "@oxygen-ui/react/Chip";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import {
    ArrowLeftArrowRightIcon,
    BuildingAltIcon,
    BuildingCircleCheckIcon,
    BuildingPenIcon,
    HierarchyIcon,
    PlusIcon
} from "@oxygen-ui/react-icons";
import {
    FeatureAccessConfigInterface,
    FeatureStatus,
    useCheckFeatureStatus,
    useRequiredScopes
} from "@wso2is/access-control";
import { getMiscellaneousIcons } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { organizationConfigs } from "@wso2is/admin.extensions.v1";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert, setTenants } from "@wso2is/core/store";
import {
    Button,
    GenericIcon,
    HeaderPropsInterface as ReusableHeaderPropsInterface
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
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
import { getAssociatedTenants, makeTenantDefault } from "../../api";
import useGetDeploymentUnits from "../../api/use-get-deployment-units";
import TenantConstants from "../../constants/tenant-constants";
import {
    DeploymentUnit,
    TenantInfo,
    TenantRequestResponse,
    TriggerPropTypesInterface
} from "../../models";
import { TenantAssociationsInterface } from "../../models/saas/tenants";
import { handleTenantSwitch } from "../../utils";
import { AddTenantWizard } from "../add-modal";
import "./tenant-dropdown.scss";

/**
 * Dashboard layout Prop types.
 */
interface TenantDropdownLinkInterface extends Omit<
    ReusableHeaderPropsInterface, "basicProfileInfo" | "profileInfo" | "primaryUserStoreDomainName"
> {
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
    const { isSuperOrganization } = useGetCurrentOrganizationType();

    const username: string = useSelector((state: AppState) => state.auth.username);
    const email: string = useSelector((state: AppState) => state.auth.email);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const organizationsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.organizations
    );

    const tenantsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.tenants
    );

    const isCentralDeploymentEnabled: boolean = useSelector((state: AppState) => {
        return state?.config?.deployment?.centralDeploymentEnabled;
    });

    const isRegionSelectionEnabled: boolean = useSelector((state: AppState) => {
        return state?.config?.deployment?.regionSelectionEnabled;
    });

    const hasOrganizationReadPermissions: boolean = useRequiredScopes(organizationsFeatureConfig?.scopes?.read);

    const isMakingTenantsDefaultEnabled: boolean = useSelector((state: AppState) => {
        return !state?.config?.ui?.features?.tenants?.disabledFeatures?.includes(
            TenantConstants.FEATURE_DICTIONARY.MAKING_TENANTS_DEFAULT
        );
    });
    const isManagingTenantsFromDropdownEnabled: boolean = useSelector((state: AppState) => {
        return !state?.config?.ui?.features?.tenants?.disabledFeatures?.includes(
            TenantConstants.FEATURE_DICTIONARY.MANAGING_TENANTS_FROM_DROPDOWN
        );
    });
    const isAddingTenantsFromDropdownEnabled: boolean = useSelector((state: AppState) => {
        return !state?.config?.ui?.features?.tenants?.disabledFeatures?.includes(
            TenantConstants.FEATURE_DICTIONARY.ADD_TENANTS_FROM_DROPDOWN
        );
    });
    const isOrganizationsQuickNavFromDropdownEnabled: boolean = useSelector((state: AppState) => {
        return !state?.config?.ui?.features?.tenants?.disabledFeatures?.includes(
            TenantConstants.FEATURE_DICTIONARY.ORGANIZATIONS_QUICK_NAV_FROM_DROPDOWN
        );
    });

    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );
    const isOrgHandleFeatureEnabled: boolean = isFeatureEnabled(
        featureConfig.organizations,"organizations.orgHandle"
    );

    const [ tenantAssociations, setTenantAssociations ] = useState<TenantAssociationsInterface>(undefined);
    const [ tempTenantAssociationsList, setTempTenantAssociationsList ] = useState<TenantInfo[]>(undefined);
    const [ showTenantAddModal, setShowTenantAddModal ] = useState<boolean>(false);
    const [ isSwitchTenantsSelected, setIsSwitchTenantsSelected ] = useState<boolean>(false);
    const [ deploymentUnits, setDeploymentUnits ] = useState<DeploymentUnit[]>([]);
    const [ isSetDefaultTenantInProgress, setIsSetDefaultTenantInProgress ] = useState<boolean>(false);
    const [ associatedTenants, setAssociatedTenants ] = useState<TenantInfo[]>([]);
    const [ associatedTenantsOffset, setAssociatedTenantsOffset ] = useState<number>(0);
    const [ hasMoreAssociatedTenants, setHasMoreAssociatedTenants ] = useState<boolean>(true);
    const [ defaultTenant, setDefaultTenant ] = useState<TenantInfo>(undefined);
    const [ currentTenant, setCurrentTenant ] = useState<TenantInfo>(undefined);
    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const [ organizationId, setOrganizationId ] = useState<string>("");
    const [ organizationName, setOrganizationName ] = useState<string>("");
    const [ organizationHandle, setOrganizationHandle ] = useState<string>("");
    const [ isCopying, setIsCopying ] = useState<boolean>(false);

    const { organizationType } = useGetCurrentOrganizationType();

    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const associatedTenantsLimit: number = 15;

    useEffect(() => {
        setAssociatedTenantsOffset(0);
        if (!isPrivilegedUser && saasFeatureStatus !== FeatureStatus.DISABLED) {
            getAssociatedTenants(null, associatedTenantsLimit, associatedTenantsOffset)
                .then((response: TenantRequestResponse) => {
                    let defaultTenant: TenantInfo;
                    let currentTenant: TenantInfo;
                    const tenants: TenantInfo[] = [];

                    response.associatedTenants.forEach((tenant: TenantInfo) => {
                        if (tenant.default) {
                            defaultTenant = tenant;
                        }
                        if (tenant.domain === tenantDomain) {
                            currentTenant = tenant;
                        }
                        tenants.push(tenant);
                    });

                    dispatch(setTenants<TenantInfo>(response.associatedTenants));
                    setAssociatedTenants(tenants);
                    setDefaultTenant(defaultTenant);
                    setCurrentTenant(currentTenant);
                    setHasMoreAssociatedTenants(response.totalResults > response.associatedTenants.length);
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
    }, [ organizationType ]);

    useEffect(() => {

        if (!currentTenant){
            const _currentTenant: TenantInfo = {
                associationType: "",
                default: false,
                domain: tenantDomain,
                id: ""
            };

            setCurrentTenant(_currentTenant);
        }

        const association: TenantAssociationsInterface = {
            associatedTenants: associatedTenants,
            currentTenant: currentTenant,
            defaultTenant: defaultTenant,
            username: email ?? username
        };

        if (Array.isArray(association.associatedTenants)) {
            // Remove the current tenant from the associated tenants list.
            const currentTenantIndex: number = association.associatedTenants.indexOf(association.currentTenant);

            if (currentTenantIndex !== -1) {
                association.associatedTenants.splice(currentTenantIndex, 1);
            }
            setTempTenantAssociationsList(association.associatedTenants);
        }
        setTenantAssociations(association);
    }, [ associatedTenants, defaultTenant, currentTenant ]);

    const {
        data: deploymentUnitResponse,
        isLoading: isDeploymentUnitsLoading,
        error: deploymentUnitFetchRequestError
    } = useGetDeploymentUnits(isCentralDeploymentEnabled && isRegionSelectionEnabled);

    useEffect(() => {
        setDeploymentUnits(deploymentUnitResponse?.deploymentUnits);
    }, [ isDeploymentUnitsLoading ]);

    /**
     * Dispatches error notifications if deployment unit fetch request fails.
     */
    useEffect(() => {
        if (!deploymentUnitFetchRequestError) {
            return;
        }

        if (deploymentUnitFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: deploymentUnitFetchRequestError?.response?.data?.description
                    ?? deploymentUnitFetchRequestError?.response?.data?.detail
                        ?? t("tenants:listDeploymentUnits.description"),
                level: AlertLevels.ERROR,
                message: deploymentUnitFetchRequestError?.response?.data?.message
                    ?? t("tenants:listDeploymentUnits.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("tenants:listDeploymentUnits.description"),
            level: AlertLevels.ERROR,
            message: t("tenants:listDeploymentUnits.message")
        }));
    }, [ deploymentUnitFetchRequestError ]);


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
     * This will copy the organization handle to the clipboard.
     */
    const copyOrganizationHandle = () => {
        setIsCopying(true);
        navigator.clipboard.writeText(organizationHandle);
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
                setOrganizationHandle(decodedToken?.org_handle);
            }).catch(() => {
                dispatch(
                    addAlert({
                        description: t("organizations:notifications.getConfiguration.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("organizations:notifications.getConfiguration.error.message")
                    })
                );
            });
    };

    /**
     * Load more tenants in the list using infinite scroll.
     */
    const loadMoreItems = () => {
        // Fetch more tenants.
        if (!isPrivilegedUser && saasFeatureStatus !== FeatureStatus.DISABLED) {
            getAssociatedTenants(null, associatedTenantsLimit, associatedTenantsOffset + associatedTenantsLimit)
                .then((response: TenantRequestResponse) => {
                    let updatedDefaultTenant: TenantInfo = defaultTenant;
                    let updatedCurrentTenant: TenantInfo = currentTenant;
                    const tenants: TenantInfo[] = [];

                    response.associatedTenants.forEach((tenant: TenantInfo) => {
                        if (isEmpty(defaultTenant) && tenant.default) {
                            updatedDefaultTenant = tenant;
                        }
                        if (isEmpty(currentTenant) && tenant.domain === tenantDomain) {
                            updatedCurrentTenant = tenant;
                        }

                        tenants.push(tenant);
                    });
                    // Add tenants to the associatedTenants state
                    setAssociatedTenants([ ...associatedTenants, ...tenants ]);
                    setAssociatedTenantsOffset(associatedTenantsOffset + associatedTenantsLimit);
                    setDefaultTenant(updatedDefaultTenant);
                    setCurrentTenant(updatedCurrentTenant);
                    setHasMoreAssociatedTenants(associatedTenantsLimit === response.associatedTenants.length);
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
    };

    /**
     * Resolve associated tenant record.
     *
     * @param tempTenantAssociation - Tenant name.
     * @param index - Index.
     */
    const resolveAssociatedTenantRecord = (tempTenantAssociation: TenantInfo, index: number): ReactElement => {
        if (tenantAssociations.currentTenant !== tempTenantAssociation) {
            return (
                <Item
                    className="tenant-account"
                    key={ index }
                    onClick={ () => handleTenantSwitch(tempTenantAssociation.domain,
                        isCentralDeploymentEnabled && isRegionSelectionEnabled ?
                            tempTenantAssociation.consoleHostname: undefined) }
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
                            data-testid={ `${ tempTenantAssociation?.domain }-tenant-la-name` }
                        >
                            { tempTenantAssociation?.domain + (isCentralDeploymentEnabled && isRegionSelectionEnabled ?
                                " (" + tempTenantAssociation?.deploymentUnitName + ")" : "") }
                        </div>
                    </Item.Content>
                </Item>
            );
        }

        return null;
    };

    /**
     * Loading component.
     */
    const loadingComponent = () => {
        return (
            <Item className="tenant-account">
                <CircularProgress size={ 22 } className="tenant-list-item-loader"/>
                <Item.Content className="tenant-list-item-content">
                    <div className="name">
                        { t("common:loading") }...
                    </div>
                </Item.Content>
            </Item>
        );
    };

    const resolveAssociatedTenants = (): ReactElement => {
        if (Array.isArray(tempTenantAssociationsList)) {
            return (
                <Item.Group
                    id="associated-tenants-container"
                    className="tenants-list"
                    unstackable
                    data-testid={ "associated-tenants-container" }
                >
                    {
                        tempTenantAssociationsList.length > 0 ? (
                            <InfiniteScroll
                                dataLength={ tempTenantAssociationsList.length }
                                next={ loadMoreItems }
                                hasMore={ hasMoreAssociatedTenants }
                                loader={ loadingComponent() }
                                endMessage={ null }
                                scrollableTarget="associated-tenants-container"
                            >
                                {
                                    tempTenantAssociationsList.map((tenant: TenantInfo, index: number) =>
                                        resolveAssociatedTenantRecord(tenant, index))
                                }
                            </InfiniteScroll>
                        ) : (
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

    const tenantDropdownLinks: TenantDropdownLinkInterface[] =
    !isFeatureEnabled(tenantsFeatureConfig, TenantConstants.FEATURE_DICTIONARY.ADD_TENANTS_FROM_DROPDOWN)
        ? []
        : [
            {
                icon: <PlusIcon fill="black" />,
                name: t("extensions:manage.features.tenant.header.tenantAddHeader"),
                onClick: () => { setShowTenantAddModal(true); }
            }
        ];

    const setDefaultTenantInDropdown = (tenant: TenantInfo): void => {
        setIsSetDefaultTenantInProgress(true);
        makeTenantDefault(tenant.domain)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:manage.features.tenant.notifications.defaultTenant.success." +
                            "description", { tenantName: tenant.domain }),
                        level: AlertLevels.SUCCESS,
                        message: t("extensions:manage.features.tenant.notifications.defaultTenant.success.message")
                    }));

                    setDefaultTenant(tenant);
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
            let result: TenantInfo[];

            if (changeValue.length > 0) {
                result = tenantAssociations.associatedTenants.filter((tenantInfo: TenantInfo) =>
                    tenantInfo.domain?.toLowerCase()?.indexOf(changeValue.toLowerCase()) !== -1);
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

    const renderDropdownOptions = (): ReactElement[] => {
        const options: ReactElement[] = [];

        if (
            isMakingTenantsDefaultEnabled &&
            !isSubOrg &&
            organizationType !== OrganizationType.SUBORGANIZATION &&
            tenantAssociations
        ) {
            if (isFeatureEnabled(tenantsFeatureConfig, TenantConstants.FEATURE_DICTIONARY.ADD_TENANTS_FROM_DROPDOWN)) {
                if (tenantAssociations.currentTenant?.domain === tenantAssociations.defaultTenant?.domain) {
                    options.push(
                        <Dropdown.Item className="action-panel" data-testid={ "default-button" } disabled={ true }>
                            <BuildingCircleCheckIcon fill="black" />
                            { t("extensions:manage.features.tenant.header.makeDefaultOrganization") }
                        </Dropdown.Item>
                    );
                } else {
                    options.push(
                        <Dropdown.Item
                            className="action-panel"
                            onClick={ () => setDefaultTenantInDropdown(tenantAssociations.currentTenant) }
                            data-testid={ "default-button" }
                            disabled={ isSetDefaultTenantInProgress }
                        >
                            <BuildingCircleCheckIcon fill="black" />
                            { t("extensions:manage.features.tenant.header.makeDefaultOrganization") }
                        </Dropdown.Item>
                    );
                }
            }
        }

        if (
            !isSubOrg &&
            tenantAssociations &&
            tenantAssociations.associatedTenants &&
            Array.isArray(tenantAssociations.associatedTenants) &&
            tenantAssociations.associatedTenants.length > 0
        ) {
            options.push(
                <Dropdown.Item
                    className="action-panel"
                    onClick={ () => setIsSwitchTenantsSelected(true) }
                    data-testid={ "tenant-switch-menu" }
                >
                    <ArrowLeftArrowRightIcon fill="black" />
                    { t("extensions:manage.features.tenant.header.tenantSwitchHeader") }
                </Dropdown.Item>
            );
        }

        if (isAddingTenantsFromDropdownEnabled && !isSubOrg && tenantDropdownLinks && tenantDropdownLinks.length > 0) {
            tenantDropdownLinks.forEach((link: TenantDropdownLinkInterface, index: number) => {
                const { content, icon, name, onClick } = link;

                options.push(
                    <Dropdown.Item
                        key={ index }
                        className="action-panel"
                        onClick={ onClick }
                        // Temporarily hiding dropdown item until
                        // modal is implemented.
                        // style={{display:'none'}}
                        data-testid={ `tenant-dropdown-link-${name.replace(" ", "-")}` }
                    >
                        { icon }
                        { name }
                        { content }
                    </Dropdown.Item>
                );
            });
        }

        if (isManagingTenantsFromDropdownEnabled && isSuperOrganization()) {
            options.push(
                <Dropdown.Item
                    className="action-panel"
                    onClick={ (): void => {
                        history.push(AppConstants.getPaths().get("TENANTS"));
                    } }
                    data-compnentid="manage-root-organizations"
                >
                    <BuildingPenIcon />
                    { t("tenants:tenantDropdown.options.manage.label") }
                </Dropdown.Item>
            );
        }

        if (isOrganizationsQuickNavFromDropdownEnabled && !isSubOrg && hasOrganizationReadPermissions) {
            options.push(<Divider />);
            options.push(
                <Dropdown.Item
                    className="action-panel"
                    onClick={ handleOrganizationsPageRoute }
                    data-componentid={ "sub-organizations-menu" }
                >
                    <HierarchyIcon fill="black" />
                    Organizations
                </Dropdown.Item>
            );
        }

        return options;
    };

    /**
     * Display the current tenant.
     */
    const displayCurrentTenant = (): string | ReactElement => {

        if (organizationType === OrganizationType.SUPER_ORGANIZATION && !isOrgHandleFeatureEnabled) {
            return organizationName;
        }

        if (tenantAssociations) {
            const { currentTenant } = tenantAssociations;
            const deploymentUnitName: string = isCentralDeploymentEnabled && isRegionSelectionEnabled
                ? ` (${currentTenant?.deploymentUnitName})`
                : "";

            return organizationHandle ? organizationHandle : currentTenant?.domain + deploymentUnitName;
        }

        return (
            <Placeholder>
                <Placeholder.Line />
            </Placeholder>
        );
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
                    organizationConfigs.showOrganizationDropdown ?
                        !isSwitchTenantsSelected ? (
                            <Dropdown.Menu className="tenant-dropdown-menu" onClick={ handleDropdownClick }>
                                <Item.Group className="current-tenant" unstackable>
                                    <Item
                                        className={
                                            isSubOrg ||
                                            !organizationConfigs.showOrganizationDropdown ||
                                            renderDropdownOptions()?.length <= 0
                                                ? "header sub-org-header"
                                                : "header"
                                        }
                                        key={ "current-tenant" }
                                    >
                                        <BuildingAltIcon size={ 30 } />
                                        <Item.Content verticalAlign="middle">
                                            <Item.Description>
                                                <div
                                                    className="name ellipsis"
                                                    data-testid={
                                                        "tenant-dropdown-display-name"
                                                    }
                                                >
                                                    {
                                                        isOrgHandleFeatureEnabled ?
                                                            organizationName :
                                                            displayCurrentTenant()
                                                    }
                                                    { isSuperOrganization() && (
                                                        <Chip
                                                            className="primary-tenant-chip"
                                                            label="Primary"
                                                            color="info"
                                                        />
                                                    ) }
                                                </div>
                                                { isOrgHandleFeatureEnabled ? (
                                                    <Grid className="middle aligned content">
                                                        <Grid.Row>
                                                            <div
                                                                className="org-handle ellipsis"
                                                                data-componentId={
                                                                    "tenant-dropdown-organization-handle"
                                                                }
                                                            >
                                                                { displayCurrentTenant() }
                                                            </div>
                                                            <div>
                                                                <Button
                                                                    basic
                                                                    inline
                                                                    data-componentid="org-handle-copy-icon"
                                                                    data-inverted
                                                                    data-tooltip={ isCopying
                                                                        ? t("extensions:manage.features.tenant." +
                                                                            "header.copied")
                                                                        : t("extensions:manage.features.tenant." +
                                                                            "header.copyOrganizationHandle")
                                                                    }
                                                                    icon={ (
                                                                        <Icon
                                                                            name="copy outline"
                                                                            color="grey"
                                                                        />
                                                                    ) }
                                                                    className="org-handle-copy-btn"
                                                                    onClick={ () => copyOrganizationHandle() }
                                                                />
                                                            </div>
                                                        </Grid.Row>
                                                    </Grid>
                                                ) : (
                                                    <Grid className="middle aligned content">
                                                        <Grid.Row>
                                                            <div
                                                                className="org-id ellipsis"
                                                                data-componentId="tenant-dropdown-organization-id"
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
                                                                        ? t("extensions:manage.features.tenant.header."
                                                                            + "copied")
                                                                        : t("extensions:manage.features.tenant.header."
                                                                            + "copyOrganizationId")
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
                                                ) }
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                                { organizationConfigs.showOrganizationDropdown &&  renderDropdownOptions() }
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
                        : null
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
                            deploymentUnits={ deploymentUnits }
                            onCloseHandler={ () => setShowTenantAddModal(false) } />
                    )
                    : null
            }
            { !isPrivilegedUser && tenantDropdownMenu }
        </>
    );
};

export default TenantDropdown;
