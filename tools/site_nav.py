"""리즈워드 사이트 공통 메뉴 (상단 메뉴 + 바닥 메뉴).

모든 페이지가 이 파일의 메뉴 하나를 같이 씁니다. 메뉴를 바꾸려면 이 파일만 고치고
    python3 tools/build_blog.py
를 실행하세요. 블로그 페이지가 다시 만들어지고, 아래 STATIC_PAGES의
<!-- SITE-NAV:START --> ~ <!-- SITE-NAV:END -->, <!-- SITE-FOOTER:START --> ~ <!-- SITE-FOOTER:END -->
사이도 같은 메뉴로 다시 쓰입니다. 그 사이는 직접 고치지 마세요.

메뉴 위계 (모든 페이지에서 같은 순서·같은 이름)
    LISWORD(로고) → 홈
    ├ 대학·사업단   /university/            대학 앵커(옛 RISE) 사업단용 프로그램
    ├ 기업·기관     /corporate/             임직원 교육·AX 전환 프로그램
    ├ 교육 사례     /blog/category/cases/   진행한 교육 기록 (사례 글이 여기에 속합니다)
    ├ 블로그        /blog/                  기획 가이드·AI 소식 (사례 글은 넣지 않습니다)
    └ 미디어        /news.html              언론 보도 (유튜브 채널이 열리면 영상도 여기에 둡니다)
    [교육 문의]     /#contact
"""

NAV_ITEMS = [
    ("univ", "/university/", "대학·사업단"),
    ("corp", "/corporate/", "기업·기관"),
    ("cases", "/blog/category/cases/", "교육 사례"),
    ("blog", "/blog/", "블로그"),
    ("media", "/news.html", "미디어"),
]
CTA_LABEL = "교육 문의"
CONTACT = "/#contact"

FOOTER_ITEMS = NAV_ITEMS + [
    ("contact", CONTACT, "교육 문의"),
]

NAV_START, NAV_END = "<!-- SITE-NAV:START -->", "<!-- SITE-NAV:END -->"
FOOTER_START, FOOTER_END = "<!-- SITE-FOOTER:START -->", "<!-- SITE-FOOTER:END -->"

# 블로그 밖 페이지 — (파일, 켜 둘 메뉴, 이 페이지 주소, 클릭 측정 이름)
STATIC_PAGES = [
    ("index.html", None, "/", "nav"),
    ("university/index.html", "univ", "/university/", "university_nav"),
    ("corporate/index.html", "corp", "/corporate/", "corporate_nav"),
    ("news.html", "media", "/news.html", "news_nav"),
]


def _href(href, page_path):
    # 홈에서는 문의 칸으로 바로 내려가게 합니다 (페이지를 다시 읽지 않음).
    if page_path == "/" and href.startswith("/#"):
        return href[1:]
    return href


def header(active=None, page_path=None, where="nav", indent="  "):
    """상단 메뉴 HTML. active = NAV_ITEMS의 키(지금 있는 메뉴), page_path = 지금 페이지 주소."""
    links = []
    for key, href, label in NAV_ITEMS:
        attrs = ""
        if key == active:
            attrs = ' class="is-active"' + (' aria-current="page"' if href == page_path else "")
        links.append(f'{indent}      <a href="{_href(href, page_path)}"{attrs}>{label}</a>')
    track = f"if (window.gtag) gtag('event', 'cta_contact_click', {{ location: '{where}' }});"
    lines = [
        f"{indent}{NAV_START}",
        f'{indent}<header class="nav">',
        f'{indent}  <div class="wrap nav-inner">',
        f'{indent}    <a href="/" class="logo"><span class="logo-mark"></span><span>LISWORD</span></a>',
        f'{indent}    <nav class="nav-links" aria-label="주요 메뉴">',
        *links,
        f"{indent}    </nav>",
        f'{indent}    <a href="{_href(CONTACT, page_path)}" class="nav-cta" onclick="{track}">{CTA_LABEL}</a>',
        f"{indent}  </div>",
        f"{indent}</header>",
        f"{indent}{NAV_END}",
    ]
    return "\n".join(lines)


def footer(page_path=None, indent="      "):
    """바닥 메뉴 HTML (footer 안의 링크 줄)."""
    links = []
    for _key, href, label in FOOTER_ITEMS:
        current = ' aria-current="page"' if href == page_path else ""
        links.append(f'{indent}  <a href="{_href(href, page_path)}"{current}>{label}</a>')
    lines = [
        f"{indent}{FOOTER_START}",
        f'{indent}<nav class="footer-links" aria-label="바로가기">',
        *links,
        f"{indent}</nav>",
        f"{indent}{FOOTER_END}",
    ]
    return "\n".join(lines)


def _replace(text, start, end, block):
    """start~end 표시를 포함한 줄 전체를 block으로 바꿉니다. 표시가 없거나 짝이 안 맞으면 None."""
    if text.count(start) != 1 or text.count(end) != 1:
        return None
    i, j = text.index(start), text.index(end)
    if j < i:
        return None
    i = text.rfind("\n", 0, i) + 1          # 표시가 있는 줄의 맨 앞
    j = j + len(end)
    return text[:i] + block + text[j:]


def apply(text, active, page_path, where):
    """정적 페이지의 상단·바닥 메뉴를 다시 씁니다. (새 글, 빠진 표시 목록)"""
    missing = []
    new = _replace(text, NAV_START, NAV_END, header(active, page_path, where))
    if new is None:
        missing.append("SITE-NAV")
    else:
        text = new
    new = _replace(text, FOOTER_START, FOOTER_END, footer(page_path))
    if new is None:
        missing.append("SITE-FOOTER")
    else:
        text = new
    return text, missing
