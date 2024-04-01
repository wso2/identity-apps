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

import { BasicUserInfo } from "@asgardeo/auth-react";
import { OrganizationType } from "@wso2is/common";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { SessionStorageUtils } from "@wso2is/core/utils";
import { Action, Location } from "history";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Breadcrumb, Dropdown, Icon } from "semantic-ui-react";
import OrganizationSwitchDropdown from "./organization-switch-dropdown";
import { organizationConfigs } from "../../../admin.extensions.v1";
import useSignIn from "../../../admin.authentication.v1/hooks/use-sign-in";
import useAuthorization from "../../../admin.authorization.v1/hooks/use-authorization";
import { AppConstants, AppState } from "../../../admin.core.v1";
import { history } from "../../../admin.core.v1/helpers/history";
import TenantDropdown from "../../../admin-tenants-v1/components/dropdown/tenant-dropdown";
import { useGetOrganizationBreadCrumb } from "../../api";
import { useGetCurrentOrganizationType } from "../../hooks/use-get-organization-type";
import useOrganizationSwitch from "../../hooks/use-organization-switch";
import {
    BreadcrumbItem,
    BreadcrumbList,
    GenericOrganization
} from "../../models";
import { OrganizationUtils } from "../../utils";

/**
 * Interface for component dropdown.
 */
type OrganizationSwitchDropdownInterface = IdentifiableComponentInterface;

export const OrganizationSwitchBreadcrumb: FunctionComponent<OrganizationSwitchDropdownInterface> = (
    props: OrganizationSwitchDropdownInterface
): ReactElement => {
    const { "data-componentid": componentId } = props;

    const { onSignIn } = useSignIn();

    const { switchOrganization } = useOrganizationSwitch();

    const { legacyAuthzRuntime }  = useAuthorization();

    const { organizationType } = useGetCurrentOrganizationType();

    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const tenantDomain: string = useSelector(
        (state: AppState) => state?.auth?.tenantDomain
    );
    const isFirstLevelOrg: boolean = useSelector(
        (state: AppState) => state?.organization?.isFirstLevelOrganization
    );
    const isSAASDeployment: boolean = useSelector((state: AppState) => state?.config?.ui?.isSAASDeployment);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const shouldSendRequest: boolean = useMemo(() => {
        if (legacyAuthzRuntime) {
            return (
                isFirstLevelOrg ||
                window[ "AppUtils" ].getConfig().organizationName ||
                tenantDomain === AppConstants.getSuperTenant()
            );
        }

        return (
            organizationType === OrganizationType.SUPER_ORGANIZATION ||
            organizationType === OrganizationType.FIRST_LEVEL_ORGANIZATION ||
            organizationType === OrganizationType.SUBORGANIZATION ||
            tenantDomain === AppConstants.getSuperTenant()
        );
    }, [ isFirstLevelOrg, organizationType, tenantDomain ]);

    const {
        data: breadcrumbListData,
        error,
        isLoading,
        isValidating,
        mutate: mutateOrganizationBreadCrumbFetchRequest
    } = useGetOrganizationBreadCrumb(
        shouldSendRequest
    );

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const isShowSwitcher: boolean = organizationConfigs?.showOrganizationDropdown || isSubOrg;

    const [ triggerBackButtonOrganizationSwitch, setTriggerBackButtonOrganizationSwitch ] = useState<boolean>(false);

    const previousPushedRouteKey: string = "previousPushedRoute";
    const currentPath: string = history.location.pathname;

    const breadcrumbList: BreadcrumbList = useMemo(() => {
        if (!breadcrumbListData || breadcrumbListData.length < 1) {
            return [];
        }

        return breadcrumbListData;
    }, [ breadcrumbListData ]);

    useEffect(() => {
        history.listen((location: Location, action: Action) => {
            const currentPathname: string = location.pathname;

            if (action !== "POP") {
                // Set the previous pushed route to the local storage.
                SessionStorageUtils.setItemToSessionStorage(previousPushedRouteKey, currentPathname);
            } else {
                setTriggerBackButtonOrganizationSwitch(true);
            }
        });
    }, []);

    /**
     * This useEffect will handle the organization switch when the user clicks on the back button.
     */
    useEffect(() => {
        if (!isValidating && !isLoading && triggerBackButtonOrganizationSwitch) {
            handleBackButtonOrganizationSwitch(currentPath, previousPushedRouteKey);
        }
    }, [ isValidating, isLoading, triggerBackButtonOrganizationSwitch ]);

    useEffect(() => {
        if (!error) {
            return;
        }

        dispatch(addAlert({
            description: t("console:common.header.organizationSwitch.breadcrumbError.description"),
            level: AlertLevels.ERROR,
            message: error?.message ?? t("console:common.header.organizationSwitch.breadcrumbError.message")
        }));

    }, [ error ]);

    const handleOrganizationSwitch = async (
        organization: GenericOrganization,
        redirectToStart: boolean = true
    ): Promise<void> => {
        if (legacyAuthzRuntime) {
            let newOrgPath: string = "";

            if (
                breadcrumbList && breadcrumbList.length > 0 &&
                OrganizationUtils.isSuperOrganization(breadcrumbList[ 0 ]) &&
                breadcrumbList[ 1 ]?.id === organization.id &&
                organizationConfigs.showSwitcherInTenants
            ) {
                newOrgPath =
                    "/t/" +
                    organization.name +
                    "/" +
                    window[ "AppUtils" ].getConfig().appBase;
            } else if (OrganizationUtils.isSuperOrganization(organization)) {
                newOrgPath = `/${ window[ "AppUtils" ].getConfig().appBase }`;
            } else {
                newOrgPath =
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

            return;
        }

        let response: BasicUserInfo = null;

        try {
            response = await switchOrganization(organization.id);
            await onSignIn(
                response,
                () => null,
                () => {
                    // If first level org, remove the `/o/` path from the location.
                    if (!response?.userOrg) {
                        window["AppUtils"].updateOrganizationName("");
                    }
                },
                () => null
            );

            mutateOrganizationBreadCrumbFetchRequest();
            if (redirectToStart) {
                history.push(AppConstants.getPaths().get("GETTING_STARTED"));
            }
        } catch(e) {
            // TODO: Handle error
        }
    };

    /**
     * This function will handle the organization switch when the user clicks on the back button.
     *
     * @param currentPath - Current path.
     * @param previousPushedRouteKey - Key of the previous pushed route.
     */
    const handleBackButtonOrganizationSwitch = async (
        currentPath: string,
        previousPushedRouteKey: string
    ): Promise<void> => {
        setTriggerBackButtonOrganizationSwitch(false);

        if (!breadcrumbList || breadcrumbList.length < 1) {
            return;
        }

        // Get the previous pushed route from the local storage.
        const previousPath: string = SessionStorageUtils
            .getItemFromSessionStorage(previousPushedRouteKey);

        let previousPathOrgId: string = null;
        let currentPathOrgId: string = null;

        if (previousPath?.includes("/o/")) {
            previousPathOrgId = previousPath?.split("/o/")[1]?.split("/")[0];
        }

        if (currentPath?.includes("/o/")) {
            currentPathOrgId = currentPath?.split("/o/")[1]?.split("/")[0];
        }

        // Check if previous route contains /o/ and current route does not contain /o/.
        if (previousPath?.includes("/o/") && !currentPath?.includes("/o/")) {
            // If so, switch to parent organization.
            handleOrganizationSwitch(breadcrumbList[0], false).then(() => {
                SessionStorageUtils.setItemToSessionStorage(previousPushedRouteKey, currentPath);
            });
        }

        // Check if previous route does not contain /o/ and current route contains /o/.
        if (!previousPath?.includes("/o/") && currentPath?.includes("/o/")) {
            // If so, switch to sub organization from parent organization.
            // Get the organization object from the breadcrumbList.
            const switchingOrg: GenericOrganization = {
                id: currentPathOrgId,
                name: currentPathOrgId
            };

            switchingOrg && handleOrganizationSwitch(switchingOrg, false).then(() => {
                SessionStorageUtils.setItemToSessionStorage(previousPushedRouteKey, currentPath);
            });
        }

        // Check if previous route contains /o/ and current route contains /o/.
        // But the organization id is different.
        if (previousPath?.includes("/o/") && currentPath?.includes("/o/")
            && previousPathOrgId !== currentPathOrgId) {
            // If so, switch between sub organizations.

            // Get the organization object from the breadcrumbList.
            const switchingOrg: GenericOrganization = {
                id: currentPathOrgId,
                name: currentPathOrgId
            };

            switchingOrg && handleOrganizationSwitch(switchingOrg, false).then(() => {
                SessionStorageUtils.setItemToSessionStorage(previousPushedRouteKey, currentPath);
            });
        }
    };

    const generateSuperBreadcrumbItem = (
        item?: BreadcrumbItem
    ): ReactElement => {
        return OrganizationUtils.isSuperOrganization(item) ? (
            <>
                <Breadcrumb.Section
                    onClick={
                        breadcrumbList.length !== 1
                            ? (event: SyntheticEvent<HTMLElement>) => {
                                event.stopPropagation();
                                handleOrganizationSwitch(item);
                            }
                            : null
                    }
                    className="organization-breadcrumb-item"
                >
                    <span className="ellipsis organization-name">
                        { item?.name }
                    </span>
                </Breadcrumb.Section>
            </>
        ) : (
            <Breadcrumb.Section
                active
            >
                <span
                    onClick={ () => handleOrganizationSwitch(item) }
                    data-componentid={ `${ componentId }-breadcrumb-item-super-organization` }
                    className="organization-breadcrumb-item ellipsis"
                >
                    { item.name }
                </span>
            </Breadcrumb.Section>
        );
    };

    const resolveBreadcrumbIcon = (index: number): ReactElement => {
        return index !== breadcrumbList.length - 1 ? (
            <Breadcrumb.Divider
                className="organization-breadcrumb-item-divider"
            />
        ) : (
            <>
                {
                    organizationConfigs?.showSwitcherInTenants ? (
                        breadcrumbList.length <= 4 && (
                            <Icon
                                key={ index }
                                name={ isDropDownOpen ? "angle up" : "angle down" }
                                className="separator-icon organization-breadcrumb-icon"
                            />
                        )
                    ) : null
                }
            </>
        );
    };

    const generateBreadcrumb = (): ReactElement => {
        if (!breadcrumbList || breadcrumbList.length < 1) {
            return;
        }

        if (breadcrumbList?.length <= 4) {
            return (
                <>
                    { breadcrumbList?.map(
                        (breadcrumb: BreadcrumbItem, index: number) => {
                            if (index === 0 && !isSAASDeployment) {
                                return (
                                    <>
                                        { generateSuperBreadcrumbItem(breadcrumb) }
                                        {
                                            breadcrumbList.length !== 1 && (
                                                <Breadcrumb.Divider
                                                    className="organization-breadcrumb-item-divider"
                                                />
                                            )
                                        }
                                    </>
                                );
                            }
                            if (index === 1 &&
                                organizationConfigs.showSwitcherInTenants &&
                                breadcrumbList?.length === 2
                            ) {
                                return (
                                    <>
                                        <Breadcrumb.Section
                                            key={ index }
                                            onClick={ (event: SyntheticEvent<HTMLElement>) => {
                                                if (index !== breadcrumbList.length - 1) {
                                                    event.stopPropagation();
                                                    handleOrganizationSwitch(breadcrumb);
                                                }
                                            } }
                                            className="organization-breadcrumb-item first"
                                            data-componentid={
                                                `${ componentId }-breadcrumb-item-${ breadcrumb.name }`
                                            }
                                            active
                                        >
                                            { breadcrumb.name }
                                        </Breadcrumb.Section>
                                        { resolveBreadcrumbIcon(index) }
                                    </>
                                );
                            }
                            if (index > 0) {
                                return (
                                    <>
                                        <Breadcrumb.Section
                                            key={ index }
                                            onClick={ (event: SyntheticEvent<HTMLElement>) => {
                                                if (index !== breadcrumbList.length - 1) {
                                                    event.stopPropagation();
                                                    handleOrganizationSwitch(breadcrumb);
                                                }
                                            } }
                                            className={
                                                index ===
                                                breadcrumbList.length - 1
                                                    ? "organization-breadcrumb-item un-clickable ellipsis"
                                                    : "organization-breadcrumb-item ellipsis"
                                            }
                                            data-componentid={
                                                `${ componentId }-breadcrumb-item-${ breadcrumb.name }`
                                            }
                                            active
                                        >
                                            { breadcrumb.name }
                                        </Breadcrumb.Section>
                                        { resolveBreadcrumbIcon (index) }
                                    </>
                                );
                            }
                        }
                    ) }
                </>
            );
        }

        return (
            <>
                { generateSuperBreadcrumbItem(breadcrumbList[ 1 ]) }
                <Breadcrumb.Divider className="organization-breadcrumb-item-divider" />
                <Breadcrumb.Section>
                    <Dropdown
                        item
                        text="..."
                        className="breadcrumb-dropdown breadcrumb"
                        data-componentid={ `${ componentId }-breadcrumb-ellipsis` }
                    >
                        <Dropdown.Menu open={ false }>
                            { (breadcrumbList && breadcrumbList?.length > 0) && breadcrumbList?.map(
                                (breadcrumb: BreadcrumbItem, index: number) => {
                                    if (
                                        index < 2 ||
                                        index > breadcrumbList.length - 2
                                    ) {
                                        return;
                                    }

                                    return (
                                        <Dropdown.Item
                                            key={ index }
                                            onClick={ () =>
                                                handleOrganizationSwitch(breadcrumb)
                                            }
                                            icon="angle right"
                                            text={ breadcrumb.name }
                                            className="breadcrumb-dropdown-item"
                                            data-componentid={ `${ componentId }-breadcrumb-menu-${ breadcrumb.name }` }
                                        />
                                    );
                                }
                            ) }
                        </Dropdown.Menu>
                    </Dropdown>
                </Breadcrumb.Section>
                <Breadcrumb.Divider className="organization-breadcrumb-item-divider" />
                <Breadcrumb.Section active>
                    <span
                        onClick={ () =>
                            handleOrganizationSwitch(
                                breadcrumbList[ breadcrumbList.length - 1 ]
                            )
                        }
                        data-componentid={ `${
                            componentId }-breadcrumb-item-${ breadcrumbList[ breadcrumbList.length - 1 ].name }` }
                        className="ellipsis"
                    >
                        { breadcrumbList[ breadcrumbList?.length - 1 ].name }
                    </span>
                </Breadcrumb.Section>
                <OrganizationSwitchDropdown
                    triggerName={
                        breadcrumbList[ breadcrumbList.length - 1 ].name
                    }
                    handleOrganizationSwitch={ handleOrganizationSwitch }
                    isBreadcrumbItem={ true }
                />
            </>
        );
    };

    const  triggerOrganizationDropdown = (): ReactElement => {
        return (
            <>
                {
                    !isLoading && (
                        <div className="organization-breadcrumb-wrapper">
                            <div
                                tabIndex={ 0 }
                                onBlur={ () => setIsDropDownOpen(false) }
                                className="organization-breadcrumb"
                                onClick={ () => setIsDropDownOpen(!isDropDownOpen) }
                            >
                                <p className="organization-breadcrumb-label">
                                    { t("organizations:switching.switchLabel") }
                                </p>
                                <Breadcrumb>
                                    { generateBreadcrumb() }
                                </Breadcrumb>
                            </div>
                        </div>
                    )
                }
            </>
        );
    };

    if (isShowSwitcher) {
        return (
            <TenantDropdown
                dropdownTrigger={ triggerOrganizationDropdown() }
                disable={
                    organizationConfigs.showSwitcherInTenants
                        ? breadcrumbList?.length > 4
                        : isShowSwitcher ?? false
                }
            />
        );
    }
};

OrganizationSwitchBreadcrumb.defaultProps = {
    "data-componentid": "organization-switch-breadcrumb"
};
