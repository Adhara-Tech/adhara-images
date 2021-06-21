FROM adharatech/tools:0.0.2

RUN apk --update add --no-cache restic

WORKDIR restic

COPY resticw.sh .

RUN chmod +x resticw.sh

ENTRYPOINT ["./resticw.sh"]
