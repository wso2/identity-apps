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

/**
 * Avatar path pattern for matching onboarding wizard avatars.
 * Matches paths like: /libs/themes/default/assets/images/avatars/butterfly.png
 */
const AVATAR_PATH_PATTERN: RegExp = /^\/libs\/themes\/default\/assets\/images\/avatars\/([a-z]+)\.png$/;

/**
 * Mapping of avatar names to imported image assets.
 * These are webpack-bundled images for display in Console.
 */
const AVATAR_IMAGES: Record<string, string> = {
    alpaca: AlpacaAvatar,
    armadillo: ArmadilloAvatar,
    badger: BadgerAvatar,
    butterfly: ButterflyAvatar,
    cheetah: CheetahAvatar,
    cow: CowAvatar,
    crocodile: CrocodileAvatar
};

/**
 * Check if a logo URL is an avatar path from the onboarding wizard.
 *
 * @param url - Logo URL to check
 * @returns True if the URL matches the avatar pattern
 */
export const isAvatarLogoUrl = (url: string): boolean => {
    return AVATAR_PATH_PATTERN.test(url);
};

/**
 * Extract avatar name from a logo URL.
 *
 * @param url - Logo URL
 * @returns Avatar name (lowercase) or empty string if not found
 */
export const getAvatarNameFromUrl = (url: string): string => {
    const match: RegExpMatchArray | null = url.match(AVATAR_PATH_PATTERN);

    return match ? match[1] : "";
};

/**
 * Resolve a branding logo URL to a displayable image source.
 *
 * This function handles:
 * - Avatar URLs from onboarding wizard: Returns bundled image
 * - External URLs (HTTP/HTTPS): Returns as-is
 * - Data URLs: Returns as-is
 * - Empty/undefined: Returns empty string
 *
 * @param logoUrl - Logo URL from branding preferences
 * @returns Displayable image source
 */
export const resolveBrandingLogoUrl = (logoUrl: string | undefined): string => {
    if (!logoUrl) {
        return "";
    }

    // Check if it's an avatar URL from onboarding wizard
    if (isAvatarLogoUrl(logoUrl)) {
        const avatarName: string = getAvatarNameFromUrl(logoUrl);

        if (avatarName && AVATAR_IMAGES[avatarName]) {
            return AVATAR_IMAGES[avatarName];
        }
    }

    // For external URLs (HTTP/HTTPS) or data URLs, return as-is
    return logoUrl;
};
