"""주간 AI 소식 표지(cover.jpg)와 본문 그림(timeline.png)을 만듭니다.

필요: macOS + Google Chrome (글꼴을 불러오려면 인터넷 연결), Pillow
사용:
  python3 tools/brand/render_ai_news_weekly.py cover <배경사진.png> "<제목 첫 줄, 예: 11월 3주차>" <글주소> [top]
  python3 tools/brand/render_ai_news_weekly.py timeline <데이터.json> <글주소>

- 배경사진은 16:9, 왼쪽 40%가 비어 있는 AI 생성 사진(힉스필드 z_image 등). 물체가 왼쪽 아래까지 오면 마지막에 top 을 붙입니다.
- 데이터.json 형식은 ai-news-weekly-timeline.html 맨 위 설명을 봅니다.
- 결과는 blog/images/<글주소>/cover.jpg, timeline.png 에 저장됩니다. 표지 JPG는 메타데이터 없이 저장합니다.
"""
import json, os, shutil, subprocess, sys, tempfile, urllib.parse
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


def shot(url, out, w, h):
    prof = tempfile.mkdtemp()
    try:
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                        "--no-default-browser-check", f"--user-data-dir={prof}", "--force-device-scale-factor=1",
                        f"--window-size={w},{h}", "--virtual-time-budget=8000", f"--screenshot={out}", url],
                       check=True, capture_output=True)
    finally:
        shutil.rmtree(prof, ignore_errors=True)


def main():
    kind, src, *rest = sys.argv[1:]
    if kind == "cover":
        title, slug = rest[0], rest[1]
        pos = rest[2] if len(rest) > 2 else ""
        folder = os.path.join(ROOT, "blog", "images", slug)
        os.makedirs(folder, exist_ok=True)
        q = urllib.parse.urlencode({"bg": "file://" + os.path.abspath(src), "t1": title, "pos": pos})
        tmp = os.path.join(tempfile.mkdtemp(), "cover.png")
        shot(f"file://{HERE}/ai-news-weekly-cover.html?{q}", tmp, 1600, 900)
        Image.open(tmp).convert("RGB").save(os.path.join(folder, "cover.jpg"), "JPEG", quality=84, optimize=True, progressive=True)
        print(os.path.join(folder, "cover.jpg"))
    elif kind == "timeline":
        slug = rest[0]
        folder = os.path.join(ROOT, "blog", "images", slug)
        os.makedirs(folder, exist_ok=True)
        data = json.load(open(src, encoding="utf-8"))
        url = f"file://{HERE}/ai-news-weekly-timeline.html?d=" + urllib.parse.quote(json.dumps(data, ensure_ascii=False))
        shot(url, os.path.join(folder, "timeline.png"), 1600, 900)
        print(os.path.join(folder, "timeline.png"))
    else:
        sys.exit("cover 또는 timeline 을 써 주세요.")


if __name__ == "__main__":
    main()
