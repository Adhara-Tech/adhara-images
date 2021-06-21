FROM restic/restic:0.12.0

RUN apk --update add --no-cache bash

WORKDIR restic

COPY resticw.sh .

RUN chmod +x resticw.sh

ENTRYPOINT ["./resticw.sh"]
