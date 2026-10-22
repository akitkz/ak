#!/usr/bin/env python3
"""
Импорт прайса Алтын Авто → data/products.json
Наценка задаётся в MARKUP_PERCENT.

Использование:
  python scripts/import_altyn.py path/to/price-list.xlsx
  python scripts/import_altyn.py path/to/price-list.xlsx --markup 20
  python scripts/import_altyn.py path/to/price-list.xlsx --limit 500
  python scripts/import_altyn.py path/to/price-list.xlsx --full
"""
import argparse
import json
import re
import sys
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print("Установите pandas и openpyxl: pip install pandas openpyxl")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MARKUP = 15


def parse_stock(v):
    if pd.isna(v):
        return 0, "order"
    s = str(v).strip().lower()
    if "более" in s or "больше" in s:
        m = re.search(r"\d+", s)
        n = int(m.group()) if m else 20
        return n, "in"
    try:
        n = int(float(str(v).replace(",", ".").replace(" ", "")))
        return n, ("in" if n > 0 else "order")
    except Exception:
        return 0, "order"


def parse_price(v):
    if pd.isna(v):
        return None
    try:
        return float(str(v).replace(" ", "").replace(",", "."))
    except Exception:
        return None


def convert(xlsx_path: Path, markup: float, limit: int | None, full: bool):
    df = pd.read_excel(xlsx_path, header=None)
    data = df.iloc[4:].copy()
    data.columns = ["empty", "code", "name", "brand", "car", "sku", "oem", "stock", "price", "qty", "sum"]

    products = []
    seen = set()
    for _, row in data.iterrows():
        code = row["code"]
        if pd.isna(code) or str(code).strip() == "":
            continue
        code = str(code).strip()
        sku = row["sku"]
        sku = str(sku).strip() if not pd.isna(sku) else code
        if sku in seen:
            continue
        price = parse_price(row["price"])
        if price is None or price <= 0:
            continue
        stock_n, stock_flag = parse_stock(row["stock"])
        brand = str(row["brand"]).strip() if not pd.isna(row["brand"]) else ""
        name = str(row["name"]).strip() if not pd.isna(row["name"]) else sku
        car = str(row["car"]).strip() if not pd.isna(row["car"]) else ""
        oem = str(row["oem"]).strip() if not pd.isna(row["oem"]) else ""
        sell = round(price * (1 + markup / 100))
        pid = re.sub(r"[^a-zA-Z0-9_-]", "_", code)[:40]
        seen.add(sku)
        products.append({
            "id": pid,
            "sku": sku,
            "brand": brand,
            "name_ru": name,
            "name_kk": name,
            "category": "parts",
            "price": int(sell),
            "price_base": int(round(price)),
            "markup_percent": markup,
            "stock": stock_flag,
            "stock_qty": stock_n,
            "compatible": car,
            "oem": oem,
            "code": code,
        })

    out_dir = ROOT / "data"
    out_dir.mkdir(exist_ok=True)

    if full:
        path = out_dir / "products_full.json"
        path.write_text(json.dumps(products, ensure_ascii=False), encoding="utf-8")
        print(f"Полный каталог: {len(products)} поз. → {path} ({path.stat().st_size/1e6:.1f} MB)")

    # демо / основной файл для сайта
    if limit:
        in_stock = [p for p in products if p["stock"] == "in"]
        demo = (in_stock + [p for p in products if p["stock"] != "in"])[:limit]
    else:
        demo = products

    path = out_dir / "products.json"
    path.write_text(json.dumps(demo, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"products.json: {len(demo)} поз. → {path}")

    cfg = {
        "source": str(xlsx_path.name),
        "markup_percent": markup,
        "formula": "price = price_base * (1 + markup_percent/100)",
        "total_in_file": len(products),
        "published_count": len(demo),
    }
    (out_dir / "pricing.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Наценка: {markup}% | Закуп → сайт")


def main():
    ap = argparse.ArgumentParser(description="Импорт прайса Алтын Авто с наценкой")
    ap.add_argument("xlsx", type=Path, help="Путь к Excel прайсу")
    ap.add_argument("--markup", type=float, default=DEFAULT_MARKUP, help="Наценка % (по умолчанию 15)")
    ap.add_argument("--limit", type=int, default=500, help="Сколько позиций в products.json (0 = все)")
    ap.add_argument("--full", action="store_true", help="Также сохранить products_full.json")
    args = ap.parse_args()
    if not args.xlsx.exists():
        print("Файл не найден:", args.xlsx)
        sys.exit(1)
    limit = None if args.limit == 0 else args.limit
    convert(args.xlsx, args.markup, limit, args.full)


if __name__ == "__main__":
    main()
