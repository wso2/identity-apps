/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
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

import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { DynamicField, EmphasizedSegment, KeyValue, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../core";
import { updateOrganization } from "../../api";
import { OrganizationResponseInterface, UpdateOrganizationInterface } from "../../models";

interface OrganizationAttributesPropsInterface extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface {
    /**
     * Organization Data
     */
    organization: OrganizationResponseInterface;

    /**
     * Is Read Only access
     */
    isReadOnly: boolean;

    /**
     * On Attribute Update callback
     */
    onAttributeUpdate: (orgId: string) => void
}

export const OrganizationAttributes: FunctionComponent<OrganizationAttributesPropsInterface> = (
    props: OrganizationAttributesPropsInterface
): ReactElement => {

    const {
        organization,
        isReadOnly,
        onAttributeUpdate,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ submit, setSubmit ] = useTrigger();
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    
    const updateOrgAttributes = useCallback((data: KeyValue[]) => {
        setIsSubmitting(true);
        const updatedOrganization = {
            attributes: [
                ...data
            ],
            description: organization.description,
            name: organization.name,
            status: organization.status,
        } as UpdateOrganizationInterface;
        
        updateOrganization(organization.id, updatedOrganization)
            .then((_response) => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.updateOrganizationAttributes." +
                            "success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.organizations.notifications.updateOrganizationAttributes." +
                            "success.message"
                        )
                    })
                );

                onAttributeUpdate(organization.id);
            }).catch((error) => {
                if (error?.description) {
                    dispatch(
                        addAlert({
                            description: error.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications.updateOrganizationAttributes." +
                            "error.message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.updateOrganizationAttributes." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizations.notifications.updateOrganizationAttributes." +
                            "genericError.message"
                        )
                    })
                );
            })
            .finally(() => setIsSubmitting(false));
    }, []);

    return (
        <EmphasizedSegment>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                        <p>{ t("console:manage.features.organizations.edit.attributes.hint") }</p>
                        <DynamicField
                            data={ organization.attributes }
                            keyType="text"
                            keyName={ t("console:manage.features.organizations.edit.attributes.key") }
                            valueName={ t("console:manage.features.organizations.edit.attributes.value") }
                            submit={ submit }
                            keyRequiredMessage={ t(
                                "console:manage.features.organizations.edit.attributes." +
                                "keyRequiredErrorMessage"
                            ) }
                            valueRequiredErrorMessage={ t(
                                "console:manage.features.organizations.edit.attributes." +
                                "valueRequiredErrorMessage"
                            ) }
                            requiredField={ true }
                            update={ updateOrgAttributes }
                            data-testid={ `${testId}-form-dynamic-field` }
                            readOnly={ isReadOnly }
                        />
                    </Grid.Column>
                </Grid.Row>
                { !isReadOnly && (<Grid.Row columns={ 1 }>
                    <Grid.Column width={ 6 }>
                        <PrimaryButton
                            onClick={ () => {
                                setSubmit();
                            } }
                            data-testid={ `${testId}-submit-button` }
                            loading={ isSubmitting }
                            disabled={ isSubmitting }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>) }
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
OrganizationAttributes.defaultProps = {
    "data-testid": "organization-attributes"
};
