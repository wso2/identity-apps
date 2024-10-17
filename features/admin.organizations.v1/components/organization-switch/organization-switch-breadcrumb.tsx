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
import useSignIn from "@wso2is/admin.authentication.v1/hooks/use-sign-in";
import { AppConstants, AppState, OrganizationType } from "@wso2is/admin.core.v1";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { organizationConfigs } from "@wso2is/admin.extensions.v1";
import TenantDropdown from "@wso2is/admin.tenants.v1/components/dropdown/tenant-dropdown";
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
import { useGetOrganizationBreadCrumb } from "../../api";
import { useGetCurrentOrganizationType } from "../../hooks/use-get-organization-type";
import useOrganizationSwitch from "../../hooks/use-organization-switch";
import {
    BreadcrumbItem,
    BreadcrumbList,
    GenericOrganization
} from "../../models";
import { OrganizationUtils } from "../../utils";
import "./organization-switch-breadcrumb.scss";

const CloneIcon = ({size}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 17 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.762 2.33562C12.6773 1.03154 11.5928 0 10.2673 0H3.26727L3.1029 0.00531768C1.79881 0.0899613 0.767273 1.17452 0.767273 2.5V9.5L0.772591 9.66438C0.857234 10.9685 1.94179 12 3.26727 12H4.76727V13.5L4.77259 13.6644C4.85723 14.9685 5.94179 16 7.26727 16H14.2673L14.4316 15.9947C15.7357 15.91 16.7673 14.8255 16.7673 13.5V5.5L16.762 5.33562C16.6773 4.03154 15.5928 3 14.2673 3H12.7673V2.5L12.762 2.33562ZM11.7673 3V2.5C11.7673 1.7203 11.1724 1.07955 10.4117 1.00687L10.2673 1H3.26727C2.48758 1 1.84682 1.59489 1.77414 2.35554L1.76727 2.5V9.5C1.76727 10.2797 2.36216 10.9204 3.12281 10.9931L3.26727 11H4.76727V10.5C4.76727 10.2239 4.99113 10 5.26727 10C5.51273 10 5.71688 10.1769 5.75922 10.4101L5.76727 10.5V13.5C5.76727 14.2797 6.36216 14.9204 7.12281 14.9931L7.26727 15H14.2673C15.047 15 15.6877 14.4051 15.7604 13.6445L15.7673 13.5V5.5C15.7673 4.7203 15.1724 4.07955 14.4117 4.00687L14.2673 4H10.2673C9.99113 4 9.76727 3.77614 9.76727 3.5C9.76727 3.25454 9.94415 3.05039 10.1774 3.00806L10.2673 3H11.7673ZM5.26727 3.5C5.54342 3.5 5.76727 3.72386 5.76727 4C5.76727 6.50123 7.60386 8.5735 10.002 8.94181L8.91372 7.85355C8.74015 7.67999 8.72087 7.41056 8.85586 7.21569L8.91372 7.14645C9.08729 6.97288 9.35671 6.9536 9.55158 7.08859L9.62083 7.14645L11.9744 9.5L9.62083 11.8536C9.42556 12.0488 9.10898 12.0488 8.91372 11.8536C8.74015 11.68 8.72087 11.4106 8.85586 11.2157L8.91372 11.1464L10.0972 9.96301C7.09889 9.62985 4.76727 7.08721 4.76727 4C4.76727 3.72386 4.99113 3.5 5.26727 3.5Z" fill="#40404B"/>
    </svg>
);

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

    const { organizationType } = useGetCurrentOrganizationType();

    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const tenantDomain: string = useSelector(
        (state: AppState) => state?.auth?.tenantDomain
    );

    const organizationId: string = useSelector((state: AppState) => state?.organization?.organization?.id);

    const isSAASDeployment: boolean = useSelector((state: AppState) => state?.config?.ui?.isSAASDeployment);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const shouldSendRequest: boolean = useMemo(() => {
        return (
            organizationType === OrganizationType.SUPER_ORGANIZATION ||
            organizationType === OrganizationType.FIRST_LEVEL_ORGANIZATION ||
            organizationType === OrganizationType.SUBORGANIZATION ||
            tenantDomain === AppConstants.getSuperTenant()
        );
    }, [ organizationType ]);

    const {
        data: breadcrumbListData,
        error,
        isLoading,
        isValidating,
        mutate: mutateOrganizationBreadCrumbFetchRequest
    } = useGetOrganizationBreadCrumb(
        shouldSendRequest
    );

    useEffect(() => {
        mutateOrganizationBreadCrumbFetchRequest();
    }, [ organizationId ]);

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
                                <Breadcrumb className="organization-breadcrumb-main">
                                    <CloneIcon size={ 14 } />
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
