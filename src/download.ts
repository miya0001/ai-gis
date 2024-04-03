import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

const config = {
  apiVersion: '2021-09-30',
  region: 'us-east-1'
}

const client = new S3Client(config);
