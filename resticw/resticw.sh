#! /usr/bin/env sh
set -eo pipefail

help() {
	cat <<-EOF
	AWS S3:
		AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required

	Microsoft Azure Blob Storage:
		AZURE_ACCOUNT_NAME and AZURE_ACCOUNT_KEY environment variables are required
	
	Usage:
		RESTIC_REPOSITORY and RESTIC_PASSWORD environment variables are required. 
		resticw.sh <backup|restore> --path <absolute_path> --remove-snapshots --snapshots-to-keep=4
			-p | --path backup directory
			-d | --delete-snapshots if you want to delete old snapshots ( default false ) 
			-k | --snapshots-to-keep num of snapshots to keep ( default 2 ) 
			--snapshot-id snapshot id to restore
	EOF

exit 1

}

if [[ -z "${RESTIC_REPOSITORY}" && -z "${RESTIC_PASSWORD}" ]]; then
	help;
fi

action=""
path=""
delete_snapshots=false
snapshots_to_keep=2
snapshot_id=""

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
    esac
done

backup(){
	# try to init restic repo on each execution, is the repo already exist
	# restic does not create anything and continue with the backup
	! restic init 2> /dev/null
	(cd $path; restic backup --no-cache ./)
}

restore(){
	restic restore --no-cache --target $path $snapshot_id --verify
}

if [[ "${action}" == "backup" ]]; then
	backup
	if [[ "$delete_snapshots" == "true" ]]; then 
		restic forget --keep-last $snapshots_to_keep
	fi
elif [[ "${action}" == "restore" ]]; then 
	restore
fi
