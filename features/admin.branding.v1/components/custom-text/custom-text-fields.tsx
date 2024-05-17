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

import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Link from "@oxygen-ui/react/Link";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, FormSpy, FormState, TextFieldAdapter } from "@wso2is/form";
import { GenericIcon, Hint } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import orderBy from "lodash-es/orderBy";
import React, { FunctionComponent, ReactElement, SVGAttributes, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppConstants } from "@wso2is/admin.core.v1/constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { serverConfigurationConfig } from "@wso2is/admin.extensions.v1/configs/server-configuration";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import { ReactComponent as WarningIcon } from "../../../themes/default/assets/images/icons/warning-icon.svg";
import { CustomTextPreferenceConstants } from "../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../hooks/use-branding-preference";
import { CustomTextInterface } from "../../models/custom-text-preference";
import replaceObjectKeySymbols from "../../utils/replace-object-key-symbols";
import "./custom-text-fields.scss";

/**
 * Prop types for the text customization fields component.
 */
export interface CustomTextFieldsProps extends IdentifiableComponentInterface {
    onSubmit: (values: any) => void;
    fields: Record<string, string>;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
}

const ArrowRotateLeft = ({ ...rest }: SVGAttributes<SVGSVGElement>): ReactElement => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        { ...rest }
    >
        <path
            fill="none"
            stroke="#000"
            strokeWidth="2"
            d="M8,3 L3,8 L8,13 M12,20 L15,20 C18.3137085,20 21,17.3137085 21,14 C21,10.6862915 18.3137085,8 15,8 L4,8"
        ></path>
    </svg>
);

/**
 * Text customization fields component.
 *
 * @param props - Props injected to the component.
 * @returns Text customization fields component.
 */
const CustomTextFields: FunctionComponent<CustomTextFieldsProps> = (props: CustomTextFieldsProps): ReactElement => {
    const {
        fields,
        onSubmit,
        readOnly,
        "data-componentid": componentId
    } = props;

    const { t, i18n } = useTranslation();

    const {
        customTextDefaults,
        customTextScreenMeta,
        isCustomTextPreferenceFetching,
        updateCustomTextFormSubscription,
        selectedScreen,
        selectedLocale,
        resetCustomTextField
    } = useBrandingPreference();

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    const transformedFields: CustomTextInterface = useMemo(
        () => replaceObjectKeySymbols(fields, ".", "_") as CustomTextInterface,
        [ fields ]
    );

    if (!fields || isCustomTextPreferenceFetching) {
        return (
            <Box className="branding-preference-custom-text-fields">
                { [ ...Array(2) ].map((key: number) => (
                    <div key={ key } className="skeletons">
                        <Skeleton variant="rectangular" height={ 7 } width="30%" />
                        <Skeleton variant="rectangular" height={ 28 } />
                        <Skeleton variant="rectangular" height={ 7 } width="90%" />
                        <Skeleton variant="rectangular" height={ 7 } />
                    </div>
                )) }
            </Box>
        );
    }

    const getFieldLabel = (label: string): string => {
        return label.replaceAll("_", ".").toLowerCase();
    };

    const renderInputAdornment = (fieldName: string): ReactElement => {
        const customTextDefaultsIsSameAsFields: boolean = customTextDefaults
            ? customTextDefaults[fieldName.replaceAll("_", ".")] === fields[fieldName.replaceAll("_", ".")]
            : false;

        if (customTextDefaultsIsSameAsFields) {
            return null;
        }

        return (
            <InputAdornment position="end">
                <Tooltip
                    title={
                        t("branding:brandingCustomText.form.genericFieldResetTooltip")
                    }
                >
                    <IconButton
                        aria-label="Reset field to default"
                        className="reset-field-to-default-adornment"
                        onClick={ () =>
                            resetCustomTextField(
                                fieldName.replaceAll("_", "."),
                                selectedScreen,
                                selectedLocale
                            )
                        }
                        edge="end"
                    >
                        <ArrowRotateLeft height={ 12 } width={ 12 } />
                    </IconButton>
                </Tooltip>
            </InputAdornment>
        );
    };

    const handleMultiAttributeLink = (): void => {

        const multiAttributeLoginConnectorHidden: boolean = serverConfigurationConfig.connectorsToHide
            .includes(ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID);

        const alternativeLoginIdentifierHidden: boolean = serverConfigurationConfig.connectorsToHide
            .includes(ServerConfigurationsConstants.ALTERNATIVE_LOGIN_IDENTIFIER);

        if (!multiAttributeLoginConnectorHidden) {
            history.push(
                AppConstants.getPaths().get(
                    "GOVERNANCE_CONNECTOR_EDIT"
                ).replace(
                    ":categoryId",
                    ServerConfigurationsConstants.
                        ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID
                ).replace(
                    ":connectorId",
                    ServerConfigurationsConstants.
                        MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID
                )
            );
        } else if (!alternativeLoginIdentifierHidden) {
            history.push(AppConstants.getPaths().get("ALTERNATIVE_LOGIN_IDENTIFIER_EDIT"));
        }
    };

    const getMultiAttributeLabel = (): string => {

        const multiAttributeLoginConnectorHidden: boolean = serverConfigurationConfig.connectorsToHide
            .includes(ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID);

        const alternativeLoginIdentifierHidden: boolean = serverConfigurationConfig.connectorsToHide
            .includes(ServerConfigurationsConstants.ALTERNATIVE_LOGIN_IDENTIFIER);

        if (!multiAttributeLoginConnectorHidden) {
            return t("branding:connectors.multiAttributeLogin");
        } else if (!alternativeLoginIdentifierHidden) {
            return t("branding:connectors.alternativeLoginIdentifier");
        }
    };

    const isMultiAttributeEnabled = (): boolean => {

        return !serverConfigurationConfig.connectorsToHide
            .includes(
                ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID
            ) || !serverConfigurationConfig.connectorsToHide
            .includes(
                ServerConfigurationsConstants.ALTERNATIVE_LOGIN_IDENTIFIER
            );
    };

    const getHelperText = (hintKey: string, warningKey: string, fieldName: string): ReactElement => {

        return i18n.exists(hintKey) || i18n.exists(warningKey)
            ? (
                <Hint>
                    { i18n.exists(hintKey) && <p>{ t(hintKey, { productName }) }</p> }
                    { i18n.exists(warningKey) && (
                        <p>
                            <GenericIcon
                                icon={ WarningIcon }
                                key="warningIcon"
                                defaultIcon
                                colored
                                inline
                                verticalAlign="middle"
                            />&nbsp;
                            {
                                isMultiAttributeEnabled() === true
                                    && (fieldName.replaceAll("_", ".") === CustomTextPreferenceConstants
                                        .TEXT_BUNDLE_KEYS.LOGIN.IDENTIFIER.INPUT.LABEL
                                        || fieldName.replaceAll("_", ".") === CustomTextPreferenceConstants
                                            .TEXT_BUNDLE_KEYS.PASSWORD_RECOVERY.IDENTIFIER.INPUT.PLACEHOLDER)
                                    ? (
                                        <Trans
                                            i18nKey={ warningKey }
                                            values={ {
                                                feature: getMultiAttributeLabel(),
                                                productName: productName
                                            } }
                                            components={ [
                                                <strong key="importantText">IMPORTANT</strong>,
                                                <Link
                                                    key="configureLink"
                                                    onClick={ handleMultiAttributeLink }
                                                >
                                                    configured
                                                </Link>
                                            ] }
                                        >
                                        </Trans>
                                    ) : t(warningKey)
                            }
                        </p>
                    ) }
                </Hint>
            ) : null;
    };

    return (
        <div className="branding-preference-custom-text-fields">
            <FinalForm
                initialValues={ transformedFields }
                keepDirtyOnReinitialize={ true }
                onSubmit={ (values: Record<string, unknown>) => {
                    onSubmit(replaceObjectKeySymbols(values, "_", "."));
                } }
                render={ ({ handleSubmit }: FormRenderProps) => {
                    return (
                        <form id={ CustomTextPreferenceConstants.FORM_ID } onSubmit={ handleSubmit }>
                            <FormSpy
                                subscription={ { dirty: true, values: true } }
                                onChange={ ({
                                    ...subscription
                                }: FormState<CustomTextInterface, CustomTextInterface>) => {
                                    const values: CustomTextInterface = replaceObjectKeySymbols(
                                        cloneDeep(subscription.values),
                                        "_",
                                        "."
                                    ) as CustomTextInterface;

                                    updateCustomTextFormSubscription({
                                        ...subscription,
                                        values
                                    });
                                } }
                            />
                            { /* FormSpy subscriptions drop the property entirely when the text field is cleared. */ }
                            { /* We are manually adding the missing properties in the provider. */ }
                            { /* So `orderBy` is needed to stop the UI from glitching during rerenders.*/ }
                            { transformedFields &&
                                orderBy(Object.keys(transformedFields), [], [ "asc" ]).map((fieldName: string) => {
                                    const hintKey: string = `branding:brandingCustomText.form.fields.${
                                        fieldName.replaceAll("_", ".")
                                    }.hint`;

                                    const warningKey: string = `branding:brandingCustomText.form.fields.${
                                        fieldName.replaceAll("_", ".")
                                    }.warning`;

                                    return (
                                        <FinalFormField
                                            key={ fieldName }
                                            fullWidth
                                            FormControlProps={ {
                                                margin: "dense"
                                            } }
                                            ariaLabel={ fieldName }
                                            required={ false }
                                            data-componentid={ `${componentId}-${fieldName}` }
                                            name={ fieldName }
                                            type="text"
                                            label={ getFieldLabel(fieldName) }
                                            placeholder={
                                                t("branding:brandingCustomText.form.genericFieldPlaceholder")
                                            }
                                            helperText={ getHelperText(hintKey, warningKey, fieldName) }
                                            component={ TextFieldAdapter }
                                            multiline={ customTextScreenMeta &&
                                                customTextScreenMeta[fieldName.replaceAll("_", ".")]?.MULTI_LINE }
                                            size="small"
                                            maxLength={
                                                CustomTextPreferenceConstants.FORM_FIELD_CONSTRAINTS.MAX_LENGTH
                                            }
                                            minLength={
                                                CustomTextPreferenceConstants.FORM_FIELD_CONSTRAINTS.MIN_LENGTH
                                            }
                                            InputProps={ {
                                                endAdornment: renderInputAdornment(fieldName)
                                            } }
                                            readOnly={ readOnly }
                                        />
                                    );
                                }) }
                        </form>
                    );
                } }
            />
        </div>
    );
};

/**
 * Default props for the component.
 */
CustomTextFields.defaultProps = {
    "data-componentid": "custom-text-fields"
};

export default CustomTextFields;
