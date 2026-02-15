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

import AlpacaAvatar from "../../themes/default/assets/images/avatars/alpaca.png";
import ArmadilloAvatar from "../../themes/default/assets/images/avatars/armadillo.png";
import BadgerAvatar from "../../themes/default/assets/images/avatars/badger.png";
import ButterflyAvatar from "../../themes/default/assets/images/avatars/butterfly.png";
import CheetahAvatar from "../../themes/default/assets/images/avatars/cheetah.png";
import CowAvatar from "../../themes/default/assets/images/avatars/cow.png";
import CrocodileAvatar from "../../themes/default/assets/images/avatars/crocodile.png";
import { OnboardingBrandingConfigInterface } from "../models";

/**
 * Available avatar names for logo suggestions.
 */
export const AVATAR_NAMES: string[] = [
    "alpaca",
    "armadillo",
    "badger",
    "butterfly",
    "cheetah",
    "cow",
    "crocodile"
];

/**
 * Mapping of avatar names to imported image assets for display in Console.
 */
export const AVATAR_IMAGES: Record<string, string> = {
    alpaca: AlpacaAvatar,
    armadillo: ArmadilloAvatar,
    badger: BadgerAvatar,
    butterfly: ButterflyAvatar,
    cheetah: CheetahAvatar,
    cow: CowAvatar,
    crocodile: CrocodileAvatar
};

/**
 * Base path for avatar images.
 * This is the runtime path used by the branding API for JSP portals.
 */
export const AVATAR_BASE_PATH: string = "/libs/themes/default/assets/images/avatars";

/**
 * Generate avatar logo URL for the branding API (runtime path).
 *
 * @param avatar - Avatar name
 * @returns Runtime path to the avatar image (for branding API)
 */
export const getAvatarLogoUrl = (avatar: string): string => {
    return `${AVATAR_BASE_PATH}/${avatar}.png`;
};

/**
 * Get the display image source for an avatar (webpack bundled).
 *
 * @param avatarName - Avatar name (lowercase)
 * @returns Bundled image source for display in Console
 */
export const getAvatarDisplayImage = (avatarName: string): string => {
    return AVATAR_IMAGES[avatarName.toLowerCase()] || "";
};

/**
 * Extract avatar name from logo URL.
 *
 * @param url - Logo URL
 * @returns Capitalized avatar name or empty string if not found
 */
export const getAnimalNameFromUrl = (url: string): string => {
    const match: RegExpMatchArray | null = url.match(/\/([a-z]+)\.png$/);

    if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }

    return "";
};

/**
 * Preset color options for quick selection.
 */
export const PRESET_COLORS: string[] = [
    "#ff7300", // Orange (default)
    "#3b82f6", // Blue
    "#6366f1", // Indigo
    "#64748b",  // Slate
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444" // Red
];

/**
 * Default branding configuration.
 */
export const DEFAULT_BRANDING_CONFIG: OnboardingBrandingConfigInterface = {
    logoAltText: "Logo",
    logoUrl: undefined,
    primaryColor: "#ff7300"
};

/**
 * Interface for branding validation constraints.
 */
interface BrandingConstraintsInterface {
    /** Valid hex color pattern */
    COLOR_PATTERN: RegExp;
    /** Default primary color */
    DEFAULT_PRIMARY_COLOR: string;
    /** Logo URL must be valid URL or relative path */
    LOGO_URL_PATTERN: RegExp;
}

/**
 * Branding validation constraints.
 */
export const BrandingConstraints: BrandingConstraintsInterface = {
    COLOR_PATTERN: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    DEFAULT_PRIMARY_COLOR: "#ff7300",
    LOGO_URL_PATTERN: /^(https?:\/\/|\/)/
};

/**
 * Generate a random hex color.
 *
 * @returns Random hex color string
 */
export const generateRandomColor = (): string => {
    const letters: string = "0123456789ABCDEF";
    let color: string = "#";

    for (let i: number = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

/**
 * Validate a hex color string.
 *
 * @param color - Color string to validate
 * @returns True if the color is a valid hex color
 */
export const isValidHexColor = (color: string): boolean => {
    return BrandingConstraints.COLOR_PATTERN.test(color);
};
