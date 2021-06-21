#! /usr/bin/env bash
set -eo pipefail
trap 'catch $?' EXIT

catch(){
	if [[ "$action" == "backup" && -n "$pushgateway_url" ]]; then
		# checking exit code to generate the proper value
		if [[ $1 == 0 ]]; then
			pushgateway 1
		else
			pushgateway 0
		fi
  fi
}

help() {
	cat <<-EOF
	AWS S3:
		AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required

	Microsoft Azure Blob Storage:
		AZURE_ACCOUNT_NAME and AZURE_ACCOUNT_KEY environment variables are required

	Usage:
		RESTIC_REPOSITORY and RESTIC_PASSWORD environment variables are required.
		To generate accurate prometheus metric consider POD_NAME and NAMESPACE_NAME environment variables
		resticw.sh <backup|restore> --path <absolute_path> --delete-snapshots --snapshots-to-keep=4
		-p | --path backup directory
		-d | --delete-snapshots if you want to delete old snapshots ( default false )
		-k | --snapshots-to-keep num of snapshots to keep ( default 2 )
		--snapshot-id snapshot id to restore
		--pushgateway-url pushgateway url if you want generate prometheus metrics ( default empty )
		--metric-labels labels that you want to add to the metric (default kubernetes_pod_name, kubernetes_namespace) 
	EOF

exit 1

}

action=""
path=""
delete_snapshots=false
snapshots_to_keep=2
snapshot_id=""
pushgateway_url=""
metric_labels="kubernetes_pod_name=\"$POD_NAME\",kubernetes_namespace=\"$NAMESPACE_NAME\""

for arg in "$@"
do
    case $arg in
        backup|restore)
        action=$arg
        shift
        ;;
        -p=*|--path=*)
        path="${arg#*=}"
        shift
        ;;
        -d|--delete-snapshots)
        delete_snapshots=true
        shift
        ;;
        -k=*|--snapshots-to-keep=*)
        snapshots_to_keep=${arg#*=}
        shift
        ;;
        --snapshot-id=*)
        snapshot_id=${arg#*=}
        shift
        ;;
        --pushgateway-url=*)
        pushgateway_url=${arg#*=}
        shift
        ;;
        --metric-labels=*)
        metric_labels=${arg#*=}
        shift
        ;;
    esac
done

pushgateway(){
  # You can activate pushgateway to generate prometheus metrics (using pushgateway)
  [[ -z "$POD_NAME" ]] && POD_NAME=resticw
  [[ -z "$NAMESPACE_NAME" ]] && NAMESPACE_NAME=resticw

  cat <<-EOF | curl --data-binary @- http://${pushgateway_url}/metrics/job/besu-snapshot/instance/$POD_NAME
  # TYPE resticw_snapshot_status gauge
  resticw_snapshot_status{$metric_labels} $1
	EOF
}

backup(){
	# try to init restic repo on each execution, is the repo already exist
	# restic does not create anything and continue with the backup
	! restic init 2> /dev/null
	(cd $path; restic backup --no-cache ./)
}

restore(){
	restic restore --no-cache --target $path $snapshot_id --verify
}


if [[ -z "$RESTIC_REPOSITORY" && -z "$RESTIC_PASSWORD" ]]; then
	help;
fi


if [[ "$action" == "backup" ]]; then
	backup
	if [[ $delete_snapshots == true ]]; then
		restic forget --keep-last $snapshots_to_keep
	fi
elif [[ "$action" == "restore" ]]; then
	restore
fi
