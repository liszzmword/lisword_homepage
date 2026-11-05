"""유튜브 영상 목록 — 홈 '유튜브' 칸과 미디어 페이지(news.html) '유튜브 영상' 칸이 같이 씁니다.

새 영상을 올리면 VIDEOS 맨 위에 한 줄을 추가하고
    python3 tools/build_blog.py
를 실행하세요. 두 페이지의 <!-- SITE-VIDEOS:START --> ~ <!-- SITE-VIDEOS:END --> 사이가
다시 쓰입니다. 그 사이는 직접 고치지 마세요.

    영상 ID  : 주소 youtube.com/watch?v=XXXXXXXXXXX 의 XXXXXXXXXXX (youtu.be/XXXXXXXXXXX 도 같음)
    홈       : True 로 둔 영상이 홈에 나옵니다 (최대 3개, 위에 적힌 순서대로).
               True 가 하나도 없으면 최신 3개가 나옵니다.
"""

import html

CHANNEL_URL = "https://www.youtube.com/@lisword"
CHANNEL_NAME = "이인섭 AI 연구원"

# (영상 ID, 제목, 올린 날, 길이, 홈에 보일지) — 최신 영상을 맨 위에
VIDEOS = [
    ("KV_kYYMh3sA", "내 사이트 누가, 언제, 어떻게 쓰는지 다 보입니다 | 클로드 코드로 GA4 붙이기", "2026-05-15", "9:19", False),
    ("X_tKxvPtuBU", "클로드코드, 초보자도 15분 만에 바이브코딩으로 서비스 배포하는 법", "2026-05-06", "17:59", True),
    ("7FLsVEdXeTc", "클로드코드 설치 완벽 가이드 (초보자도 10분이면 끝!)", "2026-05-01", "16:20", True),
    ("RwdQJb_KR6A", "내 템플릿은 그대로!! 클로드를 활용한 파워포인트 자동화", "2026-04-22", "6:42", False),
    ("GxRfz9hdiLA", "엑셀 이제 끝났습니다. 클로드코드로 엑셀 자동화하는 법", "2026-04-17", "10:41", True),
]

START, END = "<!-- SITE-VIDEOS:START -->", "<!-- SITE-VIDEOS:END -->"


def _url(vid):
    return f"https://www.youtube.com/watch?v={vid}"


def _thumb(vid):
    return f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"


def _date(d):
    return d.replace("-", ".")


def home_videos():
    picked = [v for v in VIDEOS if v[4]][:3]
    return picked or VIDEOS[:3]


def home_block(indent="        "):
    """홈 '유튜브' 칸 — 영상 3개."""
    rows = []
    for vid, title, date, length, _home in home_videos():
        t = html.escape(title)
        rows.append(
            f'{indent}  <a href="{_url(vid)}" target="_blank" rel="noopener" data-video="{vid}">'
            f'<div class="lp-yt-thumb"><img src="{_thumb(vid)}" alt="" loading="lazy" decoding="async" /></div>'
            f'<div class="lp-yt-title">{t}</div>'
            f'<div class="lp-yt-meta">{_date(date)} · {length}</div></a>'
        )
    return "\n".join([f"{indent}{START}", f'{indent}<div class="lp-yt">', *rows, f"{indent}</div>", f"{indent}{END}"])


def media_block(indent="      "):
    """미디어 페이지 '유튜브 영상' 칸 — 전체 영상."""
    rows = []
    for vid, title, date, length, _home in VIDEOS:
        t = html.escape(title)
        rows.append("\n".join([
            f'{indent}  <a class="media-yt-card" href="{_url(vid)}" target="_blank" rel="noopener" data-video="{vid}">',
            f'{indent}    <div class="media-yt-thumb"><img src="{_thumb(vid)}" alt="" loading="lazy" decoding="async" /><span class="media-yt-len">{length}</span></div>',
            f'{indent}    <div class="media-yt-title">{t}</div>',
            f'{indent}    <div class="media-yt-date">{_date(date)}</div>',
            f"{indent}  </a>",
        ]))
    return "\n".join([f"{indent}{START}", f'{indent}<div class="media-yt">', *rows, f"{indent}</div>", f"{indent}{END}"])


# 영상 칸이 있는 페이지 — (파일, 어떤 모양)
PAGES = [("index.html", "home"), ("news.html", "media")]


def apply(text, kind, replace):
    """replace = site_nav._replace. 표시가 없으면 None."""
    block = home_block() if kind == "home" else media_block()
    return replace(text, START, END, block)
