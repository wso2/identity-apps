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

import { OnboardingBrandingConfig } from "../models";

/**
 * Available animals for logo generation.
 * Uses Google's publicly available profile animal images.
 * Reference: https://github.com/asgardeo/thunder/blob/main/frontend/apps/thunder-develop/src/features/applications/utils/generateAppLogoSuggestion.ts
 */
export const ANIMALS: string[] = [
    "alligator", "anteater", "armadillo", "axolotl", "badger", "bat", "beaver",
    "buffalo", "camel", "chinchilla", "chupacabra", "coyote", "crow", "dingo",
    "dolphin", "dragon", "duck", "elephant", "ferret", "fox", "giraffe", "gopher",
    "iguana", "kangaroo", "kiwi", "koala", "lemur", "leopard", "llama", "manatee",
    "narwhal", "otter", "panda", "penguin", "platypus", "quokka", "raccoon",
    "sheep", "squirrel", "tiger", "turtle", "walrus", "wolf", "wombat"
];

/**
 * Google's profile image URL base.
 */
export const GOOGLE_PROFILE_IMAGE_URL: string = "https://ssl.gstatic.com/docs/common/profile";

/**
 * Generate animal logo URL from Google's CDN.
 *
 * @param animal - Animal name
 * @returns Full URL to the animal logo image
 */
export const getAnimalLogoUrl = (animal: string): string => {
    return `${GOOGLE_PROFILE_IMAGE_URL}/${animal}_lg.png`;
};

/**
 * Generate random logo suggestions.
 *
 * @param count - Number of suggestions to generate (default: 8)
 * @returns Array of logo URLs
 */
export const generateLogoSuggestions = (count: number = 8): string[] => {
    const shuffled: string[] = [ ...ANIMALS ].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count).map(getAnimalLogoUrl);
};

/**
 * Extract animal name from logo URL.
 *
 * @param url - Logo URL
 * @returns Capitalized animal name or empty string if not found
 */
export const getAnimalNameFromUrl = (url: string): string => {
    const match: RegExpMatchArray | null = url.match(/\/([a-z]+)_lg\.png$/);

    if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }

    return "";
};

/**
 * Preset color options for quick selection.
 */
export const PRESET_COLORS: string[] = [
    "#ff7300", // Orange (Asgardeo)
    "#b71c1c", // Dark Red
    "#e65100", // Deep Orange
    "#43a047", // Green
    "#7b1fa2", // Purple
    "#c0ca33", // Lime
    "#558b2f", // Dark Green
    "#ff8f00"  // Amber
];

/**
 * Default branding configuration.
 */
export const DEFAULT_BRANDING_CONFIG: OnboardingBrandingConfig = {
    logoAltText: "Logo",
    logoUrl: undefined,
    primaryColor: "#ff7300"
};

/**
 * Branding validation constraints.
 */
export const BrandingConstraints = {
    /** Valid hex color pattern */
    COLOR_PATTERN: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    /** Default primary color */
    DEFAULT_PRIMARY_COLOR: "#ff7300",
    /** Logo URL must be valid URL or data URI */
    LOGO_URL_PATTERN: /^(https?:\/\/|data:image\/|\/)/
} as const;

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
