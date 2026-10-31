#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""IndexNow 알림 도구 / Notify IndexNow search engines (Bing, 네이버 등)

sitemap.xml에 있는 주소 목록을 IndexNow(https://api.indexnow.org/indexnow)에 한 번에 보냅니다.
IndexNow에 참여한 검색엔진(Bing, 네이버 등)이 바뀐 페이지를 더 빨리 다시 읽어 갑니다.
ChatGPT 검색은 Bing 색인을 많이 참고합니다. 구글은 IndexNow를 쓰지 않습니다(구글은 Search Console의 사이트맵으로 알립니다).

⚠️ 배포가 끝난 뒤에 실행하세요 — www.lisword.co.kr 에서 바뀐 내용이 보이고, 키 파일(아래 KEY_LOCATION)이 열릴 때.
   검색엔진은 키 파일을 열어 "이 사이트 주인이 보낸 알림"인지 확인합니다. 그래서 보내기 전에 키 파일을 먼저 확인합니다.
⚠️ 같은 주소를 하루에도 여러 번 보내지 마세요. 바뀐 날 한 번이면 충분합니다.

사용법 (홈페이지 폴더에서)
  python3 tools/indexnow.py --dry-run      보내지 않고 보낼 내용만 보여 줍니다 (인터넷을 쓰지 않습니다)
  python3 tools/indexnow.py                sitemap.xml의 주소를 모두 보냅니다
  python3 tools/indexnow.py 주소 [주소 …]   적은 주소만 보냅니다 (예: https://www.lisword.co.kr/blog/새-글/)

Python 3.9 표준 라이브러리만 씁니다. 자세한 설명은 업데이트_메뉴얼.md 9번.
"""

import argparse
import json
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITEMAP_PATH = ROOT / "sitemap.xml"

HOST = "www.lisword.co.kr"
SITE = "https://" + HOST
ENDPOINT = "https://api.indexnow.org/indexnow"
# IndexNow 키 — 저장소 맨 위의 <키>.txt 파일(내용 = 키 그대로)과 짝입니다. 둘 다 바꾸지 마세요.
# 이 키는 비밀번호가 아닙니다. 누구나 볼 수 있는 키 파일로 "이 사이트가 보낸 알림"임을 증명할 뿐입니다.
KEY = "0e8c6c24da0026281816ab3edca267cf"
KEY_LOCATION = SITE + "/" + KEY + ".txt"
MAX_URLS = 10000                 # IndexNow가 한 번에 받는 최대 주소 수
TIMEOUT = 30                     # 초

RESULTS = {
    200: ("접수됐습니다.", "OK — submitted."),
    202: ("접수됐습니다. 검색엔진이 키를 확인하는 중입니다 (처음 보낼 때 흔합니다).", "Accepted — key validation pending."),
    400: ("요청 형식이 잘못됐습니다.", "Bad request."),
    403: ("키를 확인하지 못했습니다. 키 파일이 배포됐는지, 내용이 키와 같은지 확인하세요.", "Forbidden — key not valid or key file not found."),
    422: ("이 사이트 주소가 아니거나 키가 맞지 않는 주소가 있습니다.", "Unprocessable — URLs do not belong to the host or key mismatch."),
    429: ("너무 자주 보냈습니다. 나중에 다시 보내세요.", "Too many requests — try again later."),
}


def say(ko, en=""):
    print(ko + (f"\n  {en}" if en else ""))


def sitemap_urls(path=SITEMAP_PATH):
    """sitemap.xml의 <loc> 주소 목록."""
    try:
        tree = ET.parse(str(path))
    except (OSError, ET.ParseError) as err:
        raise SystemExit(f"sitemap.xml을 읽을 수 없습니다: {err}\n  Cannot read sitemap.xml: {err}")
    return [el.text.strip() for el in tree.iter() if el.tag.endswith("loc") and el.text and el.text.strip()]


def clean_urls(urls):
    """이 사이트(https://www.lisword.co.kr/…) 주소만 남기고 중복을 뺍니다. 다른 사이트 주소가 있으면 멈춥니다."""
    seen, out, bad = set(), [], []
    for url in urls:
        url = url.strip()
        if not (url == SITE or url.startswith(SITE + "/")):
            bad.append(url)
        elif url not in seen:
            seen.add(url)
            out.append(url)
    if bad:
        raise SystemExit("이 사이트 주소가 아닙니다 (https://www.lisword.co.kr/ 로 시작해야 합니다):\n  "
                         + "\n  ".join(bad) + "\n  Only URLs on " + SITE + " can be submitted.")
    if not out:
        raise SystemExit("보낼 주소가 없습니다. / No URLs to submit.")
    if len(out) > MAX_URLS:
        raise SystemExit(f"주소가 {len(out)}개로 너무 많습니다 (한 번에 {MAX_URLS}개까지). / Too many URLs.")
    return out


def check_key_file():
    """저장소의 키 파일이 있고 내용이 키와 같은지 확인합니다."""
    path = ROOT / (KEY + ".txt")
    try:
        content = path.read_text(encoding="utf-8").strip()
    except OSError:
        raise SystemExit(f"키 파일이 없습니다: {path.name} (저장소 맨 위). / Key file missing: {path.name}")
    if content != KEY:
        raise SystemExit(f"키 파일 내용이 키와 다릅니다: {path.name} / Key file content does not match the key.")


def check_live_key(url=None):
    """배포된 사이트에서 키 파일이 열리는지 확인합니다 (배포 전이면 보내지 않습니다)."""
    url = url or KEY_LOCATION
    req = urllib.request.Request(url, headers={"User-Agent": "lisword-indexnow/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as res:
            content = res.read().decode("utf-8", "replace").strip()
    except (urllib.error.URLError, OSError) as err:
        raise SystemExit(f"사이트에서 키 파일을 열 수 없습니다: {url}\n  ({err})\n"
                         "  배포가 끝났는지 확인한 뒤 다시 실행하세요. / The key file is not reachable yet — run this after the deploy.")
    if content != KEY:
        raise SystemExit(f"사이트의 키 파일 내용이 키와 다릅니다: {url}\n  Live key file does not match the key.")


def payload(urls):
    return {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": urls}


def submit(urls, endpoint=None):
    """IndexNow에 주소 목록을 보내고 HTTP 상태 코드를 돌려줍니다."""
    data = json.dumps(payload(urls), ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(endpoint or ENDPOINT, data=data, method="POST", headers={
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "lisword-indexnow/1.0",
    })
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as res:
            return res.status
    except urllib.error.HTTPError as err:
        return err.code
    except (urllib.error.URLError, OSError) as err:
        raise SystemExit(f"IndexNow에 연결할 수 없습니다: {err}\n  Cannot reach IndexNow: {err}")


def main(argv=None):
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    parser = argparse.ArgumentParser(
        description="sitemap.xml의 주소를 IndexNow(Bing·네이버 등)에 알립니다. 배포가 끝난 뒤에 실행하세요. / "
                    "Submit sitemap URLs to IndexNow after deploying.")
    parser.add_argument("urls", nargs="*", help="보낼 주소 (없으면 sitemap.xml 전체) / URLs to submit (default: sitemap.xml)")
    parser.add_argument("--dry-run", action="store_true", help="보내지 않고 보낼 내용만 보여 줍니다 / show the request, send nothing")
    args = parser.parse_args(argv)

    urls = clean_urls(args.urls or sitemap_urls())
    check_key_file()
    source = "입력한 주소" if args.urls else "sitemap.xml"
    say(f"보낼 주소 {len(urls)}개 ({source}) → {ENDPOINT}", f"{len(urls)} URL(s) from {'arguments' if args.urls else 'sitemap.xml'}")
    for url in urls:
        print("  · " + url)

    if args.dry_run:
        print("\n보내지 않았습니다 (--dry-run). 보낼 내용: / Not sent (--dry-run). Request body:")
        print(json.dumps(payload(urls), ensure_ascii=False, indent=2))
        return 0

    check_live_key()
    status = submit(urls)
    ko, en = RESULTS.get(status, (f"예상하지 못한 응답입니다 (HTTP {status}).", f"Unexpected response (HTTP {status})."))
    say(f"\nHTTP {status} — {ko}", en)
    return 0 if status in (200, 202) else 1


if __name__ == "__main__":
    sys.exit(main())
