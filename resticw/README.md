# Restic Wrapper

A simple wrapper of `restic` used to ease the configuration of Adhara blockchain network backups

## Usage

The following environment variables are required
- `RESTIC_REPOSITORY` and `RESTIC_PASSWORD`
- for AWS S3: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- for Microsoft Azure Blob Storage: `AZURE_ACCOUNT_NAME` and `AZURE_ACCOUNT_KEY`
	
```sh
resticw.sh <backup|restore> --path <absolute_path> --remove-snapshots --snapshots-to-keep=4
    -p | --path backup directory
    -d | --delete-snapshots if you want to delete old snapshots ( default false ) 
    -k | --snapshots-to-keep num of snapshots to keep ( default 2 ) 
    --snapshot-id snapshot id to restor
```
