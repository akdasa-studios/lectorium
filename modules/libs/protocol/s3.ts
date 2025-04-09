/**
 * Type of operations that can be performed on an S3 bucket.
 */
export enum S3Operation {
  GetObject = 'getObject',
  PutObject = 'putObject',
  DeleteObject = 'deleteObject',
}

/**
 * Generates the key for storing metadata or logs related to S3 operations.
 * @param bucketName Name of the S3 bucket.
 * @param key Object key in the bucket.
 * @returns Key for storing metadata or logs.
 */
export const S3StorageKey = (bucketName: string, key: string) =>
  `s3:${bucketName}:${key}`;

/**
 * Type representing the details of an S3 signed URL request.
 */
export type S3SignedUrlRequest = {
  bucketName: string;
  key: string;
  operation: S3Operation;
  expiresIn?: number;
};

/**
 * Type representing the response for an S3 signed URL generation.
 */
export type S3SignedUrlResponse = {
  success: boolean;
  signedUrl: string;
};