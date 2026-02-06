#!/bin/bash
set -e

. /home/memoryhole/.nvm/nvm.sh

REMOTE_HOST=arrestee-form.legalsolidaritybayarea.org
REMOTE_USER=arrestee_intake
REMOTE_DIR=/home/arrestee_intake/data
LOCAL_DIR=/home/memoryhole/arrestee_intake
IMPORT_DIR="${LOCAL_DIR}/import"
IMPORTED_DIR="${LOCAL_DIR}/imported"
ERROR_DIR="${LOCAL_DIR}/error"

echo "### Starting intake process ###"
for d in $LOCAL_DIR $IMPORT_DIR $IMPORTED_DIR $ERROR_DIR; do
  mkdir -p "$d"
done

echo "Syncing files to ${IMPORT_DIR}"
if ssh $REMOTE_USER@$REMOTE_HOST "find '${REMOTE_DIR}' -mindepth 1 -print -quit | grep -q ."; then
  scp -Cpr $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/* $IMPORT_DIR/
else
  echo "No files to transfer."
fi

# Check for .lock files in the local directory and delete them along with the corresponding files
find "$IMPORT_DIR" -type f -name '*.lock' -print0 | while IFS= read -r -d $'\0' lockfile; do
  echo "Found lock file: $lockfile"

  # Determine the base file name by stripping '.lock'
  basefile="${lockfile%.lock}"

  # Check if the corresponding file exists
  if [ -f "$basefile" ]; then
    echo "Deleting file: $basefile"
    rm -f "$basefile"
  fi

  # Delete the lock file
  echo "Deleting lock file: $lockfile"
  rm -f "$lockfile"
done

for file in $(ls -p $IMPORT_DIR | grep -v /); do
  echo "Shredding remote file ${file}"
  ssh $REMOTE_USER@$REMOTE_HOST "if [ -f ${REMOTE_DIR}/${file} ]; then shred -u ${REMOTE_DIR}/${file}; fi"
done

cd /var/www/memoryhole/current || exit

for file in $(ls -p $IMPORT_DIR | grep -v /); do
  echo "importing ${file}"
  if yarn cedar exec process_intake "${IMPORT_DIR}/${file}"; then
    mv "${IMPORT_DIR}/${file}" "${IMPORTED_DIR}/${file}"
  else
    echo "import failed - moving file to ${ERROR_DIR}"
    mv "${IMPORT_DIR}/${file}" "${ERROR_DIR}/${file}"
  fi
done

echo "### Intake process complete ###"
