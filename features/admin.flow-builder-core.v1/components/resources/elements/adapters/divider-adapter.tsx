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

import Code from "@oxygen-ui/react/Code";
import Divider, { DividerProps } from "@oxygen-ui/react/Divider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useRequiredFields, { RequiredFieldInterface } from "../../../../hooks/use-required-fields";
import { DividerVariants } from "../../../../models/elements";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";

/**
 * Props interface of {@link DividerAdapter}
 */
export type DividerAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Divider component.
 *
 * @param props - Props injected to the component.
 * @returns The DividerAdapter component.
 */
const DividerAdapter: FunctionComponent<DividerAdapterPropsInterface> = ({
    resource
}: DividerAdapterPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const generalMessage: ReactElement = useMemo(() => {
        return (
            <Trans
                i18nKey="flows:core.validation.fields.divider.general"
                values={ { id: resource.id } }
            >
                Required fields are not properly configured for the divider with ID{ " " }
                <Code>{ resource.id }</Code>.
            </Trans>
        );
    }, [ resource?.id ]);

    const fields: RequiredFieldInterface[] = useMemo(() => {
        return [
            {
                errorMessage: t("flows:core.validation.fields.divider.variant"),
                name: "variant"
            }
        ];
    }, []);

    useRequiredFields(
        resource,
        generalMessage,
        fields
    );

    let config: DividerProps = {};

    if (resource?.variant === DividerVariants.Horizontal || resource?.variant === DividerVariants.Vertical) {
        config = {
            ...config,
            orientation: resource?.variant?.toLowerCase()
        };
    } else {
        config = {
            ...config,
            variant: resource?.variant?.toLowerCase()
        };
    }

    return <Divider { ...config }>{ resource?.config?.text }</Divider>;
};

export default DividerAdapter;
