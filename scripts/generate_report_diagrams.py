from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:\Users\Anuk1ma\Documents\HTML\BookProject")
OUT_DIR = ROOT / "docs" / "diagrams" / "generated"

WIDTH = 1600
HEIGHT = 900
BG = "#ffffff"
LINE = "#2f2a26"
FILL = "#f7efe4"
ACCENT = "#d7b38a"
TEXT = "#1f1b18"


def font(size: int, bold: bool = False):
    candidates = [
        r"C:\Windows\Fonts\timesbd.ttf" if bold else r"C:\Windows\Fonts\times.ttf",
        r"C:\Windows\Fonts\georgiab.ttf" if bold else r"C:\Windows\Fonts\georgia.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


TITLE_FONT = font(34, bold=True)
TEXT_FONT = font(26)
TEXT_BOLD = font(26, bold=True)
SMALL_FONT = font(22)


def canvas(title: str):
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((40, 40, WIDTH - 40, HEIGHT - 40), radius=28, outline=LINE, width=4, fill=BG)
    draw.text((WIDTH / 2, 70), title, font=TITLE_FONT, fill=TEXT, anchor="ma")
    return image, draw


def box(draw, x1, y1, x2, y2, text, fill=FILL, title=False):
    draw.rounded_rectangle((x1, y1, x2, y2), radius=22, outline=LINE, width=3, fill=fill)
    draw.multiline_text(
        ((x1 + x2) / 2, (y1 + y2) / 2),
        text,
        font=TEXT_BOLD if title else TEXT_FONT,
        fill=TEXT,
        anchor="mm",
        align="center",
        spacing=6,
    )


def arrow(draw, start, end, label=None):
    draw.line((start, end), fill=LINE, width=4)
    x1, y1 = start
    x2, y2 = end
    if abs(x2 - x1) > abs(y2 - y1):
        sign = 1 if x2 > x1 else -1
        draw.polygon(
            [(x2, y2), (x2 - 22 * sign, y2 - 10), (x2 - 22 * sign, y2 + 10)],
            fill=LINE,
        )
    else:
        sign = 1 if y2 > y1 else -1
        draw.polygon(
            [(x2, y2), (x2 - 10, y2 - 22 * sign), (x2 + 10, y2 - 22 * sign)],
            fill=LINE,
        )
    if label:
        mx = (x1 + x2) / 2
        my = (y1 + y2) / 2 - 18
        draw.rounded_rectangle((mx - 90, my - 24, mx + 90, my + 16), radius=12, fill=BG)
        draw.text((mx, my - 4), label, font=SMALL_FONT, fill=TEXT, anchor="ma")


def save(image, name):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    image.save(OUT_DIR / name)


def architecture():
    image, draw = canvas("Рисунок 2.2 - Архитектура web-приложения Archivarius")
    box(draw, 120, 220, 470, 430, "Пользователь\nБраузер", fill="#f8f2ea", title=True)
    box(draw, 620, 170, 980, 330, "Frontend\nReact + Vite", fill=ACCENT, title=True)
    box(draw, 620, 390, 980, 550, "Backend API\nNode.js + Express", fill="#e9d6bb", title=True)
    box(draw, 1120, 260, 1470, 460, "База данных\nPostgreSQL (Neon)", fill="#f1e3d1", title=True)
    box(draw, 620, 620, 980, 760, "Деплой\nVercel + Render", fill="#f8f2ea")
    arrow(draw, (470, 320), (620, 250), "HTTP")
    arrow(draw, (470, 340), (620, 470), "API")
    arrow(draw, (980, 470), (1120, 360), "SQL")
    arrow(draw, (800, 330), (800, 390), "REST")
    arrow(draw, (800, 550), (800, 620), "Deploy")
    save(image, "architecture.png")


def erd():
    image, draw = canvas("Рисунок 2.3 - ER-диаграмма базы данных")
    tables = {
        "users": (100, 170, 420, 350, "users\nid\nname\nemail\npassword_hash\nrole\navatar_url"),
        "books": (610, 100, 980, 320, "books\nid\ntitle\nauthor\ngenre\ndescription\nprice_kzt\ncover_url"),
        "favorites": (500, 380, 760, 520, "favorites\nid\nuser_id\nbook_id"),
        "cart_items": (800, 380, 1080, 550, "cart_items\nid\nuser_id\nbook_id\nquantity"),
        "orders": (140, 590, 470, 800, "orders\nid\nuser_id\nstatus\ntotal_price\ndelivery_city\npayment_method"),
        "order_items": (640, 620, 1000, 820, "order_items\nid\norder_id\nbook_id\nquantity\nprice"),
    }
    for name, coords in tables.items():
        x1, y1, x2, y2, label = coords
        box(draw, x1, y1, x2, y2, label, fill=FILL, title=True)
    arrow(draw, (420, 260), (610, 210), "1:M")
    arrow(draw, (330, 350), (560, 450), "1:M")
    arrow(draw, (360, 350), (870, 450), "1:M")
    arrow(draw, (280, 590), (280, 350), "1:M")
    arrow(draw, (470, 700), (640, 700), "1:M")
    arrow(draw, (980, 220), (900, 380), "1:M")
    arrow(draw, (980, 220), (840, 620), "1:M")
    save(image, "erd.png")


def navigation():
    image, draw = canvas("Рисунок 2.1 - Структура и навигация web-приложения Archivarius")
    box(draw, 650, 120, 960, 220, "Главная страница", fill=ACCENT, title=True)
    box(draw, 220, 300, 520, 400, "Каталог")
    box(draw, 620, 300, 980, 400, "Карточка книги")
    box(draw, 1080, 300, 1380, 400, "Контакты")
    box(draw, 120, 540, 420, 660, "Вход / Регистрация")
    box(draw, 520, 540, 820, 660, "Профиль\nИзбранное\nЗаказы")
    box(draw, 920, 540, 1220, 660, "Корзина / Checkout")
    box(draw, 1260, 540, 1500, 660, "Админ-панель")
    for start, end, label in [
        ((805, 220), (370, 300), None),
        ((805, 220), (800, 300), None),
        ((805, 220), (1230, 300), None),
        ((370, 400), (270, 540), None),
        ((800, 400), (670, 540), None),
        ((800, 400), (1070, 540), None),
        ((670, 660), (1260, 600), "роль admin"),
    ]:
        arrow(draw, start, end, label)
    save(image, "navigation.png")


def use_case():
    image, draw = canvas("Рисунок 2.4 - Диаграмма вариантов использования")
    box(draw, 90, 250, 300, 430, "Пользователь", fill="#f8f2ea", title=True)
    box(draw, 1290, 250, 1510, 430, "Администратор", fill="#f8f2ea", title=True)
    use_cases = [
        (470, 150, 1130, 230, "Поиск и просмотр каталога"),
        (470, 260, 1130, 340, "Регистрация и вход"),
        (470, 370, 1130, 450, "Избранное и корзина"),
        (470, 480, 1130, 560, "Оформление и отмена заказа"),
        (470, 590, 1130, 670, "Управление книгами и пользователями"),
    ]
    for x1, y1, x2, y2, label in use_cases:
        draw.ellipse((x1, y1, x2, y2), outline=LINE, width=3, fill=FILL)
        draw.text(((x1 + x2) / 2, (y1 + y2) / 2), label, font=TEXT_FONT, fill=TEXT, anchor="mm")
    for end in [(470, 190), (470, 300), (470, 410), (470, 520)]:
        arrow(draw, (300, 340), end)
    for end in [(1130, 520), (1130, 630)]:
        arrow(draw, (1290, 340), end)
    save(image, "use-case.png")


def order_flow():
    image, draw = canvas("Рисунок 2.5 - Схема процесса оформления заказа")
    steps = [
        (620, 140, 980, 240, "Выбор книги"),
        (620, 300, 980, 400, "Добавление в корзину"),
        (620, 460, 980, 560, "Ввод города,\nадреса и способа оплаты"),
        (620, 620, 980, 720, "Проверка формы\nи создание заказа"),
    ]
    for coords in steps:
        box(draw, *coords[:4], coords[4], fill=FILL, title=True)
    arrow(draw, (800, 240), (800, 300))
    arrow(draw, (800, 400), (800, 460))
    arrow(draw, (800, 560), (800, 620))
    draw.ellipse((650, 770, 950, 850), outline=LINE, width=3, fill="#f8f2ea")
    draw.text((800, 810), "Заказ сохранен\nв базе данных", font=TEXT_BOLD, fill=TEXT, anchor="mm")
    arrow(draw, (800, 720), (800, 770))
    save(image, "order-flow.png")


def main():
    architecture()
    erd()
    navigation()
    use_case()
    order_flow()
    print(f"Saved diagrams to {OUT_DIR}")


if __name__ == "__main__":
    main()
