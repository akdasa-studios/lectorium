from typing import TypedDict
from uuid import uuid4
from io import BytesIO
from json import dumps as json_dumps, loads as json_loads
from mutagen.mp3 import MP3

from airflow.models import Variable
from airflow.decorators import task

from boto3 import client

from lectorium.config import VAR_APP_BUCKET_ACCESS_KEY, VAR_APP_BUCKET_NAME


class BucketObjectInfo(TypedDict):
  key: str
  size: int
  last_modified: int


def __get_bucket_client():
  bucket_credentials = Variable.get(VAR_APP_BUCKET_ACCESS_KEY, deserialize_json=True)
  return client(
    's3',
    aws_access_key_id=bucket_credentials['access_key_id'],
    aws_secret_access_key=bucket_credentials['secret_access_key'],
    endpoint_url=bucket_credentials['endpoint_url'],
    region_name=bucket_credentials['region_name'])


@task(task_display_name="⬆️ Bucket: Upload Data")
def bucket_upload_data(
  object_key: str,
  data: BytesIO,
):
  object_key  = object_key.replace('//', '/')
  bucket_name  = Variable.get(VAR_APP_BUCKET_NAME)
  bucket_client = __get_bucket_client()

  if isinstance(data, dict):
    data = BytesIO(json_dumps(data, ensure_ascii=False, indent=2).encode())
  if isinstance(data, str):
    data = BytesIO(data.encode("utf-8"))

  bucket_client.upload_fileobj(data, bucket_name, object_key)


@task(task_display_name="⬇️ Bucket: Download Json Data")
def bucket_download_json_data(
  object_key: str,
  raise_if_not_found: bool = True,
):
  print("Downloading: ", object_key)
  object_key  = object_key.replace('//', '/')
  bucket_name  = Variable.get(VAR_APP_BUCKET_NAME)
  bucket_client = __get_bucket_client()
  try:
    response = bucket_client.get_object(Bucket=bucket_name, Key=object_key)['Body'].read()
  except bucket_client.exceptions.NoSuchKey:
    if raise_if_not_found:
      raise Exception(f"Object not found: {object_key}")
    return None
  return json_loads(response)


@task(task_display_name="⬇️ Bucket: Download File")
def bucket_download_file(
  object_key: str,
  path: str = None,
):
  if path is None:
    path = "/tmp/" + str(uuid4())

  print(f"Downloading: {object_key} to {path}")

  bucket_name  = Variable.get(VAR_APP_BUCKET_NAME)
  bucket_client = __get_bucket_client()
  bucket_client.download_file(bucket_name, object_key, path)

  return path


@task(task_display_name="⬇️ Bucket: Upload File")
def bucket_upload_file(
  path: str,
  object_key: str,
):
  print(path, object_key)
  bucket_name  = Variable.get(VAR_APP_BUCKET_NAME)
  bucket_client = __get_bucket_client()
  bucket_client.upload_file(path, bucket_name, object_key)


@task(task_display_name="✍️ Bucket: Sign Url")
def bucket_sign_url(
  object_key: str,
  method: str,
  expiration: int = 3600,
):
  bucket_name  = Variable.get(VAR_APP_BUCKET_NAME)
  bucket_client = __get_bucket_client()

  return bucket_client.generate_presigned_url(
    f"{method}_object",
    Params={"Bucket": bucket_name, "Key": object_key},
    ExpiresIn=expiration,
  )

@task(task_display_name="🗂️ Bucket: Copy File")
def bucket_copy_file(
  source_key: str,
  destination_key: str,
):
  source_key = source_key.replace('//', '/')
  destination_key = destination_key.replace('//', '/')
  bucket_name = Variable.get(VAR_APP_BUCKET_NAME)
  bucket_client = __get_bucket_client()

  print(f"Copying file from {source_key} to {destination_key}")

  bucket_client.copy_object(
    Bucket=bucket_name,
    CopySource={'Bucket': bucket_name, 'Key': source_key},
    Key=destination_key
  )
  
@task(task_display_name="📋 Bucket: List Files")
def bucket_list_files(
  prefix=''
) -> list[BucketObjectInfo]:
  s3_client   = __get_bucket_client()
  bucket_name = Variable.get(VAR_APP_BUCKET_NAME)
  file_list   = []
  paginator   = s3_client.get_paginator('list_objects_v2')
    
  for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
    if 'Contents' in page:
      for obj in page['Contents']:
        if not obj['Key'].endswith('/'):
          file_list.append(
            BucketObjectInfo(
              key=obj['Key'],
              size=obj['Size'],
              last_modified=obj['LastModified'].timestamp() if 'LastModified' in obj else 0
            )
          )
    
    return file_list


@task(
  task_display_name="⏰ AWS: Get Audio Duration",
  multiple_outputs=False)
def get_audio_duration(
  object_key: str,
) -> int:
  s3_client   = __get_bucket_client()
  bucket_name = Variable.get(VAR_APP_BUCKET_NAME)
  response    = s3_client.get_object(Bucket=bucket_name, Key=object_key)
  file_data   = BytesIO(response['Body'].read())
  audio       = MP3(file_data)
  return audio.info.length


@task(task_display_name="🔄 Bucket: Move File")
def bucket_move_file(
  source_key: str,
  destination_key: str,
):
  # source_key = source_key.replace('//', '/')
  # destination_key = destination_key.replace('//', '/')
  bucket_name = Variable.get(VAR_APP_BUCKET_NAME)
  bucket_client = __get_bucket_client()

  print(f"Moving file from {source_key} to {destination_key}")

  # Copy the file to the new location
  bucket_client.copy_object(
    Bucket=bucket_name,
    CopySource={'Bucket': bucket_name, 'Key': source_key},
    Key=destination_key
  )

  # Delete the original file
  bucket_client.delete_object(Bucket=bucket_name, Key=source_key)
