FROM restic/restic:0.12.0

WORKDIR restic

COPY resticw.sh .

RUN chmod +x resticw.sh

ENTRYPOINT ["./resticw.sh"]
