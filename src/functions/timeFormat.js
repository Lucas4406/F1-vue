/**
 * Converts a specific UTC/GMT date and time to the user's local time with custom formatting.
 *
 * @param {string} dateString - The date and time, e.g., "2025-07-05T15:00:00".
 * @param {string} gmtOffset - The GMT offset, e.g., "+01:00".
 * @param {object} formatOptions - Options for Intl.DateTimeFormat.
 * @returns {string} The formatted date string in the user's local time.
 */
export function formatGmtToLocal(dateString, gmtOffset, formatOptions) {
    if (!dateString || !gmtOffset) {
        return ''; // Don't process if data is missing
    }

    const isoString = `${dateString}${gmtOffset}`;
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
        console.error("Invalid date provided to formatGmtToLocal:", isoString);
        return "Invalid Time"; // Return a user-friendly fallback
    }

    // `undefined` uses the browser's default locale
    const formatter = new Intl.DateTimeFormat(undefined, formatOptions);
    return formatter.format(date);
}