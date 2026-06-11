#!/usr/bin/env python3
"""One-off migration: self-host template-premium-101 Tilda export."""

from __future__ import annotations

import re
import subprocess
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_HTML = ROOT / "template-premium-101" / "index.html"
ASSETS = ROOT / "assets-premium101"
WEB3FORMS_KEY = "581eaf16-3866-475f-8020-0f5282f63bec"

# thb thumbnails -> full static URLs
THB_MAP = {
    "https://thb.tildacdn.com/tild3138-3735-4932-b563-326633333932/-/resizeb/20x/5_1.png":
        "https://static.tildacdn.com/tild3138-3735-4932-b563-326633333932/5_1.png",
    "https://thb.tildacdn.com/tild3535-3330-4766-b032-323938316337/-/resizeb/20x/2_4.png":
        "https://static.tildacdn.com/tild3535-3330-4766-b032-323938316337/2_4.png",
    "https://thb.tildacdn.com/tild3866-3362-4661-b661-653466653330/-/resizeb/20x/3_3.png":
        "https://static.tildacdn.com/tild3866-3362-4661-b661-653466653330/3_3.png",
    "https://thb.tildacdn.com/tild6631-3965-4731-b430-316665316431/-/resizeb/20x/4_2.png":
        "https://static.tildacdn.com/tild6631-3965-4731-b430-316665316431/4_2.png",
}

UA_REPLACEMENTS = [
    ("Ваше имя и фамилия", "Ваше ім'я та прізвище"),
    ("Сможете ли вы присутствовать на торжестве?", "Чи зможете ви бути на святі?"),
    ("С радостью приду", "З радістю прийду"),
    ("К сожалению, не смогу присутствовать", "На жаль, не зможу бути"),
    ("Что предпочитаете из напитков?", "Що бажаєте з напоїв?"),
    ("Какую музыку предпочитаете?", "Яку музику бажаєте?"),
    ("Отправить", "Надіслати"),
    ("посмотреть на карте", "переглянути на карті"),
    ("вступить", "написати нам"),
    ("Связаться", "Зв'язатися"),
    ("Спасибо! Ваша заявка принята.", "Дякуємо! Вашу відповідь отримано."),
    ("Пригласительное 2", "Олег & Настя — Весільне запрошення"),
]

GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=весільний+зал"
SITE_URL = "https://my-wedding.com.ua/template-premium-101"
OG_IMAGE = "/assets/media/images/wedding_banner_736_850.jpg"


def fetch(url: str) -> bytes:
    try:
        result = subprocess.run(
            ["curl", "-fsSL", "--max-time", "90", url],
            capture_output=True,
            check=True,
        )
        data = result.stdout
    except subprocess.CalledProcessError:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
    if len(data) >= 2 and data[:2] == b"\x1f\x8b":
        import gzip

        data = gzip.decompress(data)
    return data


def local_path_for_url(url: str) -> Path | None:
    url = url.split("?")[0]
    if url.rstrip("/") in ("https://static.tildacdn.com", "https://ws.tildacdn.com"):
        return None
    if "cdn.postnikovmd.com" in url:
        return ASSETS / "js" / "mods.min.js"
    if "neo.tildacdn.com" in url:
        name = url.split("/")[-1]
        return ASSETS / "js" / name
    if "static.tildacdn.com" in url:
        path = url.split("static.tildacdn.com/", 1)[1]
        if path.startswith("css/"):
            return ASSETS / "css" / path[4:]
        if path.startswith("js/"):
            return ASSETS / "js" / path[3:]
        if path.startswith("ws/"):
            # project bundle
            name = path.split("/")[-1]
            if name.endswith(".css"):
                return ASSETS / "css" / name
            if name.endswith(".js"):
                return ASSETS / "js" / name
        if path.startswith("tild"):
            return ASSETS / "media" / path
    return None


def download_asset(url: str) -> Path | None:
    url_clean = url.split("?")[0]
    if url_clean in THB_MAP:
        url_clean = THB_MAP[url_clean].split("?")[0]
    local = local_path_for_url(url_clean)
    if not local:
        return None
    if local.exists() and local.stat().st_size > 0:
        return local
    local.parent.mkdir(parents=True, exist_ok=True)
    try:
        data = fetch(url if "?" in url and "tildacdn" in url and "/ws/" in url else url_clean)
    except urllib.error.HTTPError:
        if "?" not in url_clean:
            try:
                data = fetch(url)
            except Exception as exc:
                print(f"FAIL {url_clean}: {exc}")
                return None
        else:
            print(f"FAIL {url_clean}")
            return None
    except Exception as exc:
        print(f"FAIL {url_clean}: {exc}")
        return None
    local.write_bytes(data)
    print(f"OK {local.relative_to(ROOT)}")
    return local


def url_to_web_path(url: str) -> str:
    url_clean = url.split("?")[0]
    if url_clean in THB_MAP:
        url_clean = THB_MAP[url_clean].split("?")[0]
    local = local_path_for_url(url_clean)
    if not local:
        return url
    rel = local.relative_to(ROOT).as_posix()
    return f"../{rel}"


def extract_urls(text: str) -> set[str]:
    urls = set()
    for m in re.finditer(r"https?://[^\s\"'<>\\)]+", text):
        u = m.group(0).rstrip(".,;")
        if any(skip in u for skip in ("schema.org", "w3.org", "selstorage.ru")):
            continue
        urls.add(u)
    return urls


def remove_audio_block(text: str) -> str:
    # NLM138 = background music mod block
    pattern = r'<div id="rec1867002061"[\s\S]*?<!--/rec1867002061-->'
    text2, n = re.subn(pattern, "", text, count=1)
    if n:
        return text2
    # fallback: strip NOLIM138 script island inside any rec
    return re.sub(
        r"<!--NOLIM--><!--NLM138-->[\s\S]*?<!-- nominify end -->",
        "<!-- audio removed -->",
        text,
        count=1,
    )


def remove_tilda_stat(text: str) -> str:
    return re.sub(r"<!-- Stat -->[\s\S]*?</script>\s*</body>", "</body>", text, count=1)


def remove_postnikov_mods(text: str) -> str:
    return re.sub(
        r'<!-- nominify begin --><script src="https://cdn\.postnikovmd\.com/tilda@[^"]+"></script>[\s\S]*?<!-- nominify end -->',
        "<!-- postnikov mods removed -->",
        text,
        count=1,
    )


def remove_dns_prefetch(text: str) -> str:
    text = re.sub(r'<link rel="dns-prefetch" href="https://ws\.tildacdn\.com">\s*', "", text)
    text = re.sub(r'<link rel="dns-prefetch" href="https://static\.tildacdn\.com">\s*', "", text)
    text = re.sub(r'<meta http-equiv="x-dns-prefetch-control" content="on">\s*', "", text)
    return text


def add_front_matter(text: str) -> str:
    if text.startswith("---"):
        return text
    fm = """---
layout: null
permalink: /template-premium-101
---
"""
    # strip leading blank lines
    text = text.lstrip("\n")
    if text.startswith("<!DOCTYPE"):
        return fm + text
    return fm + text


def update_head_meta(text: str) -> str:
    text = text.replace('<html lang="ru">', '<html lang="uk">')
    text = re.sub(
        r"<!--metatextblock-->[\s\S]*?<!--/metatextblock-->",
        f"""<!--metatextblock-->
    <title>Олег &amp; Настя — Весільне запрошення</title>
    <meta property="og:url" content="{SITE_URL}" />
    <meta property="og:title" content="Олег &amp; Настя — Весільне запрошення" />
    <meta property="og:description" content="Весільне запрошення" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://my-wedding.com.ua{OG_IMAGE}" />
    <link rel="canonical" href="{SITE_URL}">
    <!--/metatextblock-->""",
        text,
        count=1,
    )
    text = re.sub(r'<meta name="robots" content="noindex" />\s*', "", text)
    text = text.replace('data-tilda-project-lang="RU"', 'data-tilda-project-lang="UK"')
    text = text.replace('data-tilda-project-country="RU"', 'data-tilda-project-country="UA"')
    text = text.replace('data-tilda-stat-scroll="yes"', 'data-tilda-stat-scroll="no"')
    text = re.sub(r'data-tilda-formskey="[^"]*"', "", text)
    return text


def replace_external_links(text: str) -> str:
    text = text.replace("https://yandex.ru/maps/-/CPAXNEn8", GOOGLE_MAPS_URL)
    text = text.replace("https://yandex.ru/profile/-/CPAXRE3Y", GOOGLE_MAPS_URL)
    text = text.replace("https://t.me/invite_moment", "https://my-wedding.com.ua")
    text = text.replace('href="t.me/invite_moment"', 'href="https://my-wedding.com.ua"')
    text = text.replace("https://invite-moment.ru/2", SITE_URL)
    text = text.replace("https://invite-moment.ru/", "https://my-wedding.com.ua/")
    return text


def rewrite_asset_urls(text: str) -> str:
    urls = sorted(extract_urls(text), key=len, reverse=True)
    for url in urls:
        if "fonts.googleapis.com" in url or "fonts.gstatic.com" in url:
            continue
        web = url_to_web_path(url)
        if web != url:
            text = text.replace(url, web)
    # query-string variants for project bundles
    text = re.sub(
        r'\.\./assets-premium101/css/tilda-blocks-page115625976\.min\.css\?t=\d+',
        "../assets-premium101/css/tilda-blocks-page115625976.min.css",
        text,
    )
    text = re.sub(
        r'\.\./assets-premium101/js/tilda-blocks-page115625976\.min\.js\?t=\d+',
        "../assets-premium101/js/tilda-blocks-page115625976.min.js",
        text,
    )
    return text


def patch_css_font_urls() -> None:
    for css_file in ASSETS.rglob("*.css"):
        content = css_file.read_text(encoding="utf-8", errors="ignore")
        urls = extract_urls(content)
        changed = content
        for url in sorted(urls, key=len, reverse=True):
            if "tildacdn" not in url:
                continue
            local = download_asset(url)
            if local:
                web = os_path_relpath(local, css_file.parent)
                changed = changed.replace(url, web)
        if changed != content:
            css_file.write_text(changed, encoding="utf-8")


def os_path_relpath(target: Path, start: Path) -> str:
    return Path(
        __import__("os").path.relpath(target.resolve(), start.resolve())
    ).as_posix()


def add_web3forms_script(text: str) -> str:
    script = f"""
<script>
(function() {{
  function initRsvp() {{
    var form = document.getElementById('form1867002251');
    if (!form) return;
    form.classList.remove('js-form-proccess');
    form.setAttribute('data-formactiontype', '2');
    form.addEventListener('submit', async function(e) {{
      e.preventDefault();
      e.stopPropagation();
      var btn = form.querySelector('button[type="submit"]');
      var success = form.querySelector('.js-successbox');
      var fd = new FormData(form);
      var drinks = Array.from(form.querySelectorAll('input[name="Напитки"]:checked')).map(function(el) {{ return el.value; }}).join(', ');
      var payload = {{
        access_key: '{WEB3FORMS_KEY}',
        subject: 'Анкета гостя — Весільне запрошення',
        from_name: 'Весільний сайт',
        'Ім\\'я': fd.get('Имя') || '',
        'Підтвердження': fd.get('Подтверждение') || '',
        'Напої': drinks || 'Не обрано',
        'Музика': fd.get('Музыка') || ''
      }};
      if (btn) {{ btn.disabled = true; }}
      try {{
        var res = await fetch('https://api.web3forms.com/submit', {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json', 'Accept': 'application/json' }},
          body: JSON.stringify(payload)
        }});
        var json = await res.json();
        if (json.success) {{
          if (success) {{
            success.style.display = 'block';
            form.querySelector('.t-form__inputsbox').style.display = 'none';
          }}
          form.reset();
        }} else {{
          alert('Помилка відправки. Спробуйте ще раз.');
        }}
      }} catch (err) {{
        alert('Помилка відправки. Спробуйте ще раз.');
      }} finally {{
        if (btn) {{ btn.disabled = false; }}
      }}
    }}, true);
  }}
  if (document.readyState === 'loading') {{
    document.addEventListener('DOMContentLoaded', initRsvp);
  }} else {{
    initRsvp();
  }}
}})();
</script>
"""
    return text.replace("</body>", script + "\n</body>", 1)


def apply_ua_text(text: str) -> str:
    for old, new in UA_REPLACEMENTS:
        text = text.replace(old, new)
    return text


def main() -> None:
    print("Reading HTML...")
    text = SRC_HTML.read_text(encoding="utf-8")

    print("Collecting URLs...")
    urls = extract_urls(text)
    for css_js in [
        "https://static.tildacdn.com/ws/project13402595/tilda-blocks-page115625976.min.css?t=1781180384",
        "https://static.tildacdn.com/ws/project13402595/tilda-blocks-page115625976.min.js?t=1781180384",
    ]:
        urls.add(css_js)

    print(f"Downloading {len(urls)} assets...")
    for url in sorted(urls):
        download_asset(url)

    print("Patching CSS font/media URLs...")
    patch_css_font_urls()

    # second pass for fonts discovered in CSS
    for css_file in ASSETS.rglob("*.css"):
        for url in extract_urls(css_file.read_text(encoding="utf-8", errors="ignore")):
            if "tildacdn" in url:
                download_asset(url)

    print("Transforming HTML...")
    text = remove_audio_block(text)
    text = remove_postnikov_mods(text)
    text = remove_tilda_stat(text)
    text = remove_dns_prefetch(text)
    text = add_front_matter(text)
    text = update_head_meta(text)
    text = replace_external_links(text)
    text = apply_ua_text(text)
    text = rewrite_asset_urls(text)
    text = add_web3forms_script(text)

    SRC_HTML.write_text(text, encoding="utf-8")
    print("Done:", SRC_HTML)


if __name__ == "__main__":
    main()
