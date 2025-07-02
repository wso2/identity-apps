/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import React, { Dispatch, FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { CommonConstants } from "../../../constants/common-constants";
import { setActiveForm } from "../../../store/actions";

interface EmptyValueFieldPropsInterface extends IdentifiableComponentInterface {
    schema: ProfileSchemaInterface;
    fieldLabel: string;
    placeholderText?: string;
}

const EmptyValueField: FunctionComponent<EmptyValueFieldPropsInterface> = (
    {
        schema,
        fieldLabel,
        placeholderText
    }: EmptyValueFieldPropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();

    const onEdit = () => {
        dispatch(setActiveForm(CommonConstants.PERSONAL_INFO + schema.name));
    };

    return (
        <a
            className="placeholder-text"
            tabIndex={ 0 }
            onKeyPress={ (e: React.KeyboardEvent<HTMLAnchorElement>) => {
                if (e.key === "Enter") {
                    onEdit();
                }
            } }
            onClick={ onEdit }
            data-testid={
                `profile-schema-mobile-editing-section-${schema.name.replace(".", "-")}-placeholder` }
        >
            { placeholderText || t("myAccount:components.profile.forms.generic.inputs.placeholder", {
                fieldName: fieldLabel.toLowerCase()
            }) }
        </a>
    );
};

export default EmptyValueField;
