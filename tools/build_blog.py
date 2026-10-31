#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""리즈워드 블로그 빌드 도구 / LISWORD blog builder

blog/posts/*.md 글을 읽어 정적 HTML 페이지를 만듭니다.
Python 3.9 표준 라이브러리만 쓰고, 빌드할 때 인터넷에 접속하지 않습니다.

사용법
  python3 tools/build_blog.py            공개 빌드 — status: published 글만 (커밋·배포용)
  python3 tools/build_blog.py --drafts   미리보기 빌드 — 초안까지, 초안 표시 (내 컴퓨터 확인용 · 커밋 금지)
  python3 tools/build_blog.py --check    검사만 — 파일을 쓰지 않습니다 (--drafts 와 함께 쓸 수 있음)

빌드가 만드는 파일 (직접 고치지 마세요 — 다음 빌드 때 덮어씁니다. 목록: blog/.generated.json)
  blog/index.html · blog/category/<분류>/index.html · blog/<글주소>/index.html · blog/feed.xml · blog/latest.js
빌드가 일부만 다시 쓰는 파일
  sitemap.xml (블로그 주소 + 늘 들어가는 페이지 /, /university/, /news.html — 아래 SITE_PAGES)
  index.html (<!-- BLOG-LATEST:START --> 와 END 사이만)

글 형식은 업데이트_메뉴얼.md 7번을 보세요.
"""

import argparse
import datetime as dt
import email.utils
import html
import json
import math
import os
import re
import shutil
import struct
import subprocess
import sys
import unicodedata
from pathlib import Path

# ---------------------------------------------------------------------------
# 경로와 사이트 정보
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = Path(__file__).resolve().parent / "blog_templates"
BLOG_DIR = ROOT / "blog"
POSTS_DIR = BLOG_DIR / "posts"
IMAGES_DIR = BLOG_DIR / "images"
MANIFEST_PATH = BLOG_DIR / ".generated.json"
SIZE_CACHE_PATH = BLOG_DIR / ".imagesizes.json"
SITEMAP_PATH = ROOT / "sitemap.xml"
HOME_PATH = ROOT / "index.html"

SITE = "https://www.lisword.co.kr"
SITE_NAME = "리즈워드 LISWORD"
BLOG_NAME = "리즈워드 블로그"
DEFAULT_AUTHOR = "이인섭"
CHARS_PER_MINUTE = 500            # 읽기 시간: 공백을 뺀 글자 수 ÷ 500, 올림
LATEST_COUNT = 3                  # 홈 화면 "블로그" 칸에 보일 글 수
RELATED_COUNT = 3                 # 글 아래 "관련 글" 수
# [확인 필요: …] 표시 — 이 표시가 남은 글은 공개 빌드가 막습니다.
# 띄어쓰기가 달라도("[ 확인필요"), 전각 괄호("［확인 필요 …］")로 써도 찾습니다.
TODO_RE = re.compile(r"[\[［]\s*확인\s*필요")
KST = dt.timezone(dt.timedelta(hours=9))
HOME_START = "<!-- BLOG-LATEST:START -->"
HOME_END = "<!-- BLOG-LATEST:END -->"

# 사이트맵에 늘 들어가는 블로그 밖 페이지 — (주소, 파일, 바뀌는 주기, 우선순위). 이 순서대로 맨 앞에 씁니다.
# lastmod(고친 날짜)는 다음 날짜 중 가장 늦은 날짜입니다.
#   · sitemap.xml에 지금 적혀 있는 날짜
#   · 그 파일 안 구조화 데이터의 "dateModified" 날짜 (university/index.html에 있습니다 — 페이지를 고치면 이 날짜를 바꾸세요)
#   · 홈(/)만: 가장 최근에 공개한 블로그 글 날짜
SITE_PAGES = [
    ("/", "index.html", "weekly", "1.0"),
    ("/university/", "university/index.html", "monthly", "0.9"),
    ("/news.html", "news.html", "weekly", "0.7"),
]

# 목록 페이지 공유 카드 (사이트 공통 이미지 — index.html과 같은 값)
OG_DEFAULT = {
    "url": SITE + "/og-image.png", "width": 1200, "height": 630,
    "alt": "리즈워드 LISWORD — 대학·기업을 위한 현장형 AI 교육 (바이브코딩 부트캠프 · AI 리터러시 · RAG · AX 전환)",
}
ORGANIZATION = {
    "@type": "Organization",
    "@id": SITE + "/#organization",
    "name": "리즈워드",
    "alternateName": "LISWORD",
    "url": SITE + "/",
    "logo": {"@type": "ImageObject", "url": SITE + "/logo-512.png", "width": 512, "height": 512},
}

# 블로그 첫 화면 문구
BLOG_INDEX = {
    "eyebrow": "BLOG · 블로그",
    "heading": '리즈워드 <em class="accent">블로그</em>.',
    "lead": "리즈워드가 진행한 교육 현장 이야기와 교육·업무에 필요한 AI 소식을 정리합니다.",
    "description": "리즈워드(LISWORD) 블로그입니다. 대학·기업에서 진행한 AI 교육 사례와 교육·HR 담당자를 위한 AI 소식을 정리합니다.",
}
# 홈 화면 "블로그" 칸 문구 (sections/blog.jsx 와 같게 유지)
HOME_BLOCK = {
    "lead": "교육 현장 이야기와 AI 소식을 블로그에 정리합니다.",
}

# 분류 — 순서대로 탭에 보입니다. 주소(cases, ai-news)는 바꾸지 마세요.
CATEGORIES = {
    "cases": {
        "label": "교육 사례",
        "eyebrow": "CASES · 교육 사례",
        "heading": '교육 <em class="accent">사례</em>.',
        "lead": "리즈워드가 대학과 기업에서 진행한 교육을 대상·일정·운영 방식·결과물 중심으로 정리합니다.",
        "description": "리즈워드(LISWORD)가 대학·기업에서 진행한 AI 교육 사례입니다. 교육 대상과 일정, 운영 방식, 결과물을 정리했습니다.",
        "cta_title": "우리 대학·사업단에도 이런 프로그램이 필요하다면",
        "cta_text": "기관의 목적과 대상, 일정·인원에 맞춰 교육을 맞춤 설계하고 운영합니다.",
        "cta_button": "교육 문의하기",
    },
    "ai-news": {
        "label": "AI 소식",
        "eyebrow": "AI NEWS · AI 소식",
        "heading": 'AI <em class="accent">소식</em>.',
        "lead": "교육과 업무에 영향을 주는 AI 소식을 날짜, 원문 링크와 함께 정리합니다.",
        "description": "교육·HR 담당자를 위한 AI 소식입니다. 확인된 발표와 보도를 날짜·원문 링크와 함께 정리하고, 교육·업무에서 할 일을 적습니다.",
        "cta_title": "AI 교육·도입이 궁금하다면",
        "cta_text": "교육이든 구축이든 좋습니다. 필요한 내용과 일정·인원을 남겨 주시면 빠르게 회신드립니다.",
        "cta_button": "상담 신청",
    },
}

REQUIRED_FIELDS = ["title", "slug", "category", "date", "description", "cover", "cover_alt", "status"]
KNOWN_FIELDS = set(REQUIRED_FIELDS) | {"tags", "author"}
STATUSES = ("draft", "published")
RESERVED_SLUGS = {"category", "posts", "images", "tag", "tags", "page", "feed", "drafts", "assets"}
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
IMAGE_NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*\.(?:jpe?g|png|webp|gif)$", re.I)
PHOTO_MAX_BYTES = 400 * 1024          # 사진(JPG) 권장 용량 — 넘으면 주의
PHOTO_HARD_MAX_BYTES = 600 * 1024     # 사진(JPG) 최대 용량 — 넘으면 공개 빌드가 막습니다
GRAPHIC_MAX_BYTES = 350 * 1024        # 그림(PNG 등) 권장 용량 — 넘으면 주의


# ---------------------------------------------------------------------------
# 작은 도구들
# ---------------------------------------------------------------------------
def esc(text):
    return html.escape(str(text), quote=True)


MIDDLE_DOT_RE = re.compile(r"(?<=\S)([·・])(?=\S)")


def typeset(html_text):
    """화면에 보이는 글에서 '검색·수집'처럼 가운뎃점으로 이은 말이 점 앞뒤에서 줄바꿈되지 않게
    단어 연결 문자(U+2060)를 넣습니다. 메타 태그·구조화 데이터·RSS에는 쓰지 않습니다."""
    return MIDDLE_DOT_RE.sub("&#8288;\\1&#8288;", html_text)


def rel(path):
    try:
        return Path(path).resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def dotted(date):
    return date.strftime("%Y.%m.%d")


def iso_time(date):
    return dt.datetime(date.year, date.month, date.day, tzinfo=KST).isoformat()


def json_for_html(data, indent=2):
    """<script> 안에 넣어도 안전한 JSON (<, >, & 를 유니코드 이스케이프)."""
    text = json.dumps(data, ensure_ascii=False, indent=indent)
    return (text.replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
            .replace("\u2028", "\\u2028").replace("\u2029", "\\u2029"))


def display_width(text):
    return sum(2 if unicodedata.east_asian_width(ch) in "WF" else 1 for ch in text)


def pad(text, width):
    return text + " " * max(0, width - display_width(text))


class Problems:
    """오류(빌드 중단)와 주의(알림만)를 모읍니다. 메시지는 한국어 / English 두 줄."""

    def __init__(self):
        self.errors = []
        self.warnings = []

    def error(self, where, ko, en):
        self.errors.append((where, ko, en))

    def warn(self, where, ko, en):
        self.warnings.append((where, ko, en))


class Scoped:
    """한 글에 묶인 기록기.
    soft=True(공개 빌드에서 초안을 검사할 때)이면 빌드를 멈추지 않고 고칠 것 개수만 셉니다 —
    자세한 내용은 --drafts 빌드에서 보입니다."""

    def __init__(self, problems, post, soft):
        self.problems = problems
        self.post = post
        self.soft = soft

    def error(self, line, ko, en):
        if self.soft:
            self.post.soft_issue_count += 1
            return
        self.post.error_count += 1
        self.problems.error(self.post.where(line), ko, en)

    def warn(self, line, ko, en):
        if not self.soft:
            self.problems.warn(self.post.where(line), ko, en)


# ---------------------------------------------------------------------------
# 템플릿 — tools/blog_templates/*.html 의 {{이름}} 자리에 값을 넣습니다.
# {# ... #} 는 설명용 메모로, 결과에는 나오지 않습니다.
# ---------------------------------------------------------------------------
_TEMPLATES = {}
PLACEHOLDER_RE = re.compile(r"\{\{\s*([a-z_][a-z0-9_]*)\s*\}\}")
TEMPLATE_NOTE_RE = re.compile(r"\{#.*?#\}\n?", re.S)


def template(name, **values):
    if name not in _TEMPLATES:
        path = TEMPLATE_DIR / name
        if not path.exists():
            raise SystemExit(f"템플릿 파일이 없습니다: {rel(path)} / Template file missing: {rel(path)}")
        _TEMPLATES[name] = TEMPLATE_NOTE_RE.sub("", path.read_text(encoding="utf-8"))

    def fill(match):
        key = match.group(1)
        if key not in values:
            raise SystemExit(f"템플릿 {name}의 {{{{{key}}}}} 자리에 넣을 값이 없습니다. / "
                             f"Template {name}: no value for {{{{{key}}}}}.")
        return str(values[key])

    return PLACEHOLDER_RE.sub(fill, _TEMPLATES[name])


# ---------------------------------------------------------------------------
# 이미지 — 크기(sips, 캐시: blog/.imagesizes.json)와 메타데이터(EXIF·GPS) 검사
# ---------------------------------------------------------------------------
def _size_from_header(path):
    """sips를 못 쓸 때를 위한 예비 판독기 (PNG·JPEG·GIF·WebP)."""
    data = path.read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", data[16:24])
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return struct.unpack("<HH", data[6:10])
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        chunk = data[12:16]
        if chunk == b"VP8X":
            return (int.from_bytes(data[24:27], "little") + 1, int.from_bytes(data[27:30], "little") + 1)
        if chunk == b"VP8L":
            bits = int.from_bytes(data[21:25], "little")
            return ((bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1)
        if chunk == b"VP8 ":
            w, h = struct.unpack("<HH", data[26:30])
            return (w & 0x3FFF, h & 0x3FFF)
    if data[:2] == b"\xff\xd8":
        i = 2
        while i + 4 <= len(data):
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7 or marker == 0xFF:
                i += 2 if marker != 0xFF else 1
                continue
            length = struct.unpack(">H", data[i + 2:i + 4])[0]
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack(">HH", data[i + 5:i + 9])
                return (w, h)
            i += 2 + length
    raise ValueError("unknown image format")


def read_image_size(path):
    sips = shutil.which("sips") or ("/usr/bin/sips" if Path("/usr/bin/sips").exists() else None)
    if sips:
        try:
            out = subprocess.run([sips, "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
                                 capture_output=True, text=True, timeout=60).stdout
            w = re.search(r"pixelWidth:\s*(\d+)", out)
            h = re.search(r"pixelHeight:\s*(\d+)", out)
            if w and h:
                return int(w.group(1)), int(h.group(1))
        except (OSError, subprocess.SubprocessError):
            pass
    return _size_from_header(path)


def image_metadata(path):
    """사진에 남은 메타데이터 종류를 돌려줍니다 (없으면 빈 목록). GPS 위치정보는 EXIF 안에 들어 있습니다."""
    data = path.read_bytes()
    found = []
    if data[:2] == b"\xff\xd8":
        i = 2
        while i + 4 <= len(data) and data[i] == 0xFF:
            marker = data[i + 1]
            if marker == 0xDA:          # 영상 데이터 시작 — 여기까지만 봅니다
                break
            if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
                i += 2
                continue
            length = struct.unpack(">H", data[i + 2:i + 4])[0]
            payload = data[i + 4:i + 2 + length]
            if marker == 0xE1 and payload.startswith(b"Exif\x00"):
                found.append("EXIF")
            elif marker == 0xE1 and payload.startswith(b"http://ns.adobe.com/xap/"):
                found.append("XMP")
            elif marker == 0xED:
                found.append("IPTC")
            i += 2 + length
    elif data[:8] == b"\x89PNG\r\n\x1a\n":
        i = 8
        while i + 8 <= len(data):
            length = struct.unpack(">I", data[i:i + 4])[0]
            kind = data[i + 4:i + 8]
            if kind == b"eXIf":
                found.append("EXIF")
            elif kind == b"iTXt" and data[i + 8:i + 8 + 17] == b"XML:com.adobe.xmp":
                found.append("XMP")
            if kind == b"IEND":
                break
            i += 12 + length
    return found


class ImageSizes:
    """이미지 크기 캐시. 파일 경로 + 수정 시각(mtime) + 크기(bytes)가 같으면 다시 재지 않습니다."""

    def __init__(self, path):
        self.path = path
        self.entries = {}
        self.used = {}
        try:
            self.entries = json.loads(path.read_text(encoding="utf-8")).get("images", {})
        except (OSError, ValueError, AttributeError):
            self.entries = {}

    def size(self, file_path):
        key = rel(file_path)
        st = file_path.stat()
        entry = self.entries.get(key)
        if not (entry and entry.get("mtime_ns") == st.st_mtime_ns and entry.get("bytes") == st.st_size):
            w, h = read_image_size(file_path)
            entry = {"mtime_ns": st.st_mtime_ns, "bytes": st.st_size, "width": w, "height": h}
        self.used[key] = entry
        return entry["width"], entry["height"]

    def content(self):
        return json.dumps({"note": "이미지 크기 캐시 — tools/build_blog.py가 씁니다. 지워도 됩니다.",
                           "images": dict(sorted(self.used.items()))}, ensure_ascii=False, indent=1) + "\n"


# ---------------------------------------------------------------------------
# 머리말(front matter)
# ---------------------------------------------------------------------------
FIELD_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_-]*)\s*:(.*)$")


def _scalar(raw):
    raw = raw.strip()
    if raw[:1] == '"':
        out, i = [], 1
        while i < len(raw):
            ch = raw[i]
            if ch == "\\" and i + 1 < len(raw):
                out.append({"n": "\n", "t": "\t"}.get(raw[i + 1], raw[i + 1]))
                i += 2
                continue
            if ch == '"':
                return "".join(out)
            out.append(ch)
            i += 1
        return raw[1:]
    if raw[:1] == "'":
        end = raw.find("'", 1)
        while end != -1 and raw[end:end + 2] == "''":
            end = raw.find("'", end + 2)
        body = raw[1:end] if end != -1 else raw[1:]
        return body.replace("''", "'")
    return re.split(r"\s+#", raw, maxsplit=1)[0].strip()


def _inline_list(raw):
    raw = raw.strip()
    close = raw.rfind("]")
    inner = raw[1:close] if close != -1 else raw[1:]
    items, cur, quote = [], [], None
    for ch in inner:
        if quote:
            cur.append(ch)
            if ch == quote:
                quote = None
        elif ch in "\"'":
            quote = ch
            cur.append(ch)
        elif ch == ",":
            items.append("".join(cur))
            cur = []
        else:
            cur.append(ch)
    items.append("".join(cur))
    return [_scalar(x) for x in items if x.strip()]


def split_front_matter(text):
    """(머리말 줄 목록, 본문, 본문 첫 줄 번호) 또는 None."""
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return lines[1:i], "\n".join(lines[i + 1:]), i + 2
    return None


def parse_front_matter(lines, log):
    meta, where = {}, {}
    i = 0
    while i < len(lines):
        line = lines[i]
        lineno = i + 2
        if not line.strip() or line.lstrip().startswith("#"):
            i += 1
            continue
        m = FIELD_RE.match(line)
        if not m:
            log.error(lineno, f"머리말 줄의 형식이 잘못됐습니다: '{line.strip()}' — '항목: 값' 형식으로 써 주세요.",
                      f"Malformed front matter line: '{line.strip()}' (expected 'key: value').")
            i += 1
            continue
        key, raw = m.group(1), m.group(2)
        if key in meta:
            log.error(lineno, f"머리말에 '{key}' 항목이 두 번 있습니다.", f"Front matter field '{key}' appears twice.")
        value = None
        if not _scalar(raw):
            items, j = [], i + 1
            while j < len(lines) and re.match(r"^\s+-\s+", lines[j]):
                items.append(_scalar(re.sub(r"^\s+-\s+", "", lines[j])))
                j += 1
            if items:
                meta[key], where[key] = items, lineno
                i = j
                continue
            value = ""
        elif raw.strip().startswith("["):
            value = _inline_list(raw)
        else:
            value = _scalar(raw)
        meta[key], where[key] = value, lineno
        i += 1
    return meta, where


# ---------------------------------------------------------------------------
# 본문 Markdown — BRIEF의 약속된 형식만 읽습니다.
#   ## / ###, 문단, **굵게**, [링크](주소), ![대체 텍스트](파일 "캡션"), - 목록, 1. 목록, > 인용, ---, 표
# ---------------------------------------------------------------------------
RE_HEADING = re.compile(r"^(#{1,6})\s+(.*?)(?:\s+#+)?\s*$")
RE_HASH_NOSPACE = re.compile(r"^#{2,6}[^#\s]")
RE_UL = re.compile(r"^-\s+(.*)$")
RE_OL = re.compile(r"^(\d{1,9})\.\s+(.*)$")
RE_BAD_BULLET = re.compile(r"^[*+]\s+\S")
RE_RULE = re.compile(r"^-{3,}$")
RE_FENCE = re.compile(r"^(```|~~~)")
RE_IMAGE_LINE = re.compile(r'^!\[(?P<alt>[^\]]*)\]\(\s*(?P<src>[^\s)"]+)(?:\s+"(?P<title>[^"]*)")?\s*\)$')
RE_TABLE_SEP = re.compile(r"^\|?\s*:?-{1,}:?\s*(?:\|\s*:?-{1,}:?\s*)*\|?$")
RE_RAW_HTML = re.compile(r"<!--|</?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?/?>")


def _starts_block(s, inside_paragraph):
    if not s:
        return True
    if RE_HEADING.match(s) or RE_RULE.match(s) or RE_FENCE.match(s):
        return True
    if s.startswith(">") or s.startswith("|") or RE_IMAGE_LINE.match(s):
        return True
    if RE_UL.match(s):
        return True
    m = RE_OL.match(s)
    return bool(m and (not inside_paragraph or m.group(1) == "1"))


def parse_blocks(text, log, first_line):
    lines = text.split("\n")
    blocks = []
    i, n = 0, len(lines)

    def line_no(k):
        return first_line + k

    while i < n:
        s = lines[i].strip()
        if not s:
            i += 1
            continue
        start = i
        if RE_FENCE.match(s):
            log.error(line_no(i), "코드 블록(```)은 쓸 수 없습니다.", "Code fences (```) are not supported.")
            i += 1
            while i < n and not RE_FENCE.match(lines[i].strip()):
                i += 1
            i += 1
            continue
        m = RE_HEADING.match(s)
        if m:
            level, text_ = len(m.group(1)), m.group(2).strip()
            if level == 1:
                log.error(line_no(i), "'# 제목'은 쓰지 않습니다 — 글 제목은 머리말 title이 자동으로 들어갑니다. 소제목은 '## '를 쓰세요.",
                          "Do not use '# ' headings; the title comes from front matter. Use '## ' for sections.")
            elif level > 3:
                log.error(line_no(i), "소제목은 '## '와 '### '까지만 쓸 수 있습니다.", "Only '## ' and '### ' headings are supported.")
            elif not text_:
                log.error(line_no(i), "소제목 글자가 비어 있습니다.", "Empty heading.")
            else:
                blocks.append(("h%d" % level, text_, line_no(i)))
            i += 1
            continue
        if RE_HASH_NOSPACE.match(s):
            log.warn(line_no(i), "'##' 뒤에 띄어쓰기가 없어 소제목이 아닌 문단으로 처리했습니다. 소제목이면 '## 소제목'처럼 한 칸 띄우세요.",
                     "'##' without a space is treated as text. Write '## Heading' for a heading.")
        if RE_RULE.match(s):
            blocks.append(("hr", None, line_no(i)))
            i += 1
            continue
        if s.startswith(">"):
            paras, cur = [], []
            while i < n and lines[i].strip().startswith(">"):
                q = re.sub(r"^\s*>\s?", "", lines[i]).strip()
                if q:
                    cur.append(q)
                elif cur:
                    paras.append("\n".join(cur))
                    cur = []
                i += 1
            if cur:
                paras.append("\n".join(cur))
            blocks.append(("quote", paras, line_no(start)))
            continue
        if s.startswith("|"):
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append((line_no(i), lines[i].strip()))
                i += 1
            blocks.append(("table", rows, line_no(start)))
            continue
        m = RE_IMAGE_LINE.match(s)
        if m:
            blocks.append(("image", m.groupdict(), line_no(i)))
            i += 1
            continue
        if s.startswith("!["):
            log.error(line_no(i), '이미지 줄의 형식이 잘못됐습니다. 한 줄에 이미지 하나만 ![대체 텍스트](파일이름.jpg "캡션") 형식으로 써 주세요.',
                      'Malformed image line. Use one image per line: ![alt](file.jpg "caption").')
            i += 1
            continue
        if RE_BAD_BULLET.match(s):
            log.error(line_no(i), "목록은 '- '(하이픈 + 띄어쓰기)로 시작해 주세요. '*', '+' 목록은 쓰지 않습니다.",
                      "Start list items with '- ' (hyphen + space); '*' and '+' bullets are not supported.")
            i += 1
            continue
        if RE_UL.match(s) or RE_OL.match(s):
            ordered = bool(RE_OL.match(s)) and not RE_UL.match(s)
            item_re = RE_OL if ordered else RE_UL
            first_number = int(RE_OL.match(s).group(1)) if ordered else 1
            items = []
            while i < n:
                raw_line = lines[i]
                s2 = raw_line.strip()
                if not s2:
                    j = i + 1
                    while j < n and not lines[j].strip():
                        j += 1
                    if j < n and lines[j][:1] not in (" ", "\t") and item_re.match(lines[j].strip()):
                        i = j
                        continue
                    break
                indented = raw_line[:1] in (" ", "\t")
                mm = item_re.match(s2)
                if mm and not indented:
                    items.append([mm.group(mm.lastindex), line_no(i)])
                    i += 1
                    continue
                if indented and (RE_UL.match(s2) or RE_OL.match(s2) or RE_BAD_BULLET.match(s2)):
                    log.error(line_no(i), "목록 안에 들여 쓴 목록(중첩 목록)은 쓸 수 없습니다. 한 단계 목록으로 풀어 써 주세요.",
                              "Nested (indented) lists are not supported.")
                    i += 1
                    continue
                if not indented and _starts_block(s2, True):
                    break
                if items:
                    items[-1][0] += "\n" + s2
                i += 1
            blocks.append(("ol" if ordered else "ul", {"items": items, "start": first_number}, line_no(start)))
            continue
        para = []
        while i < n:
            s2 = lines[i].strip()
            if not s2 or (para and _starts_block(s2, True)):
                break
            para.append(s2)
            i += 1
        blocks.append(("p", "\n".join(para), line_no(start)))
    return blocks


def _split_cells(row):
    s = row.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|") and not s.endswith("\\|"):
        s = s[:-1]
    cells, cur, i = [], [], 0
    while i < len(s):
        if s[i] == "\\" and i + 1 < len(s) and s[i + 1] == "|":
            cur.append("|")
            i += 2
            continue
        if s[i] == "|":
            cells.append("".join(cur).strip())
            cur = []
        else:
            cur.append(s[i])
        i += 1
    cells.append("".join(cur).strip())
    return cells


def _matching(text, start, open_ch, close_ch):
    depth = 0
    for k in range(start, len(text)):
        if text[k] == open_ch:
            depth += 1
        elif text[k] == close_ch:
            depth -= 1
            if depth == 0:
                return k
    return -1


def _todo_close(text, start):
    """확인 필요 표시의 닫는 괄호 위치. [ … ] 와 ［ … ］ 를 모두 받고, 둘이 섞여 있어도 찾습니다. 없으면 -1."""
    pairs = {"[": "]", "［": "］"}
    k = _matching(text, start, text[start], pairs[text[start]])
    if k == -1:
        for close_ch in ("]", "］"):
            j = text.find(close_ch, start + 1)
            if j != -1 and (k == -1 or j < k):
                k = j
    return k


class Renderer:
    """한 글의 본문을 HTML로 바꿉니다. 오류는 log에 모읍니다."""

    def __init__(self, post, ctx, log):
        self.post = post
        self.ctx = ctx
        self.log = log
        self.line = post.body_line
        self.section = ""

    # ----- 인라인 -----
    def inline(self, text, line):
        self.line = line
        bad = RE_RAW_HTML.search(text)
        if bad:
            self.log.error(line, f"본문에 HTML 태그처럼 보이는 글자가 있습니다: {bad.group(0)[:40]} — HTML은 쓸 수 없습니다. 꺾쇠(< >)가 필요하면 「 」나 ‘ ’로 바꿔 주세요.",
                           f"Raw HTML is not allowed in Markdown: {bad.group(0)[:40]}")
        if "![" in text:
            self.log.error(line, "이미지는 문단 안에 넣을 수 없습니다. 이미지 줄을 따로 떼어 한 줄에 하나만 써 주세요.",
                           "Images must stand alone on their own line, not inside text.")
        return self._inline(text)

    def _inline(self, text):
        out, buf = [], []
        i, n = 0, len(text)

        def flush():
            if buf:
                out.append(typeset(esc("".join(buf))))
                buf.clear()

        while i < n:
            if text.startswith("**", i):
                j = text.find("**", i + 2)
                if j > i + 2:
                    flush()
                    out.append("<strong>" + self._inline(text[i + 2:j]) + "</strong>")
                    i = j + 2
                    continue
            if text[i] == "[":
                close = _matching(text, i, "[", "]")
                if close != -1 and close + 1 < n and text[close + 1] == "(":
                    end = _matching(text, close + 1, "(", ")")
                    if end != -1:
                        flush()
                        label = self._inline(text[i + 1:close])
                        out.append(self.link(label, text[close + 2:end].strip()))
                        i = end + 1
                        continue
            if text[i] in "[［" and TODO_RE.match(text, i):
                close = _todo_close(text, i)
                if close != -1:
                    flush()
                    inner = self._inline(text[i + 1:close])
                    marked = esc(text[i]) + inner + esc(text[close])
                    out.append('<mark class="todo-mark">' + marked + "</mark>" if self.ctx.drafts else marked)
                    i = close + 1
                    continue
            buf.append(text[i])
            i += 1
        flush()
        return "".join(out)

    def link(self, label, url):
        line = self.line
        if url.startswith("<") and url.endswith(">"):
            url = url[1:-1].strip()
        if not url or re.search(r"\s", url):
            self.log.error(line, f"링크 주소가 비었거나 띄어쓰기가 들어 있습니다: ({url})", f"Empty link URL or URL with spaces: ({url})")
            return label
        low = url.lower()
        if low.startswith(SITE.lower()):
            rest = url[len(SITE):]
            if rest == "" or rest[:1] in "/#?":
                return self.internal(label, rest or "/")
        if low.startswith("https://") or low.startswith("http://"):
            if low.startswith("http://"):
                self.log.warn(line, f"http:// 링크입니다. 가능하면 https:// 주소를 쓰세요: {url}", f"Insecure http:// link: {url}")
            return f'<a href="{esc(url)}" target="_blank" rel="noopener">{label}</a>'
        if low.startswith("mailto:") or low.startswith("tel:") or url.startswith("#"):
            return f'<a href="{esc(url)}">{label}</a>'
        if url.startswith("/"):
            return self.internal(label, url)
        self.log.error(line, f"링크 주소는 https:// 로 시작하는 바깥 주소나 /blog/글주소/ 같은 사이트 안 주소만 쓸 수 있습니다: {url}",
                       f"Links must be absolute https:// URLs or site paths starting with '/': {url}")
        return label

    def internal(self, label, url):
        line = self.line
        path, sep, frag = url.partition("#")
        path = path.split("?")[0]
        if path == "/blog":
            path = "/blog/"
        if path.startswith("/blog/") and path != "/blog/":
            m_cat = re.fullmatch(r"/blog/category/([a-z0-9-]+)/?", path)
            m_post = re.fullmatch(r"/blog/([a-z0-9-]+)/?", path)
            if m_cat:
                if m_cat.group(1) not in CATEGORIES:
                    self.log.error(line, f"없는 분류로 연결됩니다: {url}", f"Link to an unknown category: {url}")
                    return label
                path = f"/blog/category/{m_cat.group(1)}/"
            elif m_post:
                slug = m_post.group(1)
                if slug not in self.ctx.all_slugs:
                    self.log.error(line, f"없는 글로 연결됩니다: {url} (blog/posts/{slug}.md 파일이 없습니다)",
                                   f"Link to a post that does not exist: {url}")
                    return label
                if slug not in self.ctx.built_slugs:
                    self.log.warn(line, f"링크한 글({slug})이 아직 공개 전이라, 이번 빌드에서는 링크 없이 글자만 보입니다. 그 글을 공개하고 다시 빌드하면 링크가 생깁니다.",
                                  f"Linked post '{slug}' is not published; the link text is shown without a link.")
                    return label
                if not path.endswith("/"):
                    self.log.warn(line, f"블로그 링크 끝에 / 를 붙여 주세요 (자동으로 붙였습니다): {url}",
                                  f"Blog links should end with '/': {url} (fixed automatically)")
                path = f"/blog/{slug}/"
            elif path not in ("/blog/feed.xml",):
                self.log.error(line, f"블로그 안의 없는 주소로 연결됩니다: {url}", f"Link to an unknown blog path: {url}")
                return label
        elif path not in ("/", "/blog/"):
            target = ROOT / path.lstrip("/")
            if not (target.exists() or (target / "index.html").exists()):
                self.log.warn(line, f"사이트 안에 없는 주소일 수 있습니다: {url}", f"Site path may not exist: {url}")
        href = path + (sep + frag if sep else "")
        return f'<a href="{esc(href)}">{label}</a>'

    # ----- 블록 -----
    def todo(self, *texts):
        return self.ctx.drafts and any(TODO_RE.search(t or "") for t in texts)

    def cls(self, *texts, base=""):
        names = [base] if base else []
        if self.todo(*texts):
            names.append("todo")
        return f' class="{" ".join(names)}"' if names else ""

    def render(self, blocks):
        parts = []
        for kind, data, line in blocks:
            if kind in ("h2", "h3"):
                if kind == "h2":   # 표의 이름(aria-label)으로 쓸 소제목 — Markdown 기호는 뺍니다
                    self.section = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", data).replace("**", "")
                parts.append(f"<{kind}{self.cls(data)}>{self.inline(data, line)}</{kind}>")
            elif kind == "p":
                parts.append(f"<p{self.cls(data)}>{self.inline(data, line)}</p>")
            elif kind == "hr":
                parts.append("<hr />")
            elif kind == "quote":
                inner = "\n".join(f"<p>{self.inline(p, line)}</p>" for p in data)
                parts.append(f"<blockquote{self.cls(*data)}>\n{inner}\n</blockquote>")
            elif kind in ("ul", "ol"):
                items = "\n".join(f"<li{self.cls(t)}>{self.inline(t, ln)}</li>" for t, ln in data["items"])
                start = f' start="{data["start"]}"' if kind == "ol" and data["start"] != 1 else ""
                parts.append(f"<{kind}{start}>\n{items}\n</{kind}>")
            elif kind == "table":
                parts.append(self.table(data, line))
            elif kind == "image":
                parts.append(self.figure(data, line))
        return "\n".join(p for p in parts if p)

    def table(self, rows, line):
        if len(rows) < 2 or not RE_TABLE_SEP.match(rows[1][1]):
            self.log.error(line, "표의 두 번째 줄은 |---|---| 처럼 칸을 나누는 줄이어야 합니다.",
                           "The second table row must be a separator like |---|---|.")
            return ""
        header = _split_cells(rows[0][1])
        aligns = []
        for spec in _split_cells(rows[1][1]):
            spec = spec.strip()
            aligns.append("c" if spec.startswith(":") and spec.endswith(":") else "r" if spec.endswith(":") else "")
        if len(aligns) != len(header):
            self.log.error(rows[1][0], "표의 나누는 줄(|---|) 칸 수가 머리줄과 다릅니다.", "Table separator column count differs from the header.")
            return ""

        def cell(tag, text, k, ln, extra=""):
            names = []
            if aligns[k]:
                names.append("ta-" + aligns[k])
            if self.todo(text):
                names.append("todo")
            attr = f' class="{" ".join(names)}"' if names else ""
            return f"<{tag}{extra}{attr}>{self.inline(text, ln)}</{tag}>"

        head = "".join(cell("th", t, k, rows[0][0], ' scope="col"') for k, t in enumerate(header))
        body = []
        for ln, row in rows[2:]:
            cells = _split_cells(row)
            if len(cells) > len(header):
                self.log.error(ln, f"표의 이 줄은 칸이 {len(cells)}개로, 머리줄({len(header)}칸)보다 많습니다.",
                               f"Table row has {len(cells)} cells but the header has {len(header)}.")
                cells = cells[:len(header)]
            elif len(cells) < len(header):
                self.log.warn(ln, f"표의 이 줄은 칸이 {len(cells)}개라 빈칸을 채웠습니다 (머리줄 {len(header)}칸).",
                              f"Table row has fewer cells ({len(cells)}) than the header ({len(header)}); padded.")
                cells += [""] * (len(header) - len(cells))
            body.append("<tr>" + "".join(cell("td", t, k, ln) for k, t in enumerate(cells)) + "</tr>")
        label = f"표: {self.section}" if self.section else "표"
        return (f'<div class="table-wrap" role="region" aria-label="{esc(label)}" tabindex="0">\n<table>\n'
                f"<thead><tr>{head}</tr></thead>\n<tbody>\n" + "\n".join(body) + "\n</tbody>\n</table>\n</div>")

    def figure(self, data, line):
        alt = (data.get("alt") or "").strip()
        src = (data.get("src") or "").strip()
        caption = (data.get("title") or "").strip()
        self.line = line
        if RE_RAW_HTML.search(alt):
            self.log.error(line, "이미지 대체 텍스트에 HTML이 있습니다.", "Raw HTML in image alt text.")
        info = self.post.image(src, line, self.log, self.ctx)
        if not alt:
            self.log.error(line, f"이미지에 대체 텍스트가 없습니다: {src} — ![사진을 설명하는 문장]({src}) 처럼 [ ] 안을 채워 주세요.",
                           f"Image without alt text: {src}")
        if not info:
            return ""
        url, w, h = info
        cap = f"\n<figcaption>{self.inline(caption, line)}</figcaption>" if caption else ""
        # 사진을 누르면 원본 크기 파일이 새 창으로 열립니다
        return (f'<figure class="post-figure{" todo" if self.todo(alt, caption) else ""}">'
                f'<a class="post-figure-link" href="{esc(url)}" target="_blank" rel="noopener">'
                f'<img src="{esc(url)}" alt="{esc(alt)}" width="{w}" height="{h}" loading="lazy" decoding="async" />'
                f'<span class="sr-only"> 원본 크기로 보기 (새 창)</span></a>{cap}\n</figure>')


# ---------------------------------------------------------------------------
# 글 한 편
# ---------------------------------------------------------------------------
class Post:
    def __init__(self, path):
        self.path = path
        self.rel = rel(path)
        self.file_slug = path.stem
        self.meta = {}
        self.meta_line = {}
        self.raw = ""
        self.body = ""
        self.body_line = 1
        self.blocks = []
        self.used_images = []
        self.error_count = 0
        self.soft_issue_count = 0
        self.body_html = ""
        self.chars = 0
        self.cover_info = None

    def where(self, line=None):
        return f"{self.rel}:{line}" if line else self.rel

    # 머리말 값
    @property
    def slug(self):
        # 주소는 언제나 글 파일 이름으로 정합니다. 머리말 slug는 파일 이름과 같은지만 검사합니다.
        return self.file_slug

    @property
    def title(self):
        return self.meta.get("title", "")

    @property
    def category(self):
        return self.meta.get("category", "")

    @property
    def status(self):
        return self.meta.get("status", "")

    @property
    def description(self):
        return self.meta.get("description", "")

    @property
    def author(self):
        return self.meta.get("author") or DEFAULT_AUTHOR

    @property
    def tags(self):
        tags = self.meta.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",")]
        return [t for t in tags if t]

    @property
    def is_draft(self):
        return self.status != "published"

    @property
    def url(self):
        return f"/blog/{self.slug}/"

    @property
    def abs_url(self):
        return SITE + self.url

    @property
    def cat(self):
        return CATEGORIES.get(self.category, {"label": self.category})

    @property
    def minutes(self):
        return max(1, math.ceil(self.chars / CHARS_PER_MINUTE))

    def image(self, name, line, log, ctx):
        """이미지 파일 이름 → (주소, 너비, 높이). 문제가 있으면 log에 적고 None.
        사진 폴더는 글 파일 이름(= slug)으로 찾습니다: blog/images/<글 파일 이름>/"""
        folder = self.file_slug
        if re.match(r"^[a-z]+://", name, re.I):
            log.error(line, f"바깥 사이트의 이미지는 쓸 수 없습니다: {name} — 사진을 blog/images/{folder}/ 에 넣고 파일 이름만 쓰세요.",
                      f"External images are not allowed: {name}")
            return None
        if not IMAGE_NAME_RE.match(name):
            log.error(line, f"이미지 파일 이름은 영문·숫자·하이픈(-)·밑줄(_)·점만 쓰고, jpg·png·webp·gif 여야 합니다: {name}",
                      f"Image file names must be ASCII letters/digits/-/_ with a jpg/png/webp/gif extension: {name}")
            return None
        path = IMAGES_DIR / folder / name
        if not path.is_file():
            log.error(line, f"이미지 파일이 없습니다: blog/images/{folder}/{name}", f"Image file not found: blog/images/{folder}/{name}")
            return None
        try:
            w, h = ctx.sizes.size(path)
        except (OSError, ValueError, struct.error):
            log.error(line, f"이미지 크기를 읽을 수 없습니다 (손상된 파일일 수 있습니다): {name}", f"Cannot read image size: {name}")
            return None
        if name not in self.used_images:
            self.used_images.append(name)
            meta = image_metadata(path)
            if meta:
                msg = (f"사진에 메타데이터({', '.join(meta)})가 남아 있습니다 — 위치정보(GPS)가 들어 있을 수 있습니다: blog/images/{folder}/{name}. "
                       f"메타데이터를 지운 뒤 다시 빌드하세요 (Claude에게 \"블로그 사진 위치정보 지워줘\"라고 하면 됩니다).")
                en = f"Image still contains {', '.join(meta)} metadata (possible GPS location): {name}. Strip it before publishing."
                if ctx.drafts or self.is_draft:
                    log.warn(line, msg, en)
                else:
                    log.error(line, msg, en)
            size = path.stat().st_size
            is_photo = name.lower().endswith((".jpg", ".jpeg"))
            limit = PHOTO_MAX_BYTES if is_photo else GRAPHIC_MAX_BYTES
            kb = math.ceil(size / 1024)          # 올림 — 600KB를 조금 넘는 사진이 "600KB"로 보이지 않게
            if is_photo and size > PHOTO_HARD_MAX_BYTES:
                msg = (f"사진 용량이 너무 큽니다 ({kb}KB — 최대 {PHOTO_HARD_MAX_BYTES // 1024}KB, 권장 {PHOTO_MAX_BYTES // 1024}KB 이하): "
                       f"blog/images/{folder}/{name}. 사진을 줄인 뒤 다시 빌드하세요 (Claude에게 \"블로그 사진 줄여줘\"라고 하면 됩니다).")
                en = f"Photo too large ({kb} KB, max {PHOTO_HARD_MAX_BYTES // 1024} KB): {name}. Resize it before publishing."
                if ctx.drafts or self.is_draft:
                    log.warn(line, msg + " 공개 빌드에서는 막힙니다.", en + " The production build will refuse it.")
                else:
                    log.error(line, msg, en)
            elif size > limit:
                log.warn(line, f"이미지 용량이 큽니다 ({kb}KB, 권장 {limit // 1024}KB 이하): {name}",
                         f"Large image ({kb} KB, recommended <= {limit // 1024} KB): {name}")
        return f"/blog/images/{folder}/{name}", w, h


def load_post(path, problems, ctx):
    post = Post(path)
    try:
        post.raw = path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")
    except UnicodeDecodeError:
        problems.error(post.rel, "글 파일을 UTF-8로 읽을 수 없습니다.", "Post file is not valid UTF-8.")
        post.error_count += 1
        return post
    parts = split_front_matter(post.raw)
    hard = Scoped(problems, post, soft=False)
    if parts is None:
        hard.error(1, "글 맨 위에 --- 로 시작하고 --- 로 끝나는 머리말이 없습니다.",
                   "Missing front matter block (--- ... ---) at the top of the file.")
        return post
    fm_lines, post.body, post.body_line = parts
    post.meta, post.meta_line = parse_front_matter(fm_lines, hard)
    status = post.meta.get("status")
    if status not in STATUSES:
        hard.error(post.meta_line.get("status"), f"status는 draft 또는 published 여야 합니다 (지금: '{status or ''}').",
                   f"status must be 'draft' or 'published' (got '{status or ''}').")
        post.meta["status"] = "draft"
    return post


def validate_post(post, ctx, problems):
    """머리말·이미지 검사. 공개 빌드에서 초안은 soft(주의만)로 검사합니다."""
    soft = post.is_draft and not ctx.drafts
    log = Scoped(problems, post, soft)
    meta, ln = post.meta, post.meta_line
    for key in REQUIRED_FIELDS:
        if key == "status":
            continue
        value = meta.get(key)
        if value is None or (isinstance(value, str) and not value.strip()) or isinstance(value, list):
            log.error(ln.get(key), f"머리말에 '{key}' 값이 없습니다.", f"Front matter field '{key}' is missing or empty.")
    for key in meta:
        if key not in KNOWN_FIELDS:
            log.warn(ln.get(key), f"머리말의 '{key}'는 쓰지 않는 항목입니다 (오타인지 확인하세요). 쓸 수 있는 항목: {', '.join(REQUIRED_FIELDS + ['tags', 'author'])}",
                     f"Unknown front matter field '{key}'.")
    slug = meta.get("slug", "")
    if not SLUG_RE.match(post.file_slug):
        log.error(None, f"글 파일 이름은 영문 소문자·숫자·하이픈(-)만 쓸 수 있습니다: {post.path.name}",
                  f"Post file names must be lowercase ASCII letters, digits and hyphens: {post.path.name}")
    if isinstance(slug, str) and slug and slug != post.file_slug:
        log.error(ln.get("slug"), f"slug('{slug}')가 파일 이름('{post.file_slug}')과 다릅니다. 둘을 똑같이 맞춰 주세요.",
                  f"slug '{slug}' must equal the file name '{post.file_slug}'.")
    if post.file_slug in RESERVED_SLUGS:
        log.error(ln.get("slug"), f"'{post.file_slug}'는 블로그가 쓰는 주소라 글 주소로 쓸 수 없습니다.", f"'{post.file_slug}' is a reserved slug.")
    category = meta.get("category", "")
    if category and category not in CATEGORIES:
        log.error(ln.get("category"), f"category는 {' 또는 '.join(CATEGORIES)} 중 하나여야 합니다 (지금: '{category}').",
                  f"category must be one of {', '.join(CATEGORIES)} (got '{category}').")
    date_text = meta.get("date", "")
    post.date = dt.date(1970, 1, 1)
    if isinstance(date_text, str) and date_text:
        try:
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_text):
                raise ValueError
            post.date = dt.datetime.strptime(date_text, "%Y-%m-%d").date()
            if post.date > dt.date.today() + dt.timedelta(days=1):
                log.warn(ln.get("date"), f"날짜가 미래입니다: {date_text}", f"Date is in the future: {date_text}")
        except ValueError:
            log.error(ln.get("date"), f"date는 2026-07-09 같은 YYYY-MM-DD 형식의 실제 날짜여야 합니다 (지금: '{date_text}').",
                      f"date must be a real YYYY-MM-DD date (got '{date_text}').")
    title = meta.get("title", "")
    if isinstance(title, str) and len(title) > 60:
        log.warn(ln.get("title"), f"제목이 깁니다 ({len(title)}자). 검색 결과에서 잘릴 수 있습니다 (권장 28~40자).",
                 f"Long title ({len(title)} chars).")
    desc = meta.get("description", "")
    if isinstance(desc, str) and desc and not (50 <= len(desc) <= 160):
        log.warn(ln.get("description"), f"description 길이가 {len(desc)}자입니다 (권장 80~130자).",
                 f"description is {len(desc)} chars (recommended 80-130).")
    for key in ("title", "description", "cover_alt", "author"):
        value = meta.get(key)
        if isinstance(value, str) and RE_RAW_HTML.search(value):
            log.error(ln.get(key), f"머리말 '{key}'에 HTML이 있습니다.", f"Raw HTML in front matter field '{key}'.")
    cover = meta.get("cover", "")
    if isinstance(cover, str) and cover:
        post.cover_info = post.image(cover, ln.get("cover"), log, ctx)
        if post.cover_info:
            _, w, h = post.cover_info
            if w < 1600 or h < 900 or abs(w / h - 16 / 9) > 0.02:
                log.warn(ln.get("cover"), f"대표 이미지는 16:9, 1600×900 이상을 권장합니다 (지금 {w}×{h}). 목록에서는 16:9로 잘려 보입니다.",
                         f"Cover should be 16:9 and at least 1600x900 (got {w}x{h}).")
    return log


def render_post(post, ctx, problems):
    soft = post.is_draft and not ctx.drafts
    log = Scoped(problems, post, soft)
    post.blocks = parse_blocks(post.body, log, post.body_line)
    renderer = Renderer(post, ctx, log)
    post.body_html = renderer.render(post.blocks)
    if not any(kind == "image" for kind, _, _ in post.blocks):
        log.error(None, "본문에 이미지가 하나도 없습니다. 대표 이미지 말고 본문 사진·그림을 1장 이상 넣어 주세요.",
                  "The body has no image; add at least one inline image besides the cover.")
    if not any(kind in ("p", "ul", "ol") for kind, _, _ in post.blocks):
        log.error(None, "본문 글이 없습니다.", "The post has no body text.")
    text = re.sub(r"<[^>]+>", "", post.body_html)
    post.chars = len(re.sub(r"[\s\u2060]+", "", html.unescape(text)))
    # 사진 폴더에 있지만 쓰지 않은 파일
    folder = IMAGES_DIR / post.file_slug
    if folder.is_dir():
        for f in sorted(folder.iterdir()):
            if f.is_file() and not f.name.startswith(".") and f.name not in post.used_images:
                log.warn(None, f"쓰지 않는 이미지가 폴더에 있습니다: blog/images/{post.file_slug}/{f.name}",
                         f"Unused image in folder: blog/images/{post.file_slug}/{f.name}")
    # 확인 필요 표시
    post.todo_count = len(TODO_RE.findall(post.raw))
    if post.todo_count and not post.is_draft:
        if ctx.drafts:
            problems.warn(post.where(), f"공개(published) 글에 [확인 필요] 표시가 {post.todo_count}개 남아 있습니다. 공개 빌드에서는 막힙니다.",
                          f"Published post still has {post.todo_count} [확인 필요] marker(s); the production build will refuse it.")
        else:
            problems.error(post.where(), f"공개(published) 글에 [확인 필요] 표시가 {post.todo_count}개 남아 있습니다. 모두 확인해서 지우거나 사실로 바꾼 뒤 다시 빌드하세요. (계속 초안으로 두려면 status: draft)",
                           f"Published post still contains {post.todo_count} '[확인 필요' marker(s). Resolve them or set status: draft.")
            post.error_count += 1


# ---------------------------------------------------------------------------
# 페이지 조각
# ---------------------------------------------------------------------------
def card_html(post, ctx, heading_tag, eager):
    _, w, h = post.cover_info or ("", 1600, 900)
    cover_url = post.cover_info[0] if post.cover_info else ""
    draft = ctx.drafts and post.is_draft
    return template(
        "card.html",
        card_class=" is-draft" if draft else "",
        url=esc(post.url),
        cover=esc(cover_url),
        width=w, height=h,
        loading="eager" if eager else "lazy",
        category=esc(post.cat["label"]),
        draft_tag='<span class="draft-tag">초안</span>' if draft else "",
        date_iso=post.date.isoformat(),
        date=dotted(post.date),
        htag=heading_tag,
        title=typeset(esc(post.title)),
        description=typeset(esc(post.description)),
    ).strip("\n")


def social_meta(kind, title, description, url, image, extra=()):
    lines = [
        f'<meta property="og:type" content="{kind}" />',
        f'<meta property="og:site_name" content="{esc(SITE_NAME)}" />',
        '<meta property="og:locale" content="ko_KR" />',
        f'<meta property="og:url" content="{esc(url)}" />',
        f'<meta property="og:title" content="{esc(title)}" />',
        f'<meta property="og:description" content="{esc(description)}" />',
        f'<meta property="og:image" content="{esc(image["url"])}" />',
        f'<meta property="og:image:width" content="{image["width"]}" />',
        f'<meta property="og:image:height" content="{image["height"]}" />',
        f'<meta property="og:image:alt" content="{esc(image["alt"])}" />',
    ]
    lines += list(extra)
    lines += [
        '<meta name="twitter:card" content="summary_large_image" />',
        f'<meta name="twitter:title" content="{esc(title)}" />',
        f'<meta name="twitter:description" content="{esc(description)}" />',
        f'<meta name="twitter:image" content="{esc(image["url"])}" />',
        f'<meta name="twitter:image:alt" content="{esc(image["alt"])}" />',
    ]
    return "\n".join("  " + line for line in lines)


def breadcrumb_ld(items):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": k + 1, "name": name, "item": url} for k, (name, url) in enumerate(items)
        ],
    }


def page_html(ctx, *, title, description, path, robots, social, json_ld, main, draft_note, blog_current):
    banner = ""
    if draft_note:
        banner = f'  <div class="draft-banner" role="note">{esc(draft_note)}</div>\n'
    return template(
        "page.html",
        title=esc(title),
        description=esc(description),
        canonical=esc(SITE + path),
        robots=robots,
        social_meta=social,
        json_ld=json_for_html({"@context": "https://schema.org", "@graph": json_ld}),
        body_class=" has-draft-banner" if draft_note else "",
        draft_banner=banner,
        blog_current=' aria-current="page"' if blog_current else "",
        main=main,
    )


def list_page(ctx, posts, counts, category=None):
    is_index = category is None
    info = BLOG_INDEX if is_index else CATEGORIES[category]
    path = "/blog/" if is_index else f"/blog/category/{category}/"
    label = BLOG_NAME if is_index else info["label"]
    title = "블로그 | 리즈워드 LISWORD" if is_index else f"{info['label']} | {BLOG_NAME}"

    tabs = []
    for key, name, href, count in [(None, "전체", "/blog/", counts["all"])] + [
            (k, c["label"], f"/blog/category/{k}/", counts[k]) for k, c in CATEGORIES.items()]:
        current = ' aria-current="page"' if key == category else ""
        tabs.append(f'        <a class="blog-tab" href="{href}"{current}>{esc(name)} '
                    f'<span class="blog-tab-count">{count}<span class="sr-only">편</span></span></a>')

    if posts:
        cards = "\n".join(card_html(p, ctx, "h2", eager=k < 3) for k, p in enumerate(posts))
        items = f'      <div class="post-grid">\n{cards}\n      </div>'
    else:
        if is_index or counts["all"] == 0:
            empty_title = "아직 공개된 글이 없습니다." if is_index else f"아직 {info['label']} 글이 없습니다."
            empty_text = "교육 현장 이야기와 AI 소식을 준비하고 있습니다. 그동안 진행한 교육은 홈페이지의 사례에서 보실 수 있습니다."
            empty_href, empty_button = "/#portfolio", "진행했던 교육 보기"
        else:
            empty_title = f"아직 {info['label']} 글이 없습니다."
            empty_text = "다른 분류의 글은 블로그 첫 화면에서 보실 수 있습니다."
            empty_href, empty_button = "/blog/", "블로그 전체 보기"
        items = template("empty.html", title=esc(empty_title), text=typeset(esc(empty_text)),
                         href=empty_href, button=esc(empty_button)).strip("\n")

    main = template(
        "list.html",
        eyebrow=esc(BLOG_INDEX["eyebrow"]),
        heading=info["heading"],
        lead=typeset(esc(info["lead"])),
        tabs="\n".join(tabs),
        list_label=esc(f"{label} 글 목록"),
        items=items,
    ).rstrip("\n")

    crumbs = [("홈", SITE + "/"), ("블로그", SITE + "/blog/")]
    if is_index:
        node = {
            "@type": "Blog", "@id": SITE + "/blog/#blog", "name": BLOG_NAME, "url": SITE + "/blog/",
            "description": info["description"], "inLanguage": "ko-KR", "publisher": ORGANIZATION,
            "blogPost": [
                {"@type": "BlogPosting", "headline": p.title, "url": p.abs_url, "datePublished": iso_time(p.date),
                 "image": SITE + p.cover_info[0] if p.cover_info else None}
                for p in posts
            ],
        }
    else:
        crumbs.append((info["label"], SITE + path))
        node = {
            "@type": "CollectionPage", "@id": SITE + path, "url": SITE + path, "name": title,
            "description": info["description"], "inLanguage": "ko-KR",
            "isPartOf": {"@type": "Blog", "@id": SITE + "/blog/#blog", "name": BLOG_NAME, "url": SITE + "/blog/"},
            "mainEntity": {"@type": "ItemList", "itemListElement": [
                {"@type": "ListItem", "position": k + 1, "url": p.abs_url, "name": p.title} for k, p in enumerate(posts)
            ]},
        }
    drafts_here = [p for p in posts if p.is_draft]
    note = f"초안 미리보기 — 공개 전 검토용입니다 · 초안 {len(drafts_here)}편 포함" if (ctx.drafts and drafts_here) else ""
    robots = "noindex,nofollow" if note else ("index,follow" if posts else "noindex,follow")
    return page_html(
        ctx, title=title, description=info["description"], path=path, robots=robots,
        social=social_meta("website", title, info["description"], SITE + path, OG_DEFAULT),
        json_ld=[_clean(node), breadcrumb_ld(crumbs)], main=main, draft_note=note, blog_current=is_index,
    )


def _clean(node):
    """JSON-LD에서 값이 None인 항목을 뺍니다."""
    if isinstance(node, dict):
        return {k: _clean(v) for k, v in node.items() if v is not None}
    if isinstance(node, list):
        return [_clean(v) for v in node]
    return node


def post_page(ctx, post, related):
    cat = CATEGORIES[post.category]
    cover_url, w, h = post.cover_info
    tags = ""
    if post.tags:
        chips = "".join(f"<li>#{esc(t)}</li>" for t in post.tags)
        tags = f'\n      <ul class="post-tags" aria-label="태그">{chips}</ul>'
    cta = template(
        "cta.html",
        cta_title=typeset(esc(cat["cta_title"])),
        cta_text=typeset(esc(cat["cta_text"])),
        cta_button=esc(cat["cta_button"]),
        slug=post.slug,
        category=post.category,
    ).strip("\n")
    if related:
        cards = "\n".join(card_html(p, ctx, "h3", eager=False) for p in related)
        related_html = template("related.html", category_url=f"/blog/category/{post.category}/",
                                category=esc(cat["label"]), cards=cards).rstrip("\n")
    else:
        related_html = template("more.html").rstrip("\n")
    body = "\n".join("        " + line if line else "" for line in post.body_html.split("\n"))
    main = template(
        "post.html",
        category_url=f"/blog/category/{post.category}/",
        category=esc(cat["label"]),
        eyebrow=esc(cat["eyebrow"]),
        title=typeset(esc(post.title)),
        date_iso=post.date.isoformat(),
        date=dotted(post.date),
        author=esc(post.author),
        minutes=post.minutes,
        cover=esc(cover_url),
        cover_alt=esc(post.meta.get("cover_alt", "")),
        width=w, height=h,
        body=body,
        tags=tags,
        cta=cta,
        related=related_html,
    ).rstrip("\n")
    image = {"url": SITE + cover_url, "width": w, "height": h, "alt": post.meta.get("cover_alt", "")}
    extra = [f'<meta property="article:published_time" content="{iso_time(post.date)}" />',
             f'<meta property="article:section" content="{esc(cat["label"])}" />']
    extra += [f'<meta property="article:tag" content="{esc(t)}" />' for t in post.tags]
    article = {
        "@type": "BlogPosting",
        "@id": post.abs_url + "#article",
        "mainEntityOfPage": {"@type": "WebPage", "@id": post.abs_url},
        "url": post.abs_url,
        "headline": post.title,
        "description": post.description,
        "image": {"@type": "ImageObject", "url": SITE + cover_url, "width": w, "height": h},
        "datePublished": iso_time(post.date),
        "dateModified": iso_time(post.date),
        "author": {"@type": "Person", "name": post.author},
        "publisher": ORGANIZATION,
        "inLanguage": "ko-KR",
        "articleSection": cat["label"],
        "keywords": post.tags or None,
        "isPartOf": {"@type": "Blog", "@id": SITE + "/blog/#blog", "name": BLOG_NAME, "url": SITE + "/blog/"},
    }
    crumbs = breadcrumb_ld([("홈", SITE + "/"), ("블로그", SITE + "/blog/"),
                            (cat["label"], f"{SITE}/blog/category/{post.category}/"), (post.title, post.abs_url)])
    draft = ctx.drafts and post.is_draft
    return page_html(
        ctx, title=f"{post.title} | {BLOG_NAME}", description=post.description, path=post.url,
        robots="noindex,nofollow" if draft else "index,follow",
        social=social_meta("article", post.title, post.description, post.abs_url, image, extra),
        json_ld=[_clean(article), crumbs], main=main,
        draft_note="초안 미리보기 — 공개 전 검토용입니다" if draft else "", blog_current=False,
    )


def feed_xml(posts):
    def x(text):
        return html.escape(str(text), quote=False)

    items = []
    for p in posts:
        url = p.abs_url
        pub = email.utils.format_datetime(dt.datetime(p.date.year, p.date.month, p.date.day, tzinfo=KST))
        cover_url = SITE + p.cover_info[0]
        cover_file = IMAGES_DIR / p.file_slug / p.meta["cover"]
        kind = "image/png" if cover_file.suffix.lower() == ".png" else "image/webp" if cover_file.suffix.lower() == ".webp" else "image/jpeg"
        items.append(
            "    <item>\n"
            f"      <title>{x(p.title)}</title>\n"
            f"      <link>{x(url)}</link>\n"
            f'      <guid isPermaLink="true">{x(url)}</guid>\n'
            f"      <pubDate>{pub}</pubDate>\n"
            f"      <dc:creator>{x(p.author)}</dc:creator>\n"
            f"      <category>{x(p.cat['label'])}</category>\n"
            f"      <description>{x(p.description)}</description>\n"
            f'      <enclosure url="{esc(cover_url)}" length="{cover_file.stat().st_size}" type="{kind}" />\n'
            "    </item>"
        )
    last = ""
    if posts:
        newest = max(p.date for p in posts)
        last = "    <lastBuildDate>" + email.utils.format_datetime(
            dt.datetime(newest.year, newest.month, newest.day, tzinfo=KST)) + "</lastBuildDate>\n"
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">\n'
        "  <channel>\n"
        f"    <title>{x(BLOG_NAME)}</title>\n"
        f"    <link>{SITE}/blog/</link>\n"
        f'    <atom:link href="{SITE}/blog/feed.xml" rel="self" type="application/rss+xml" />\n'
        f"    <description>{x(BLOG_INDEX['description'])}</description>\n"
        "    <language>ko-kr</language>\n"
        f"{last}"
        + ("\n".join(items) + "\n" if items else "")
        + "  </channel>\n</rss>\n"
    )


def latest_js(posts, ctx):
    data = []
    for p in posts[:LATEST_COUNT]:
        url, w, h = p.cover_info
        data.append({
            "slug": p.slug, "title": p.title, "category": p.category, "categoryLabel": p.cat["label"],
            "date": p.date.isoformat(), "url": p.url, "cover": url, "coverWidth": w, "coverHeight": h,
            "draft": bool(ctx.drafts and p.is_draft),
        })
    body = json_for_html(data, indent=2) if data else "[]"
    return ("// 자동 생성 파일 — tools/build_blog.py가 만듭니다. 직접 고치지 마세요.\n"
            "// 홈 화면 \"블로그\" 칸(sections/blog.jsx)이 이 목록을 읽습니다.\n"
            f"window.BLOG_LATEST = {body};\n")


def home_block(posts):
    if not posts:
        return ""
    cards = []
    for p in posts[:LATEST_COUNT]:
        url, w, h = p.cover_info
        cards.append(template("home-latest-card.html", url=esc(p.url), cover=esc(url), width=w, height=h,
                              category=esc(p.cat["label"]), date=p.date.isoformat(), title=esc(p.title)).rstrip("\n"))
    return template("home-latest.html", lead=esc(HOME_BLOCK["lead"]), cards="\n".join(cards)).rstrip("\n")


def rewrite_home(text, block, problems):
    if text is None:
        problems.warn("index.html", "index.html이 없어 홈 화면 요약 블록은 건너뜁니다.", "index.html not found; skipped.")
        return None
    if text.count(HOME_START) != 1 or text.count(HOME_END) != 1:
        problems.warn("index.html", f"index.html에 {HOME_START} / {HOME_END} 표시가 하나씩 있어야 합니다. 홈 화면 요약 블록은 건너뜁니다.",
                      "index.html must contain exactly one BLOG-LATEST:START/END marker pair; skipped.")
        return None
    a = text.index(HOME_START) + len(HOME_START)
    b = text.index(HOME_END)
    if b < a:
        problems.warn("index.html", "BLOG-LATEST 표시 순서가 거꾸로입니다. 건너뜁니다.", "BLOG-LATEST markers are out of order; skipped.")
        return None
    return text[:a] + "\n" + (block + "\n" if block else "") + text[b:]


URL_BLOCK_RE = re.compile(r"[ \t]*<url>.*?</url>", re.S)
LASTMOD_RE = re.compile(r"<lastmod>\s*(\d{4}-\d{2}-\d{2})\s*</lastmod>")
DATE_MODIFIED_RE = re.compile(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})')


def _date(text):
    try:
        return dt.date.fromisoformat(text)
    except (TypeError, ValueError):
        return None


def page_date_modified(relpath):
    """페이지 파일 안 구조화 데이터의 "dateModified" 날짜 중 가장 늦은 것 (없으면 None)."""
    try:
        text = (ROOT / relpath).read_text(encoding="utf-8")
    except OSError:
        return None
    dates = [d for d in (_date(m.group(1)) for m in DATE_MODIFIED_RE.finditer(text)) if d]
    return max(dates) if dates else None


def rewrite_sitemap(text, posts):
    """SITE_PAGES(/, /university/, /news.html)는 늘 맨 앞에 넣고, 블로그 항목은 새로 씁니다.
    sitemap.xml에 직접 추가한 다른 항목은 그대로 둡니다."""
    head = '<?xml version="1.0" encoding="UTF-8"?>'
    urlset = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    kept = {}                     # 주소 → 기존 <url> 덩어리 (블로그가 아닌 것만)
    if text:
        m = re.match(r"\s*(<\?xml[^>]*\?>)", text)
        if m:
            head = m.group(1)
        m = re.search(r"<urlset\b[^>]*>", text)
        if m:
            urlset = m.group(0)
        for block in URL_BLOCK_RE.findall(text):
            loc = re.search(r"<loc>\s*(.*?)\s*</loc>", block, re.S)
            loc = loc.group(1) if loc else ""
            if loc.startswith(SITE + "/blog/") or loc in kept:
                continue
            kept[loc] = "  " + block.strip()
    newest = max((p.date for p in posts), default=None)
    out = []
    fixed = set()
    for path, file, freq, priority in SITE_PAGES:
        loc = SITE + path
        fixed.add(loc)
        dates = [page_date_modified(file)]
        old = kept.get(loc)
        m = LASTMOD_RE.search(old) if old else None
        if m:
            dates.append(_date(m.group(1)))
        if path == "/":
            dates.append(newest)
        dates = [d for d in dates if d]
        out.append(_url_entry(loc, max(dates) if dates else dt.date.today(), freq, priority))
    out += [block for loc, block in kept.items() if loc not in fixed]
    if posts:
        out.append(_url_entry(SITE + "/blog/", newest, "weekly", "0.8"))
        for key in CATEGORIES:
            in_cat = [p for p in posts if p.category == key]
            if in_cat:
                out.append(_url_entry(f"{SITE}/blog/category/{key}/", max(p.date for p in in_cat), "weekly", "0.6"))
        for p in posts:
            out.append(_url_entry(p.abs_url, p.date, "monthly", "0.7"))
    return head + "\n" + urlset + "\n" + "\n".join(out) + "\n</urlset>\n"


def _url_entry(loc, date, freq, priority):
    return ("  <url>\n"
            f"    <loc>{html.escape(loc, quote=False)}</loc>\n"
            f"    <lastmod>{date.isoformat()}</lastmod>\n"
            f"    <changefreq>{freq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            "  </url>")


# ---------------------------------------------------------------------------
# 빌드
# ---------------------------------------------------------------------------
class Context:
    def __init__(self, drafts):
        self.drafts = drafts
        self.sizes = ImageSizes(SIZE_CACHE_PATH)
        self.all_slugs = set()
        self.built_slugs = set()


GENERATED_RE = re.compile(r"^blog/(?:index\.html|feed\.xml|latest\.js|category/[a-z0-9-]+/index\.html|[a-z0-9-]+/index\.html)$")


def read_manifest():
    try:
        data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        return data.get("files", []), data.get("mode", "production")
    except (OSError, ValueError, AttributeError):
        return [], None


def build(drafts=False, check=False):
    problems = Problems()
    ctx = Context(drafts)
    mode_ko = "미리보기 빌드 (초안 포함)" if drafts else "공개 빌드 (published 글만)"
    mode_en = "preview build (drafts included)" if drafts else "production build (published only)"
    print(f"리즈워드 블로그 {'검사' if check else '빌드'} — {mode_ko} / {'check' if check else 'build'}: {mode_en}")

    paths = sorted(POSTS_DIR.glob("*.md")) if POSTS_DIR.is_dir() else []
    posts = [load_post(p, problems, ctx) for p in paths]
    ctx.all_slugs = {p.file_slug for p in posts}
    for p in posts:
        validate_post(p, ctx, problems)
    built = [p for p in posts if (not p.is_draft) or drafts]
    ctx.built_slugs = {p.slug for p in built}
    for p in posts:
        render_post(p, ctx, problems)
    built.sort(key=lambda p: (-p.date.toordinal(), p.slug))
    published = [p for p in built if not p.is_draft]

    # 요약 표
    rows = []
    for p in sorted(posts, key=lambda p: (-p.date.toordinal(), p.slug)):
        if p.error_count:
            result = f"오류 {p.error_count}"
        elif p.is_draft and not drafts:
            result = "건너뜀(초안)" + (f" · 고칠 것 {p.soft_issue_count}" if p.soft_issue_count else "")
        elif p.is_draft:
            result = "미리보기(초안)"
        else:
            result = "OK"
        rows.append([p.file_slug, p.cat.get("label", p.category) or "-", p.meta.get("date", "-") or "-",
                     "공개" if not p.is_draft else "초안", str(len(TODO_RE.findall(p.raw))), str(len(p.used_images)),
                     f"{p.minutes}분" if p.chars else "-", result])
    header = ["글 주소(slug)", "분류", "날짜", "상태", "확인필요", "이미지", "읽기", "결과"]
    widths = [max([display_width(header[k])] + [display_width(r[k]) for r in rows]) for k in range(len(header))]
    line = "─" * min(118, sum(widths) + 2 * (len(widths) - 1))
    print(line)
    print("  ".join(pad(h, widths[k]) for k, h in enumerate(header)).rstrip())
    for r in rows:
        print("  ".join(pad(c, widths[k]) for k, c in enumerate(r)).rstrip())
    if not rows:
        print("(글이 없습니다 — blog/posts/ 가 비어 있습니다 / no posts)")
    print(line)
    n_pub = sum(1 for p in posts if not p.is_draft)
    n_draft = len(posts) - n_pub
    print(f"공개 {n_pub}편 · 초안 {n_draft}편" + ("" if drafts else " (초안은 빌드에서 빠집니다)") +
          f" / published {n_pub}, drafts {n_draft}")

    def report():
        for kind, items, mark in (("주의", problems.warnings, "!"), ("오류", problems.errors, "✗")):
            if items:
                print(f"\n{kind} {len(items)}건 / {'warnings' if kind == '주의' else 'errors'}: {len(items)}")
                for where, ko, en in items:
                    print(f"  {mark} {where}\n      {ko}\n      {en}")
        if any(p.soft_issue_count for p in posts):
            print("\n※ '고칠 것'이 있는 초안은 python3 tools/build_blog.py --drafts 로 자세한 내용을 볼 수 있습니다.\n"
                  "  Drafts with issues: run with --drafts to see the details.")

    if problems.errors:
        report()
        print("\n빌드를 멈췄습니다. 위 오류를 고친 뒤 다시 실행하세요. 파일은 하나도 바꾸지 않았습니다.\n"
              "Build stopped. Fix the errors above and run again. No files were changed.")
        return 1

    # 결과물 만들기
    outputs = {}
    counts = {"all": len(built)}
    for key in CATEGORIES:
        counts[key] = sum(1 for p in built if p.category == key)
    outputs["blog/index.html"] = list_page(ctx, built, counts)
    for key in CATEGORIES:
        outputs[f"blog/category/{key}/index.html"] = list_page(ctx, [p for p in built if p.category == key], counts, key)
    for p in built:
        related = [q for q in built if q.category == p.category and q.slug != p.slug][:RELATED_COUNT]
        outputs[f"blog/{p.slug}/index.html"] = post_page(ctx, p, related)
    outputs["blog/feed.xml"] = feed_xml(published)
    outputs["blog/latest.js"] = latest_js(built, ctx)
    generated = sorted(outputs)
    outputs["blog/.generated.json"] = json.dumps({
        "note": "tools/build_blog.py가 만든 파일 목록입니다. 직접 고치지 마세요. 글을 지우면 다음 빌드가 그 글의 파일을 지웁니다.",
        "mode": "drafts" if drafts else "production",
        "files": generated,
    }, ensure_ascii=False, indent=2) + "\n"

    home_text = HOME_PATH.read_text(encoding="utf-8") if HOME_PATH.exists() else None
    new_home = rewrite_home(home_text, home_block(published), problems)
    if new_home is not None:
        outputs["index.html"] = new_home
    sitemap_text = SITEMAP_PATH.read_text(encoding="utf-8") if SITEMAP_PATH.exists() else None
    outputs["sitemap.xml"] = rewrite_sitemap(sitemap_text, published)

    old_files, old_mode = read_manifest()
    stale = [f for f in old_files if f not in outputs and GENERATED_RE.match(f)]

    created, changed, same = [], [], []
    for relpath in sorted(outputs):
        target = ROOT / relpath
        data = outputs[relpath].encode("utf-8")
        if target.exists():
            (same if target.read_bytes() == data else changed).append(relpath)
        else:
            created.append(relpath)

    if check:
        report()
        pending = created + changed + [f for f in stale if (ROOT / f).exists()]
        if old_mode == "drafts" and not drafts:
            print("\n! 지금 blog/ 파일은 미리보기(--drafts) 빌드 결과입니다. 커밋 전에 python3 tools/build_blog.py 를 실행하세요.\n"
                  "  The blog files on disk come from a --drafts build. Run the production build before committing.")
        if pending:
            print(f"\n빌드가 필요합니다 — 다시 빌드하면 바뀌는 파일 {len(pending)}개: / Build needed — files that would change:")
            for f in pending:
                print("  · " + f)
            return 1
        print("\n검사 통과 — 빌드 결과가 최신입니다. / Check passed — generated files are up to date.")
        return 0

    for relpath in created + changed:
        target = ROOT / relpath
        target.parent.mkdir(parents=True, exist_ok=True)
        tmp = target.with_name(target.name + ".tmp-build")
        tmp.write_bytes(outputs[relpath].encode("utf-8"))
        os.replace(tmp, target)
    removed = []
    for relpath in stale:
        target = ROOT / relpath
        if target.is_file():
            target.unlink()
            removed.append(relpath)
        parent = target.parent
        while parent != BLOG_DIR and BLOG_DIR in parent.parents:
            try:
                parent.rmdir()          # 비어 있을 때만 지워집니다
            except OSError:
                break
            parent = parent.parent
    cache = ctx.sizes.content()
    old_cache = SIZE_CACHE_PATH.read_text(encoding="utf-8") if SIZE_CACHE_PATH.exists() else None
    if cache != old_cache and (ctx.sizes.used or old_cache is not None):
        SIZE_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
        SIZE_CACHE_PATH.write_text(cache, encoding="utf-8")

    report()
    print(f"\n파일: 새로 만듦 {len(created)} · 바뀜 {len(changed)} · 그대로 {len(same)} · 지움 {len(removed)}"
          f" / files: created {len(created)}, changed {len(changed)}, unchanged {len(same)}, removed {len(removed)}")
    for label, items in (("새로 만듦", created), ("바뀜", changed), ("지움", removed)):
        for f in items:
            print(f"  {label}: {f}")
    if drafts:
        print("\n! 미리보기 빌드입니다. 이 상태로 커밋하지 마세요 — 커밋 전에 python3 tools/build_blog.py 를 실행하세요.\n"
              "  Preview build: do not commit. Run the production build before committing.")
    return 0


def main(argv=None):
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    parser = argparse.ArgumentParser(
        description="리즈워드 블로그 빌드 — blog/posts/*.md 를 정적 페이지로 만듭니다. / Build the LISWORD blog.")
    parser.add_argument("--drafts", action="store_true", help="초안까지 빌드합니다 (미리보기용, 커밋 금지) / include drafts (preview)")
    parser.add_argument("--check", action="store_true", help="검사만 하고 파일은 쓰지 않습니다 / validate only, write nothing")
    args = parser.parse_args(argv)
    return build(drafts=args.drafts, check=args.check)


if __name__ == "__main__":
    sys.exit(main())
