FROM python:3.13-alpine

WORKDIR /app

RUN addgroup -S honore \
    && adduser -S -G honore honore \
    && mkdir -p /data \
    && chown honore:honore /data

COPY --chown=honore:honore server.py index.html styles.css app.js admin.html admin.css admin.js ./
COPY --chown=honore:honore assets ./assets

USER honore

ENV PORT=8080 \
    HONORE_DATA_DIR=/data

EXPOSE 8080

VOLUME ["/data"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/api/health', timeout=2)"

CMD ["python", "server.py"]
