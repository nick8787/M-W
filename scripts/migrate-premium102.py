#!/usr/bin/env python3
"""One-off migration: self-host template-premium-102 Tilda export."""

from __future__ import annotations

import gzip
import re
import subprocess
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_HTML = ROOT / "template-premium-102" / "index.html"
ASSETS = ROOT / "assets-premium102"
WEB3FORMS_KEY = "581eaf16-3866-475f-8020-0f5282f63bec"
PAGE_BUNDLE = "tilda-blocks-page120599466"
FORM_ID = "form1941604341"
ENVELOPE_REC = "rec1941604181"
AUDIO_REC = "rec2216705171"
SELLER_RECS = [
    "rec1267791991",
    "rec1267795071",
    "rec1264695121",
    "rec1264688261",
    "rec1269730411",
    "rec1752949101",
]
SMOOTH_SCROLL_REC = "rec1941604171"

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

SITE_URL = "https://my-wedding.com.ua/template-premium-102"
OG_IMAGE = "/assets-premium102/media/tild6434-6562-4562-b139-303234653136/Frame_1321317183.png"
GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=весільний+зал"

UA_REPLACEMENTS = [
    ("Пригласительное 12", "Олексій & Марія — Весільне запрошення"),
    ("ПРИГЛАШЕНИЕ НА СВАДЬБУ", "ЗАПРОШЕННЯ НА ВЕСІЛЛЯ"),
    ("нажмите,", "натисніть,"),
    ("Приглашаем вас на свадьбу!", "Запрошуємо вас на весілля!"),
    ("ДО СВАДЬБЫ", "ДО ВЕСІЛЛЯ"),
    ("дней", "днів"),
    ("часов", "годин"),
    ("минут", "хвилин"),
    ("секунд", "секунд"),
    ("Жених Алексей", "Наречений Олексій"),
    ("Невеста Мария", "Наречена Марія"),
    ("Свадебная церемония", "Весільна церемонія"),
    ("Регистрация", "Церемонія"),
    ("Начало банкета", "Початок банкету"),
    ("Свадебный торт", "Весільний торт"),
    ("Окончание торжества", "Завершення свята"),
    ("Дворец бракосочетания на ВДНХ", "Палац одруження"),
    ("Ресторан «loft hall»", "Ресторан «Loft Hall»"),
    ("г. Москва, ул. Ленинская Слобода, 26", "м. Київ, вул. Хрещатик, 1"),
    ("посмотреть на карте", "переглянути на карті"),
    (
        "Дорогие гости, наш вечер будет особенным, но, к сожалению, не совсем подходящим для детей. Пожалуйста, позвольте себе отдохнуть в этот вечер без детей.",
        "Шановні гості, наш вечір буде особливим, але, на жаль, не зовсім підходящим для дітей. Будь ласка, дозвольте собі відпочити цього вечора без дітей.",
    ),
    (
        "Мы стараемся сделать праздник красивым\u2028и будем рады, если вы поддержите цветовую палитру нашей свадьбы.",
        "Ми намагаємося зробити свято красивим\u2028і будемо раді, якщо ви підтримаєте кольорову палітру нашого весілля.",
    ),
    (
        "Мы ценим традиции, но, к сожалению, не сможем в полной мере насладиться красотой цветов… Поэтому будем рады любой другой знак внимания.",
        "Ми цінуємо традиції, але, на жаль, не зможемо в повній мірі насолодитися красою квітів… Тому будемо раді будь-якому іншому знаку уваги.",
    ),
    (
        "Не переживайте, мы не будем вызывать гостей говорить тосты. Во время нашей свадьбы будет действовать «открытый микрофон» — интересно, кто будет моим",
        "Не хвилюйтеся, ми не будемо викликати гостей говорити тости. Під час нашого весілля діятиме «відкритий мікрофон» — цікаво, хто буде моїм",
    ),
    ("— им буду я 🤍", "— ним буду я 🤍"),
    ("Пожалуйста, подтвердите свое присутствие до 10.05.2026", "Будь ласка, підтвердіть свою присутність до 10.05.2026"),
    ("анкета", "анкета"),
    ("Ваше имя и фамилия", "Ваше ім'я та прізвище"),
    ("Сможете ли вы присутствовать на торжестве?", "Чи зможете ви бути на святі?"),
    ("Обязательно приду", "З радістю прийду"),
    ("К сожалению, не смогу присутствовать", "На жаль, не зможу бути"),
    ("Что предпочитаете из напитков?", "Що бажаєте з напоїв?"),
    ("Вино белое", "Біле вино"),
    ("Вино красное", "Червоне вино"),
    ("Водка", "Горілка"),
    ("Виски", "Віскі"),
    ("Коньяк", "Коньяк"),
    ("Б/а напитки", "Безалкогольні напої"),
    ("Какую музыку предпочитаете?", "Яку музику бажаєте?"),
    ("Ваша любимая музыка или группа", "Ваша улюблена музика або гурт"),
    ("Отправить", "Надіслати"),
    ("Спасибо! Ваша заявка принята.", "Дякуємо! Вашу відповідь отримано."),
    (
        "Предлагаем вступить в чат гостей, здесь можно обмениваться фото и видео со свадьбы",
        "Запрошуємо долучитися до чату гостей — тут можна обмінюватися фото та відео з весілля",
    ),
    ("Чат для гостей", "Чат для гостей"),
    ("вступить", "приєднатися"),
    (
        "По всем вопросам, связанным с мероприятием, вы можете связаться с нами:",
        "З усіх питань, пов'язаних із заходом, ви можете зв'язатися з нами:",
    ),
    ("Связаться", "Зв'язатися"),
    ("С любовью,", "З любов'ю,"),
    ("АВГУСТ", "СЕРПЕНЬ"),
    ("invite-moment.ru", "my-wedding.com.ua"),
    (
        "Приглашаем вас на&nbsp;свадьбу!<br />Один день в&nbsp;этом году будет для нас особенным, и&nbsp;мы&nbsp;хотим провести его&nbsp;в&nbsp;кругу самых близких людей. Будем рады видеть вас в&nbsp;числе гостей!",
        "Запрошуємо вас на&nbsp;весілля!<br />Один день цього року буде для нас особливим, і&nbsp;ми&nbsp;хочемо провести його&nbsp;в&nbsp;колі найближчих людей. Будемо раді бачити вас серед гостей!",
    ),
    (
        "Дорогие гости, наш вечер будет особенным, но, к сожалению, не совсем подходящим для детей. Пожалуйста, позвольте себе отдохнуть и насладиться праздником в кругу взрослых",
        "Шановні гості, наш вечір буде особливим, але, на жаль, не зовсім підходящим для дітей. Будь ласка, дозвольте собі відпочити й насолодитися святом у колі дорослих",
    ),
    (
        "Мы ценим традиции, но, к сожалению, не сможем в полной мере насладиться красотой цветов… Поэтому будем рады любой другой альтернативе — например, бутылочке хорошего вина",
        "Ми цінуємо традиції, але, на жаль, не зможемо в повній мірі насолодитися красою квітів… Тому будемо раді будь-якій іншій альтернативі — наприклад, пляшечці гарного вина",
    ),
    (
        "Не переживайте, мы не будем вызывать гостей говорить тосты. Во время нашей свадьбы будет действовать «открытый микрофон».",
        "Не хвилюйтеся, ми не будемо викликати гостей говорити тости. Під час нашого весілля діятиме «відкритий мікрофон».",
    ),
    ("— интересно, кто будет моим", "— цікаво, хто буде моїм"),
    ("моїм<br />мужем, когда я вырасту?", "моїм<br />чоловіком, коли я виросту?"),
    ("мужем, когда я вырасту?", "чоловіком, коли я виросту?"),
    ("Дорогие", "Дорогі"),
    ("РОДНЫЕ", "Рідні"),
    (">Details</div>", ">ДЕТАЛІ</div>"),
    (">contacts</div>", ">КОНТАКТИ</div>"),
    (">анкета</div>", ">АНКЕТА</div>"),
    (">рідні</div>", ">Рідні</div>"),
]

HEADING_CSS = """<style id="premium102-headings">
.premium102-heading__script {
  color: #fff;
  font-family: 'Graet-wibes', cursive;
  font-weight: 600;
  line-height: 1.05;
  margin: 0;
}
.premium102-heading__caps {
  color: #fff;
  font-family: 'FUTURA', 'Futura PT', Arial, sans-serif;
  font-weight: 100;
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}
.premium102-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  width: 100%;
  height: 100%;
  background: none !important;
}
.premium102-heading .premium102-heading__script {
  font-size: clamp(52px, 14vw, 90px);
}
.premium102-heading .premium102-heading__caps {
  font-size: clamp(62px, 16vw, 100px);
  margin-top: -6px;
}
.premium102-names {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  height: 100%;
  text-align: center;
  background: none !important;
}
.premium102-names--stack .premium102-heading__caps {
  font-size: clamp(40px, 8.5vw, 68px);
  letter-spacing: 0.1em;
  line-height: 1.05;
}
@media screen and (max-width: 599px) {
  .premium102-names--stack .premium102-heading__caps { font-size: clamp(32px, 10vw, 48px); }
  .premium102-heading .premium102-heading__script { font-size: clamp(44px, 12vw, 72px); }
  .premium102-heading .premium102-heading__caps { font-size: clamp(52px, 14vw, 80px); }
}
@media screen and (max-width: 419px) {
  .premium102-names--stack .premium102-heading__caps { font-size: clamp(28px, 9vw, 40px); }
}
</style>"""

ENVELOPE_CSS = """<style id="premium102-envelope">
html.premium102-envelope-locked #rec1941604181 {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 100vh !important;
  max-height: 100vh !important;
  z-index: 2147483646 !important;
  overflow: hidden !important;
  margin: 0 !important;
}
html.premium102-envelope-locked #rec1941604181 .t396__artboard,
html.premium102-envelope-locked #rec1941604181 .t396__carrier,
html.premium102-envelope-locked #rec1941604181 .t396__filter {
  min-height: 100vh !important;
  height: 100vh !important;
}
html.premium102-envelope-locked #rec1941604181 .t396__elem:not([data-elem-id^="1774587825874"]) {
  visibility: hidden !important;
  pointer-events: none !important;
}
html.premium102-envelope-locked #rec1941604181 .t396__elem[data-elem-id^="1774587825874"] {
  z-index: 100 !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
html.premium102-envelope-locked #allrecords > .r.t-rec:not(#rec1941604181) {
  visibility: hidden !important;
  pointer-events: none !important;
}
</style>"""

NAMES_HTML = (
    "<div class='tn-atom premium102-names premium102-names--stack'>"
    '<div class="premium102-heading__caps">Марія</div>'
    '<div class="premium102-heading__caps">Олексій</div>'
    "</div>"
)

DUAL_HEADINGS = {
    "<div class='tn-atom'field='tn_text_1772485885788000003'>Чат для гостей</div>": (
        "<div class='tn-atom premium102-heading' field='tn_text_1772485885788000003'>"
        '<div class="premium102-heading__script">Чат</div>'
        '<div class="premium102-heading__caps">для гостей</div>'
        "</div>"
    ),
    "<div class='tn-atom'field='tn_text_1772485885788000003'>ДО ВЕСІЛЛЯ<br />ОСТАЛОСЬ</div>": (
        "<div class='tn-atom premium102-heading' field='tn_text_1772485885788000003'>"
        '<div class="premium102-heading__script">До весілля</div>'
        '<div class="premium102-heading__caps">залишилось</div>'
        "</div>"
    ),
}


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
        data = gzip.decompress(data)
    return data


def local_path_for_url(url: str) -> Path | None:
    url = url.split("?")[0]
    if url.rstrip("/") in ("https://static.tildacdn.com", "https://ws.tildacdn.com"):
        return None
    if "cdn.postnikovmd.com" in url:
        return ASSETS / "js" / "mods.min.js"
    if "neo.tildacdn.com" in url:
        return ASSETS / "js" / url.split("/")[-1]
    if "static.tildacdn.com" in url:
        path = url.split("static.tildacdn.com/", 1)[1]
        if path.startswith("css/"):
            return ASSETS / "css" / path[4:]
        if path.startswith("js/"):
            return ASSETS / "js" / path[3:]
        if path.startswith("ws/"):
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
    except (urllib.error.HTTPError, subprocess.CalledProcessError, OSError) as exc:
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
    return f"../{local.relative_to(ROOT).as_posix()}"


def extract_urls(text: str) -> set[str]:
    urls = set()
    for m in re.finditer(r"https?://[^\s\"'<>\\)]+", text):
        u = m.group(0).rstrip(".,;")
        if any(skip in u for skip in ("schema.org", "w3.org", "selstorage.ru")):
            continue
        urls.add(u)
    return urls


def remove_block_by_rec(text: str, rec_id: str) -> str:
    positions = [(m.start(), m.group(1)) for m in re.finditer(r'<div id="(rec\d+)" class="r t-rec', text)]
    pos_map = {rec: pos for pos, rec in positions}
    start = pos_map.get(rec_id)
    if start is None:
        return text
    next_pos = next((pos for pos, _ in positions if pos > start), None)
    end = next_pos if next_pos is not None else text.find('</div> <!--/allrecords-->', start)
    if end == -1:
        end = len(text)
    return text[:start] + text[end:]


def remove_audio_block(text: str) -> str:
    text2 = remove_block_by_rec(text, AUDIO_REC)
    if AUDIO_REC not in text2:
        return text2
    return re.sub(
        r"<!--NOLIM--><!--NLM138-->[\s\S]*?<!-- nominify end -->",
        "<!-- audio removed -->",
        text,
        count=1,
    )


def remove_seller_blocks(text: str) -> str:
    for rec_id in SELLER_RECS:
        text = remove_block_by_rec(text, rec_id)
    return text


def remove_smooth_scroll(text: str) -> str:
    return remove_block_by_rec(text, SMOOTH_SCROLL_REC)


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


def remove_footer(text: str) -> str:
    return re.sub(r"\s*<!--footer-->[\s\S]*?<!--/footer-->", "", text, count=1)


def update_favicon(text: str) -> str:
    favicon = """<!--favicons-->
    <link rel="icon" type="image/png" sizes="32x32" href="../assets-premium102/media/favicon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="../assets-premium102/media/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../assets-premium102/media/favicon.png">
    <link rel="shortcut icon" href="../assets-premium102/media/favicon.png">
    <!--/favicons-->"""
    return re.sub(r"<!--favicons-->[\s\S]*?<!--/favicons-->", favicon, text, count=1)


def update_head_meta(text: str) -> str:
    text = text.replace('<html lang="ru">', '<html lang="uk">')
    text = re.sub(
        r"<!--metatextblock-->[\s\S]*?<!--/metatextblock-->",
        f"""<!--metatextblock-->
    <title>Олексій &amp; Марія — Весільне запрошення</title>
    <meta property="og:url" content="{SITE_URL}" />
    <meta property="og:title" content="Олексій &amp; Марія — Весільне запрошення" />
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
    text = re.sub(r'data-tilda-formskey="[^"]*"\s*', "", text)
    return text


def replace_external_links(text: str) -> str:
    text = text.replace("https://yandex.ru/maps/-/CPAXNEn8", GOOGLE_MAPS_URL)
    text = text.replace("https://yandex.ru/profile/-/CPAXRE3Y", GOOGLE_MAPS_URL)
    text = text.replace("https://t.me/invite_moment", "https://my-wedding.com.ua")
    text = text.replace('href="t.me/invite_moment"', 'href="https://my-wedding.com.ua"')
    text = text.replace("https://invite-moment.ru/12", SITE_URL)
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
    text = re.sub(
        rf"\.\./assets-premium102/css/{PAGE_BUNDLE}\.min\.css\?t=\d+",
        f"../assets-premium102/css/{PAGE_BUNDLE}.min.css",
        text,
    )
    text = re.sub(
        rf"\.\./assets-premium102/js/{PAGE_BUNDLE}\.min\.js\?t=\d+",
        f"../assets-premium102/js/{PAGE_BUNDLE}.min.js",
        text,
    )
    return text


def os_path_relpath(target: Path, start: Path) -> str:
    return Path(__import__("os").path.relpath(target.resolve(), start.resolve())).as_posix()


def patch_css_font_urls() -> None:
    for css_file in ASSETS.rglob("*.css"):
        content = css_file.read_text(encoding="utf-8", errors="ignore")
        changed = content
        for url in sorted(extract_urls(content), key=len, reverse=True):
            if "tildacdn" not in url:
                continue
            local = download_asset(url)
            if local:
                web = os_path_relpath(local, css_file.parent)
                changed = changed.replace(url, web)
        if changed != content:
            css_file.write_text(changed, encoding="utf-8")


def add_web3forms_script(text: str) -> str:
    script = f"""
<script>
(function() {{
  function initRsvp() {{
    var form = document.getElementById('{FORM_ID}');
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


def add_heading_styles(text: str) -> str:
    if 'id="premium102-headings"' in text:
        text = re.sub(
            r'<style id="premium102-headings">[\s\S]*?</style>',
            HEADING_CSS,
            text,
            count=1,
        )
    else:
        text = text.replace("</head>", HEADING_CSS + "</head>", 1)
    if 'id="premium102-envelope"' in text:
        text = re.sub(
            r'<style id="premium102-envelope">[\s\S]*?</style>',
            ENVELOPE_CSS,
            text,
            count=1,
        )
    else:
        text = text.replace("</head>", ENVELOPE_CSS + "</head>", 1)
    if 'class="premium102-envelope-locked"' not in text:
        text = text.replace(
            '<html lang="uk">',
            '<html lang="uk" class="premium102-envelope-locked">',
            1,
        )
    return text


def replace_names_svg_with_html(text: str) -> str:
    text = re.sub(
        r"<div class='tn-atom premium102-names[^']*'>[\s\S]*?</div>\s*</div>",
        NAMES_HTML + " </div>",
        text,
    )
    text = re.sub(
        r"data-elem-id='1775038238485000001'[\s\S]*?"
        r"<div class='tn-atom t-bgimg'[^>]*Frame_1321317366\.svg[\s\S]*?</div>\s*</div>",
        lambda m: re.sub(
            r"<div class='tn-atom t-bgimg'[\s\S]*?</div>",
            NAMES_HTML,
            m.group(0),
            count=1,
        ),
        text,
    )
    return text


def apply_dual_line_headings(text: str) -> str:
    for old, new in DUAL_HEADINGS.items():
        text = text.replace(old, new)
    return text


OLD_LOCK_SCROLL = """        function lockScroll() {
            if (!locked) return;
            scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';

            // фиксируем body, чтобы не прыгал экран
            document.body.style.position = 'fixed';
            document.body.style.top = '-' + scrollY + 'px';
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';

            // запрет на iOS touchmove
            document.addEventListener('touchmove', prevent, { passive: false });
        }

        function unlockScroll() {
            if (!locked) return;
            locked = false;

            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';

            document.removeEventListener('touchmove', prevent, { passive: false });

            window.scrollTo(0, scrollY);
        }"""

NEW_LOCK_SCROLL = """        function primeEnvelopeImages() {
            var root = document.getElementById('rec1941604181');
            if (!root) return;
            root.querySelectorAll('.t-bgimg[data-original]').forEach(function (el) {
                var url = el.getAttribute('data-original');
                if (!url) return;
                el.style.backgroundImage = 'url("' + url + '")';
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center center';
                el.style.backgroundRepeat = 'no-repeat';
            });
        }

        function lockScroll() {
            if (!locked) return;
            scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
            window.scrollTo(0, 0);
            scrollY = 0;
            document.documentElement.classList.add('premium102-envelope-locked');

            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = '0';
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';

            document.addEventListener('touchmove', prevent, { passive: false });
            primeEnvelopeImages();
        }

        function unlockScroll() {
            if (!locked) return;
            locked = false;
            document.documentElement.classList.remove('premium102-envelope-locked');

            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';

            document.removeEventListener('touchmove', prevent, { passive: false });
            window.scrollTo(0, scrollY);
        }"""


def patch_envelope_scroll(text: str) -> str:
    if "premium102-envelope-locked" in text:
        return text
    if OLD_LOCK_SCROLL in text:
        return text.replace(OLD_LOCK_SCROLL, NEW_LOCK_SCROLL)
    return text


PRIME_IMAGES = """<script>
(function () {
  function primeImages() {
    document.querySelectorAll('.t-bgimg[data-original], img[data-original]').forEach(function (el) {
      var url = el.getAttribute('data-original');
      if (!url) return;
      if (el.classList.contains('t-bgimg')) {
        el.style.backgroundImage = 'url("' + url + '")';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center center';
        el.style.backgroundRepeat = 'no-repeat';
      } else {
        el.src = url;
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', primeImages);
  else primeImages();
  window.addEventListener('load', primeImages);
})();
</script>"""


def add_bootstrap_patches(text: str) -> str:
    if "function primeImages()" not in text:
        text = text.replace("<head>", f"<head>\n{PRIME_IMAGES}", 1)
    if ".t-records{opacity:1!important}" not in text:
        text = text.replace("</head>", '<style>.t-records{opacity:1!important}</style></head>', 1)

    old_click = """document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href="' + UNLOCK_HASH + '"]');
            if (!a) return;

            // сначала разблокируем, потом позволяем стандартному переходу к якорю
            unlockScroll();
            // если нужно гарантированно прыгнуть к якорю:
            // setTimeout(function(){ location.hash = UNLOCK_HASH; }, 0);
        }, true);"""

    new_click = f"""document.addEventListener('click', function (e) {{
            var a = e.target.closest && e.target.closest('a[href="' + UNLOCK_HASH + '"]');
            var envelope = e.target.closest && e.target.closest('#{ENVELOPE_REC}');
            if (!a && !envelope) return;

            if (a) e.preventDefault();
            unlockScroll();
        }}, true);"""

    if old_click in text:
        text = text.replace(old_click, new_click)
    elif f"#{ENVELOPE_REC}" not in text:
        text = text.replace(
            "if (!a) return;",
            f"var envelope = e.target.closest && e.target.closest('#{ENVELOPE_REC}');\n            if (!a && !envelope) return;\n\n            if (a) e.preventDefault();",
            1,
        )

    text = text.replace("url('media/", "url('../assets-premium102/media/")
    return text


def decompress_gzip_assets() -> int:
    count = 0
    for path in ASSETS.rglob("*"):
        if not path.is_file():
            continue
        data = path.read_bytes()
        if len(data) >= 2 and data[:2] == b"\x1f\x8b":
            path.write_bytes(gzip.decompress(data))
            count += 1
    return count


def main() -> None:
    print("Reading HTML...")
    text = SRC_HTML.read_text(encoding="utf-8")

    print("Collecting URLs...")
    urls = extract_urls(text)
    urls.add(
        f"https://static.tildacdn.com/ws/project13402595/{PAGE_BUNDLE}.min.css?t=1780941899"
    )
    urls.add(
        f"https://static.tildacdn.com/ws/project13402595/{PAGE_BUNDLE}.min.js?t=1780941899"
    )

    print(f"Downloading {len(urls)} assets...")
    for url in sorted(urls):
        download_asset(url)

    favicon_src = ROOT / "assets-premium1" / "media" / "favicon.png"
    favicon_dst = ASSETS / "media" / "favicon.png"
    if favicon_src.exists():
        favicon_dst.parent.mkdir(parents=True, exist_ok=True)
        favicon_dst.write_bytes(favicon_src.read_bytes())

    print("Patching CSS font/media URLs...")
    patch_css_font_urls()
    for css_file in ASSETS.rglob("*.css"):
        for url in extract_urls(css_file.read_text(encoding="utf-8", errors="ignore")):
            if "tildacdn" in url:
                download_asset(url)

    print("Transforming HTML...")
    text = remove_audio_block(text)
    text = remove_seller_blocks(text)
    text = remove_smooth_scroll(text)
    text = remove_footer(text)
    text = remove_postnikov_mods(text)
    text = remove_tilda_stat(text)
    text = remove_dns_prefetch(text)
    text = update_head_meta(text)
    text = update_favicon(text)
    text = replace_external_links(text)
    text = apply_ua_text(text)
    text = add_heading_styles(text)
    text = replace_names_svg_with_html(text)
    text = apply_dual_line_headings(text)
    text = patch_envelope_scroll(text)
    text = rewrite_asset_urls(text)
    text = add_bootstrap_patches(text)
    text = add_web3forms_script(text)

    SRC_HTML.write_text(text, encoding="utf-8")

    gz = decompress_gzip_assets()
    print(f"Decompressed {gz} gzip files")
    print("Done:", SRC_HTML)


if __name__ == "__main__":
    main()
