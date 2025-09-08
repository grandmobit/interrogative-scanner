/**
 * Validation utilities for Interrogative Scanner
 */

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates file extension for supported file types
 */
export const isSupportedFileType = (fileName: string): boolean => {
  const supportedExtensions = [
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp',
    '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.exe', '.msi', '.dmg', '.pkg', '.deb', '.rpm'
  ];
  
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return supportedExtensions.includes(extension);
};

/**
 * Validates file size (max 32MB for VirusTotal free tier)
 */
export const isValidFileSize = (sizeInBytes: number): boolean => {
  const maxSizeInBytes = 32 * 1024 * 1024; // 32MB
  return sizeInBytes <= maxSizeInBytes;
};

/**
 * Sanitizes user input for display
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
