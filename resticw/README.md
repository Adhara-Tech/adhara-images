# Restic Wrapper

A simple wrapper of `restic` used to ease the configuration of Adhara blockchain network backups

## Usage

The following environment variables are required
- `RESTIC_REPOSITORY` and `RESTIC_PASSWORD`
- for AWS S3: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- for Microsoft Azure Blob Storage: `AZURE_ACCOUNT_NAME` and `AZURE_ACCOUNT_KEY`
	
```sh
resticw.sh <backup|restore> --path <absolute_path> --delete-snapshots --snapshots-to-keep=4 --pushgateway-url=pushgateway:9091
    -p | --path backup directory
    -d | --delete-snapshots if you want to delete old snapshots ( default false )
    -k | --snapshots-to-keep num of snapshots to keep ( default 2 )
    --snapshot-id snapshot id to restore
    --pushgateway-url pushgateway url if you want generate prometheus metrics ( default empty )
```
If you set --pushgateway-url, reticw will generate `resticw_snapshot_status{kubernetes_pod_name="backup-pod", kubernetes_namespace="besu"} 0`.

With this metric you can configure an alert to let you know if a backup couldn't be taken. 

```yaml
- alert: FailedResticBackup
expr: resticw_snapshot_status == 0 
for: 1m
labels:
    severity: critical
annotations:
    summary: "Backup couldn't be taken"
    description: "Backup {{ $labels.kubernetes_pod_name }} in {{ $labels.kubernetes_namespace }} couldn't be taken"
```