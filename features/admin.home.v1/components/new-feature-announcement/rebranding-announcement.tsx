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

import { Theme, alpha, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Paper from "@oxygen-ui/react/Paper";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowUpRightFromSquareIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { ReactComponent as WSO2IdentityPlatformLogo } from "../../assets/images/wso2-identity-platform-full-colour.svg";

const STRIP_GRADIENT_START: string = "#EC5161";
const STRIP_GRADIENT_END: string = "#F87643";
const BANNER_BG_DARK_ONE: string = "#0b1a2c";
const BANNER_BG_DARK_TWO: string = "#122339";
const BANNER_BG_DARK_THREE: string = "#0f1c2f";
const BLOB_TINT_BLUE: string = "rgba(60, 90, 140, 0.55)";
const BLOB_TINT_BLUE_SECONDARY: string = "rgba(70, 100, 150, 0.35)";
const BLOB_TINT_LIGHT_BLUE: string = "rgba(190, 215, 255, 0.45)";

const BannerRoot: typeof Paper = styled(Paper)(({ theme }: { theme: Theme }) => ({
    alignItems: "flex-start",
    background: [
        `radial-gradient(circle at 110% 120%, ${ BLOB_TINT_BLUE } 0%, transparent 45%)`,
        `radial-gradient(circle at -10% -20%, ${ BLOB_TINT_BLUE_SECONDARY } 0%, transparent 40%)`,
        "linear-gradient(135deg, "
            + `${ BANNER_BG_DARK_ONE } 0%, ${ BANNER_BG_DARK_TWO } 55%, ${ BANNER_BG_DARK_THREE } 100%)`
    ].join(", "),
    border: `1px solid ${ alpha(theme.palette.common.white, 0.06) }`,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    justifyContent: "space-between",
    marginBottom: theme.spacing(3),
    overflow: "hidden",
    position: "relative",
    width: "100%"
}));

const Blob: typeof Box = styled(Box)({
    borderRadius: "50%",
    filter: "blur(40px)",
    opacity: 0.55,
    pointerEvents: "none",
    position: "absolute"
});

const BlobOne: typeof Box = styled(Blob)({
    background: `radial-gradient(circle, ${ alpha("#ffffff", 0.45) } 0%, ${ alpha("#ffffff", 0) } 70%)`,
    height: 240,
    left: -80,
    top: -100,
    width: 240
});

const BlobTwo: typeof Box = styled(Blob)(({ theme }: { theme: Theme }) => ({
    background: `radial-gradient(circle, ${ alpha("#ffffff", 0.35) } 0%, ${ alpha("#ffffff", 0) } 70%)`,
    bottom: -160,
    height: 320,
    right: 200,
    width: 320,
    [theme.breakpoints.down(968)]: {
        display: "none"
    }
}));

const BlobThree: typeof Box = styled(Blob)(({ theme }: { theme: Theme }) => ({
    background: `radial-gradient(circle, ${ BLOB_TINT_LIGHT_BLUE } 0%, ${ alpha("#bed7ff", 0) } 70%)`,
    height: 180,
    opacity: 0.35,
    right: 360,
    top: 30,
    width: 180,
    [theme.breakpoints.down(968)]: {
        display: "none"
    }
}));

const ContentArea: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    maxWidth: "75%",
    padding: theme.spacing(3),
    position: "relative",
    zIndex: 1,
    [theme.breakpoints.down(968)]: {
        maxWidth: "70%"
    },
    [theme.breakpoints.down(720)]: {
        maxWidth: "100%"
    }
}));

const BannerTitle: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.common.white,
    fontSize: 22,
    fontWeight: 700,
    marginBottom: theme.spacing(1)
}));

const BannerDescription: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: alpha(theme.palette.common.white, 0.78),
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: theme.spacing(1),
    maxWidth: 760
}));

const Actions: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    padding: `0 ${ theme.spacing(3) } ${ theme.spacing(3) } ${ theme.spacing(3) }`,
    position: "relative",
    zIndex: 1
}));

const CtaButton: typeof Button = styled(Button)(({ theme }: { theme: Theme }) => ({
    "& svg": {
        "& path": {
            fill: theme.palette.common.white
        },
        height: 16,
        width: 16
    },
    "&:hover": {
        background: "linear-gradient(88deg, #e84354 -3.25%, #f56a35 102.62%)",
        boxShadow: `0 6px 22px ${ alpha(STRIP_GRADIENT_END, 0.45) }`
    },
    background: `linear-gradient(88deg, ${ STRIP_GRADIENT_START } -3.25%, ${ STRIP_GRADIENT_END } 102.62%)`,
    borderRadius: 999,
    boxShadow: `0 6px 18px ${ alpha(STRIP_GRADIENT_END, 0.35) }`,
    color: theme.palette.common.white,
    fontWeight: 600,
    padding: `6px ${ theme.spacing(2) }`,
    textTransform: "none"
}));

const BrandArea: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(2),
    position: "absolute",
    right: theme.spacing(4),
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    [theme.breakpoints.down(720)]: {
        display: "none"
    }
}));

const BrandLogo: typeof WSO2IdentityPlatformLogo = styled(WSO2IdentityPlatformLogo)({
    height: 100
});

/**
 * Props interface of {@link RebrandingAnnouncement}
 */
interface RebrandingAnnouncementProps extends IdentifiableComponentInterface {
    title: string;
    description: string;
    buttonText: string;
    onAnnouncementClick: () => void;
}

const RebrandingAnnouncement: FunctionComponent<RebrandingAnnouncementProps> = ({
    "data-componentid": componentId = "rebranding-announcement",
    title,
    description,
    buttonText,
    onAnnouncementClick
}: RebrandingAnnouncementProps): ReactElement => {
    return (
        <BannerRoot data-componentid={ componentId } elevation={ 0 }>
            <BlobOne />
            <BlobTwo />
            <BlobThree />

            <ContentArea>
                <BannerTitle variant="h3">{ title }</BannerTitle>
                <BannerDescription variant="body2">{ description }</BannerDescription>
            </ContentArea>

            <BrandArea data-componentid={ `${ componentId }-brand` }>
                <BrandLogo />
            </BrandArea>

            <Actions>
                <CtaButton
                    variant="contained"
                    onClick={ onAnnouncementClick }
                    data-componentid={ `${ componentId }-cta` }
                >
                    <Box display="flex" alignItems="center" gap={ 1 }>
                        { buttonText }
                        <ArrowUpRightFromSquareIcon />
                    </Box>
                </CtaButton>
            </Actions>
        </BannerRoot>
    );
};

export default RebrandingAnnouncement;
