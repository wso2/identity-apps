/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Code from "@oxygen-ui/react/Code";
import loadStaticResource from "@wso2is/admin.core.v1/utils/load-static-resource";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useRequiredFields, { RequiredFieldInterface } from "../../../../hooks/use-required-fields";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";

/**
 * Props interface of {@link QrCodeAdapter}
 */
type QrCodeAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Icon shown in place of the QR code, which only exists at runtime.
 */
const QR_CODE_PREVIEW_ICON: string = "assets/images/icons/qr-code.svg";

/**
 * Largest preview on the canvas, in pixels.
 */
const MAX_PREVIEW_SIZE: number = 160;

/**
 * Size of the QR code when none is set, in pixels. Same as the accounts page default.
 */
const DEFAULT_SIZE: number = 220;

const PreviewContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    padding: theme.spacing(1)
}));

/**
 * Canvas preview of a QR code element.
 *
 * @param props - Props injected to the component.
 * @returns The QrCodeAdapter component.
 */
const QrCodeAdapter: FunctionComponent<QrCodeAdapterPropsInterface> = ({
    "data-componentid": componentId = "qr-code-adapter",
    resource
}: QrCodeAdapterPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const generalMessage: ReactElement = useMemo(() => {
        return (
            <Trans
                i18nKey="flows:core.validation.fields.qrCode.general"
                values={ { id: resource.id } }
            >
                Required fields are not properly configured for the QR code with ID{ " " }
                <Code>{ resource.id }</Code>.
            </Trans>
        );
    }, [ resource?.id ]);

    const fields: RequiredFieldInterface[] = useMemo(() => {
        return [
            {
                errorMessage: t("flows:core.validation.fields.qrCode.data"),
                name: "data"
            }
        ];
    }, []);

    useRequiredFields(
        resource,
        generalMessage,
        fields
    );

    const previewSize: number = useMemo(() => {
        const size: number = Number(resource?.config?.size);

        return Math.min(Number.isFinite(size) && size > 0 ? size : DEFAULT_SIZE, MAX_PREVIEW_SIZE);
    }, [ resource?.config?.size ]);

    return (
        <PreviewContainer data-componentid={ componentId }>
            <img
                src={ loadStaticResource(QR_CODE_PREVIEW_ICON) }
                alt={ t("flows:core.elements.qrCode.alt") }
                width={ previewSize }
                height={ previewSize }
            />
            { resource?.config?.data && (
                <Code data-componentid={ `${ componentId }-data` }>{ resource.config.data }</Code>
            ) }
        </PreviewContainer>
    );
};

export default QrCodeAdapter;
