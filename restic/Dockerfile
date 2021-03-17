FROM restic/restic:0.12.0

WORKDIR restic

COPY restic.sh .

RUN chmod +x restic.sh

ENTRYPOINT ["./restic.sh"]
