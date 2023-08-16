/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GridLayout, PageLayout, Section } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { ExtendedFeatureConfigInterface } from "../../extensions/configs/models";
import { AppConstants, AppState, history } from "../core";

/**
 * Parent role page props interface
 */
type ParentRolePagePropsInterface = IdentifiableComponentInterface;

/**
 * Parent role page react component
 */
const ParentRolePage = (props: ParentRolePagePropsInterface): ReactElement => {
    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const extendedFeatureConfig: ExtendedFeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features);
    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const navigateToApplicationRoles = () => history.push(AppConstants.getPaths().get("APPLICATION_ROLES_SUB"));

    const navigateToOrganizationRoles = () => history.push(AppConstants.getPaths().get("ORGANIZATION_ROLES"));

    return(
        <PageLayout
            pageTitle={ t("extensions:console.applicationRoles.roles.heading") }
            title={ t("extensions:console.applicationRoles.roles.heading") }
            description={ t("extensions:console.applicationRoles.roles.subHeading") }
            data-testid={ `${ componentId }-page-layout` }
        >
            <GridLayout
                showTopActionPanel={ false }
            >
                {
                    extendedFeatureConfig?.applicationRoles?.enabled && (
                        <>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 12 }>
                                    <Section
                                        data-componentid={ `${componentId}-application-roles` }
                                        description={ t("extensions:console.applicationRoles.subHeading") }
                                        icon={ null }
                                        header={ t("extensions:console.applicationRoles.heading") }
                                        onPrimaryActionClick={ navigateToApplicationRoles }
                                        primaryAction={ t("common:configure") }
                                    >
                                        <Divider hidden/>
                                    </Section>      
                                </Grid.Column>
                            </Grid.Row>
                            <Divider hidden/>
                        </>
                    )
                }
                {
                    isSubOrg && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 12 }>
                                <Section
                                    data-componentid={ `${componentId}-organization-roles` }
                                    description={ t("extensions:console.applicationRoles.roles.orgRoles.subHeading") }
                                    icon={ null }
                                    header={ t("extensions:console.applicationRoles.roles.orgRoles.heading") }
                                    onPrimaryActionClick={ navigateToOrganizationRoles }
                                    primaryAction={ t("common:configure") }
                                >
                                    <Divider hidden/>
                                </Section>      
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </GridLayout>
        </PageLayout>
    );
};

export default ParentRolePage;
