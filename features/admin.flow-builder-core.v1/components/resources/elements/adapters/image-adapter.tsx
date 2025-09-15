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

import Box from "@oxygen-ui/react/Box";
import Code from "@oxygen-ui/react/Code";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useRequiredFields, { RequiredFieldInterface } from "../../../../hooks/use-required-fields";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";

/**
 * Props interface of {@link ImageAdapter}
 */
export type ImageAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for displaying images.
 *
 * @param props - Props injected to the component.
 * @returns The ImageAdapter component.
 */
const ImageAdapter: FunctionComponent<ImageAdapterPropsInterface> = ({
    resource
}: ImageAdapterPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const generalMessage: ReactElement = useMemo(() => {
        return (
            <Trans
                i18nKey="flows:core.validation.fields.image.general"
                values={ { id: resource.id } }
            >
                Required fields are not properly configured for the image with ID{ " " }
                <Code>{ resource.id }</Code>.
            </Trans>
        );
    }, [ resource?.id ]);

    const fields: RequiredFieldInterface[] = useMemo(() => {
        return [
            {
                errorMessage: t("flows:core.validation.fields.image.src"),
                name: "src"
            },
            {
                errorMessage: t("flows:core.validation.fields.image.variant"),
                name: "variant"
            }
        ];
    }, []);

    useRequiredFields(
        resource,
        generalMessage,
        fields
    );

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <img
                src={ resource?.config?.src }
                alt={ resource?.config?.alt }
                width="100%"
                style={ resource?.config?.styles }
            />
        </Box>
    );
};

export default ImageAdapter;
