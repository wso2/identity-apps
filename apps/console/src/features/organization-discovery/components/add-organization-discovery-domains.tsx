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

import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import InputLabel from "@oxygen-ui/react/InputLabel";
import TextField from "@oxygen-ui/react/TextField";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    SBACInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    SelectFieldAdapter
} from "@wso2is/form";
import { EmphasizedSegment, Hint, PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState, FeatureConfigInterface } from "../../core";
import { AppConstants } from "../../core/constants/app-constants";
import { history } from "../../core/helpers/history";
import useGetOrganizations from "../../organizations/api/use-get-organizations";
import { OrganizationInterface } from "../../organizations/models/organizations";
import addOrganizationEmailDomain from "../api/add-organization-email-domains";
import useGetOrganizationDiscovery from "../api/use-get-organization-discovery";
import { OrganizationDiscoveryInterface } from "../models/organization-discovery";
import "./add-organization-discovery-domains.scss";

/**
 * Props interface of {@link AddOrganizationDiscoveryDomains}
 */
export interface AddOrganizationDiscoveryDomainsPropsInterface
    extends SBACInterface<FeatureConfigInterface>,
        IdentifiableComponentInterface {
    /**
     * Is read only view
     */
    isReadOnly?: boolean;
    /**
     * Callback for when organization update
     */
    onEmailDomainAdd?: (organizationId: string) => void;
}

/**
 * Interface for the edit organization email domains form values.
 */
interface AddOrganizationDiscoveryDomainsFormValuesInterface {
    /**
     * Organization name.
     */
    organizationName: string;
}

const FORM_ID: string = "edit-organization-email-domains-form";

/**
 * This component renders the email domain add page for the organization.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
const AddOrganizationDiscoveryDomains: FunctionComponent<AddOrganizationDiscoveryDomainsPropsInterface> = (
    props: AddOrganizationDiscoveryDomainsPropsInterface
): ReactElement => {
    const { 
        isReadOnly,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const { data: organizations } = useGetOrganizations(true, null, null, null, null, true);

    const { data: discoverableOrganizations } = useGetOrganizationDiscovery(true, null, null, null);

    const [ emailDomains, setEmailDomains ] = useState<string[]>([]);
    const [ hasScopes, setHasScopes ] = useState(false);
    const [ isEmailDomainDataError, setIsEmailDomainDataError ] = useState<boolean>(false);
    const [ emailDomainDataError, setEmailDomainDataError ] = useState<string>("");

    /**
     * Set the hasScopes state based on the feature config.
     */
    useEffect(() => {
        setHasScopes(
            !hasRequiredScopes(
                featureConfig?.organizationDiscovery,
                featureConfig?.organizationDiscovery?.scopes?.update,
                allowedScopes));
    }, [ featureConfig ]);

    /**
     * Filter the already configured organizations from the list of organizations.
     */
    const filteredDiscoverableOrganizations: OrganizationInterface[] = useMemo(() => {
        return organizations?.organizations?.filter((organization: OrganizationInterface) => {
            return !discoverableOrganizations?.organizations?.some(
                (discoverableOrganization: OrganizationDiscoveryInterface) => {
                    return discoverableOrganization.organizationId === organization.id;
                }
            );
        });
    }, [ discoverableOrganizations, organizations ]);

    const optionsArray: string[] = [];

    /**
     * Function to handle the form submit action.
     *
     * @param values - Form values.
     */
    const handleSubmit = (values: AddOrganizationDiscoveryDomainsFormValuesInterface): void => {
        const organizationId: string = organizations?.organizations?.find((organization: OrganizationInterface) => {
            return organization.name === values.organizationName;
        }).id;

        addOrganizationEmailDomain(organizationId, emailDomains)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizationDiscovery.notifications." +
                                "addEmailDomains.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.organizationDiscovery.notifications." +
                                "addEmailDomains.success.message"
                        )
                    })
                );

                history.push({
                    pathname: AppConstants.getPaths()
                        .get("UPDATE_ORGANIZATION_DISCOVERY_DOMAINS")
                        .replace(":id", organizationId)
                });
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizationDiscovery.notifications" +
                                ".addEmailDomains.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizationDiscovery.notifications" +
                                ".addEmailDomains.error.message"
                        )
                    })
                );
            });
    };

    /**
     * Function to validate the input string is an email domain.
     *
     * @param values - Email domains.
     */
    const validateEmailDomain = (emailDomainList: string[]) => {

        const emailDomainValidation: boolean = FormValidation.domain(emailDomainList[emailDomainList.length-1]);

        if (!emailDomainValidation) {
            setIsEmailDomainDataError(true);
            setEmailDomainDataError( t(
                "console:manage.features.organizationDiscovery.assign.form." +
                "fields.emailDomains.validations.invalid.0"
            ) );
            emailDomainList.pop();
        }
    };

    return (
        <EmphasizedSegment padded="very">
            <FinalForm
                initialValues={ null }
                keepDirtyOnReinitialize={ true }
                onSubmit={ (values: AddOrganizationDiscoveryDomainsFormValuesInterface) => {
                    handleSubmit(values);
                } }
                render={ ({ handleSubmit, submitting }: FormRenderProps) => {
                    return (
                        <form id={ FORM_ID } onSubmit={ handleSubmit } className="add-organization-email-domain-form">
                            <FinalFormField
                                displayEmpty
                                fullWidth
                                FormControlProps={ {
                                    margin: "dense"
                                } }
                                ariaLabel="Organization name field"
                                required={ false }
                                data-componentid={ `${componentId}-form-organization-name-field` }
                                name="organizationName"
                                type="text"
                                label={ t(
                                    "console:manage.features.organizationDiscovery.assign.form." +
                                    "fields.organizationName.label"
                                ) }
                                placeholder={
                                    isEmpty(filteredDiscoverableOrganizations)
                                        ? t(
                                            "console:manage.features.organizationDiscovery.assign.form." +
                                            "fields.organizationName.emptyPlaceholder"
                                        ): t(
                                            "console:manage.features.organizationDiscovery.assign.form." +
                                            "fields.organizationName.placeholder"
                                        )
                                }
                                helperText={ (
                                    <Hint>
                                        { t(
                                            "console:manage.features.organizationDiscovery.assign.form." +
                                            "fields.organizationName.hint"
                                        ) }
                                    </Hint>
                                ) }
                                component={ SelectFieldAdapter }
                                options={
                                    filteredDiscoverableOrganizations?.map((organization: OrganizationInterface) => {
                                        return organization.name;
                                    })
                                }
                                renderValue={ (selected: string) => {
                                    if (!selected) {
                                        return (
                                            <em>
                                                {
                                                    t(
                                                        "console:manage.features.organizationDiscovery.assign.form." +
                                                        "fields.organizationName.placeholder"
                                                    )
                                                }
                                            </em>
                                        );
                                    }

                                    return selected;
                                } }
                            />
                            <Autocomplete
                                fullWidth
                                multiple
                                freeSolo
                                disableCloseOnSelect
                                size="small"
                                id="tags-filled"
                                options={ optionsArray.map((option: string) => option) }
                                renderTags={ (value: readonly string[], getTagProps: AutocompleteRenderGetTagProps) => {
                                    return value.map((option: string, index: number) => (
                                        <Chip
                                            key={ index }
                                            size="medium"
                                            label={ option }
                                            { ...getTagProps({ index }) }
                                        />
                                    ));
                                } }
                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                    <>
                                        <InputLabel htmlFor="tags-filled" disableAnimation shrink={ false }>
                                            { t(
                                                "console:manage.features.organizationDiscovery.assign.form." +
                                                "fields.emailDomains.label"
                                            ) }
                                        </InputLabel>
                                        <TextField
                                            id="tags-filled"
                                            InputLabelProps={ {
                                                required: true
                                            } }
                                            { ...params }
                                            margin="dense"
                                            error={ isEmailDomainDataError }
                                            helperText= { 
                                                isEmailDomainDataError
                                            && emailDomainDataError
                                            }
                                            placeholder={ t(
                                                "console:manage.features.organizationDiscovery.assign.form." +
                                                "fields.emailDomains.placeholder"
                                            ) }
                                        />
                                    </>
                                ) }
                                onChange={ (_: SyntheticEvent<Element, Event>, value: string[]) => {
                                    setEmailDomains(value);
                                    validateEmailDomain(value);
                                } }
                                onInputChange={ () => {
                                    setIsEmailDomainDataError(false);
                                } }
                            />
                            <FormHelperText>
                                <Hint>
                                    { t(
                                        "console:manage.features.organizationDiscovery.assign.form." +
                                        "fields.emailDomains.hint"
                                    ) }
                                </Hint>
                            </FormHelperText>
                            <FormSpy subscription={ { values: true } }>
                                { ({ values }: { values: AddOrganizationDiscoveryDomainsFormValuesInterface }) => (
                                    !isReadOnly && !hasScopes && (
                                        <PrimaryButton
                                            data-componentid={ `${componentId}-form-submit-button` }
                                            disabled={
                                                submitting || isEmpty(emailDomains) || isEmpty(values?.organizationName)
                                            }
                                            loading={ submitting }
                                            type="submit"
                                            style={ { marginTop: "20px" } }
                                        >
                                            { t("console:manage.features.organizationDiscovery.assign.buttons.assign") }
                                        </PrimaryButton>
                                    )
                                ) }
                            </FormSpy>
                        </form>
                    );
                } }
            />
        </EmphasizedSegment>
    );
};

/**
 * Props interface of {@link AddOrganizationDiscoveryDomains}
 */
AddOrganizationDiscoveryDomains.defaultProps = {
    "data-componentid": "add-organization-discovery-domains"
};

export default AddOrganizationDiscoveryDomains;
