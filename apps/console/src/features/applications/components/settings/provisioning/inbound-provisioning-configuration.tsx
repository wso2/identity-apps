/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AccordionTitleProps, Divider, Grid } from "semantic-ui-react";
import { AppState, AuthenticatorAccordion, FeatureConfigInterface } from "../../../../core";
import { getUserStoreList } from "../../../../userstores/api";
import { updateApplicationConfigurations } from "../../../api";
import { ProvisioningConfigurationInterface, SimpleUserStoreListItemInterface } from "../../../models";
import { ProvisioningConfigurationsForm } from "../../forms";

/**
 *  Inbound Provisioning Configurations for the Application.
 */
interface InboundProvisioningConfigurationsPropsInterface extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface {

    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Current advanced configurations.
     */
    provisioningConfigurations: ProvisioningConfigurationInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Initial activeIndexes value.
     */
    defaultActiveIndexes?: number[];
}

/**
 * Inbound Provisioning configurations form component.
 *
 * @param {ProvisioningConfigurationFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const InboundProvisioningConfigurations: FunctionComponent<InboundProvisioningConfigurationsPropsInterface> = (
    props: InboundProvisioningConfigurationsPropsInterface
): ReactElement => {

    const {
        appId,
        provisioningConfigurations,
        onUpdate,
        featureConfig,
        defaultActiveIndexes,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ userStore, setUserStore ] = useState<SimpleUserStoreListItemInterface[]>([]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>(defaultActiveIndexes);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Handles the provisioning config form submit action.
     *
     * @param values - Form values.
     */
    const handleProvisioningConfigFormSubmit = (values: any): void => {
        setIsSubmitting(true);

        updateApplicationConfigurations(appId, values)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications" +
                        ".updateInboundProvisioningConfig.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.updateInboundProvisioningConfig" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications" +
                        ".updateInboundProvisioningConfig.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateInboundProvisioningConfig" +
                        ".genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Handles accordion title click.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {AccordionTitleProps} SegmentedAuthenticatedAccordion - Clicked title.
     */
    const handleAccordionOnClick = (e: MouseEvent<HTMLDivElement>,
        SegmentedAuthenticatedAccordion: AccordionTitleProps): void => {
        if (!SegmentedAuthenticatedAccordion) {
            return;
        }
        const newIndexes = [ ...accordionActiveIndexes ];

        if (newIndexes.includes(SegmentedAuthenticatedAccordion.accordionIndex)) {
            const removingIndex = newIndexes.indexOf(SegmentedAuthenticatedAccordion.accordionIndex);

            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(SegmentedAuthenticatedAccordion.accordionIndex);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    useEffect(() => {
        const userstore: SimpleUserStoreListItemInterface[] = [];

        userstore.push({
            id: "PRIMARY",
            name: "PRIMARY"
        });
        getUserStoreList().then((response) => {
            userstore.push(...response.data);
            setUserStore(userstore);
        }).catch(() => {
            setUserStore(userstore);
        });
    }, []);

    return (
        <>
            <Heading as="h4">
                { t("console:develop.features.applications.edit.sections.provisioning.inbound.heading") }
            </Heading>
            <Heading subHeading as="h6">
                { t("console:develop.features.applications.edit.sections.provisioning.inbound.subHeading") }
            </Heading>
            <Divider hidden/>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <AuthenticatorAccordion
                            globalActions={ [] }
                            authenticators={
                                [
                                    {
                                        content: (
                                            <ProvisioningConfigurationsForm
                                                config={ provisioningConfigurations }
                                                onSubmit={ handleProvisioningConfigFormSubmit }
                                                useStoreList={ userStore }
                                                readOnly={
                                                    readOnly
                                                    || !hasRequiredScopes(featureConfig?.applications,
                                                        featureConfig?.applications?.scopes?.update,
                                                        allowedScopes)
                                                }
                                                data-testid={ `${ testId }-form` }
                                                isSubmitting={ isSubmitting }
                                            />
                                        ),
                                        id: "scim",
                                        title: "SCIM"
                                    }
                                ]
                            }
                            accordionActiveIndexes = { accordionActiveIndexes }
                            accordionIndex = { 0 }
                            handleAccordionOnClick = { handleAccordionOnClick }
                            data-testid={ `${ testId }-inbound-connector-accordion` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </>
    );
};

/**
 * Default props for the application inbound provisioning configurations component.
 */
InboundProvisioningConfigurations.defaultProps = {
    "data-testid": "application-inbound-provisioning-configurations",
    defaultActiveIndexes: [ -1 ]
};
